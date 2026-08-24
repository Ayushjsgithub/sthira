'use client';

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useId,
  ReactNode,
  CSSProperties,
  HTMLAttributes,
} from 'react';

export interface CurvedScrollContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  borderRadius?: number;
  position?: 'left' | 'right';
  offset?: number;
  extraInset?: number;
  minStartRatio?: number;
  minThumbLength?: number;
  maxThumbLength?: number;
  segments?: number;
  thumbColor?: string;
  thumbColorActive?: string;
  trackColor?: string;
  trackColorActive?: string;
  thumbWidth?: number;
  thumbWidthActive?: number;
  trackWidth?: number;
  trackWidthActive?: number;
  className?: string;
  contentClassName?: string;
}

export function CurvedScrollContainer({
  children,
  borderRadius = 40,
  position = 'right',
  offset = 7,
  extraInset = 2,
  minStartRatio = 0.75,
  minThumbLength = 24,
  maxThumbLength,
  segments = 40,
  thumbColor = '#00bcff',
  thumbColorActive = '#1e90ff',
  trackColor = 'transparent',
  trackColorActive = 'rgba(255, 255, 255, 0.12)',
  thumbWidth = 4,
  thumbWidthActive = 6,
  trackWidth = 4,
  trackWidthActive = 6,
  className = '',
  contentClassName = '',
  style,
  ...rest
}: CurvedScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const trackPathRef = useRef<SVGPathElement | null>(null);
  const thumbPathRef = useRef<SVGPathElement | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);

  const draggingRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const pathLengthRef = useRef(0);
  const thumbLengthRef = useRef(minThumbLength);

  const id = useId();

  const updateThumb = useCallback(() => {
    const content = contentRef.current;
    const trackPath = trackPathRef.current;
    const thumbPath = thumbPathRef.current;

    if (!content || !trackPath || !thumbPath) return;

    const scrollableHeight = content.scrollHeight - content.clientHeight;
    if (scrollableHeight <= 0 || pathLengthRef.current <= 0) {
      thumbPath.setAttribute('d', '');
      setIsScrollable(false);
      return;
    }

    setIsScrollable(true);

    const scrollRatio = Math.max(0, Math.min(1, content.scrollTop / scrollableHeight));
    const pathLength = pathLengthRef.current;
    const thumbLength = thumbLengthRef.current;

    const startOffset = (pathLength - thumbLength) * scrollRatio;
    const endOffset = startOffset + thumbLength;

    const points: string[] = [];
    for (let i = 0; i <= segments; i++) {
      const t = startOffset + ((endOffset - startOffset) / segments) * i;
      const p = trackPath.getPointAtLength(Math.max(0, Math.min(pathLength, t)));
      points.push(`${p.x.toFixed(2)} ${p.y.toFixed(2)}`);
    }

    if (points.length > 0) {
      const segmentD = `M ${points[0]} ${points.slice(1).map((pt) => `L ${pt}`).join(' ')}`;
      thumbPath.setAttribute('d', segmentD);
    }
  }, [segments]);

  const updatePath = useCallback(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    const trackPath = trackPathRef.current;

    if (!container || !content || !trackPath) return;

    const w = container.clientWidth;
    const h = container.clientHeight;

    if (w <= 0 || h <= 0) return;

    const computedR = parseFloat(getComputedStyle(container).borderRadius) || borderRadius;
    const effectiveRadius = Math.max(computedR - offset, 0);

    const trackX = position === 'left' ? offset : w - offset;
    const topY = offset;
    const bottomY = h - offset;
    const cornerX = position === 'left' ? trackX + effectiveRadius : trackX - effectiveRadius;

    const sweepFlag = position === 'left' ? 0 : 1;

    const minStartX = position === 'left' ? w * (1 - minStartRatio) : w * minStartRatio;
    let startX = position === 'left' ? trackX + effectiveRadius * extraInset : trackX - effectiveRadius * extraInset;
    if (position === 'left') {
      if (startX > minStartX) startX = minStartX;
      if (startX < cornerX) startX = cornerX;
    } else {
      if (startX < minStartX) startX = minStartX;
      if (startX > cornerX) startX = cornerX;
    }

    const d = `
      M ${startX.toFixed(2)} ${topY.toFixed(2)}
      L ${cornerX.toFixed(2)} ${topY.toFixed(2)}
      A ${effectiveRadius.toFixed(2)} ${effectiveRadius.toFixed(2)} 0 0 ${sweepFlag} ${trackX.toFixed(2)} ${(topY + effectiveRadius).toFixed(2)}
      L ${trackX.toFixed(2)} ${(bottomY - effectiveRadius).toFixed(2)}
      A ${effectiveRadius.toFixed(2)} ${effectiveRadius.toFixed(2)} 0 0 ${sweepFlag} ${cornerX.toFixed(2)} ${bottomY.toFixed(2)}
      L ${startX.toFixed(2)} ${bottomY.toFixed(2)}
    `;

    trackPath.setAttribute('d', d);

    try {
      const totalLength = trackPath.getTotalLength();
      pathLengthRef.current = totalLength;

      const ratio = content.clientHeight / (content.scrollHeight || 1);
      let calculatedLength = totalLength * ratio;
      if (maxThumbLength !== undefined) {
        calculatedLength = Math.min(calculatedLength, maxThumbLength);
      }
      thumbLengthRef.current = Math.max(minThumbLength, Math.min(totalLength, calculatedLength));

      updateThumb();
    } catch {
      // Ignore initial render calculation
    }
  }, [borderRadius, position, offset, extraInset, minStartRatio, minThumbLength, maxThumbLength, updateThumb]);

  const handlePointerDown = (e: React.PointerEvent<SVGPathElement>) => {
    e.preventDefault();
    e.stopPropagation();

    draggingRef.current = true;
    pointerIdRef.current = e.pointerId;
    setIsDragging(true);

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!draggingRef.current || e.pointerId !== pointerIdRef.current) return;
      const container = containerRef.current;
      const content = contentRef.current;
      if (!container || !content) return;

      const rect = container.getBoundingClientRect();
      const relativeY = e.clientY - rect.top;
      const ratio = Math.max(0, Math.min(1, relativeY / rect.height));

      const scrollableHeight = content.scrollHeight - content.clientHeight;
      content.scrollTop = ratio * scrollableHeight;
      updateThumb();
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!draggingRef.current || e.pointerId !== pointerIdRef.current) return;
      draggingRef.current = false;
      setIsDragging(false);

      if (thumbPathRef.current && pointerIdRef.current !== null) {
        try {
          thumbPathRef.current.releasePointerCapture(pointerIdRef.current);
        } catch {}
      }
      pointerIdRef.current = null;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [updateThumb]);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    updatePath();

    const handleScroll = () => {
      requestAnimationFrame(updateThumb);
    };

    content.addEventListener('scroll', handleScroll, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updatePath();
      });
      resizeObserver.observe(container);
      resizeObserver.observe(content);
    }

    window.addEventListener('resize', updatePath);

    return () => {
      content.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updatePath);
      resizeObserver?.disconnect();
    };
  }, [updatePath, updateThumb]);

  const activeState = isDragging || isHovered;

  const currentThumbColor = isDragging ? thumbColorActive : thumbColor;
  const currentThumbWidth = activeState ? thumbWidthActive : thumbWidth;
  const currentTrackColor = activeState ? trackColorActive : trackColor;
  const currentTrackWidth = activeState ? trackWidthActive : trackWidth;

  const containerStyle: CSSProperties = {
    borderRadius: `${borderRadius}px`,
    ...style,
  };

  return (
    <div
      ref={containerRef}
      id={id}
      className={`relative overflow-hidden contain-size ${className}`}
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...rest}
    >
      <div
        ref={contentRef}
        className={`h-full w-full overflow-y-scroll no-scrollbar p-4 sm:p-6 ${position === 'left' ? 'pl-6 sm:pl-8' : 'pr-6 sm:pr-8'} ${contentClassName}`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {children}
      </div>

      <svg
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full pointer-events-none z-10 transition-opacity duration-300 ${isScrollable ? 'opacity-100' : 'opacity-0'}`}
      >
          <path
            ref={trackPathRef}
            fill="none"
            stroke={currentTrackColor}
            strokeWidth={currentTrackWidth}
            strokeLinecap="round"
            className="transition-[stroke,stroke-width] duration-150 ease-in-out"
          />
          <path
            ref={thumbPathRef}
            fill="none"
            stroke={currentThumbColor}
            strokeWidth={currentThumbWidth}
            strokeLinecap="round"
            onPointerDown={handlePointerDown}
            className="pointer-events-auto transition-[stroke,stroke-width] duration-150 ease-in-out cursor-grab active:cursor-grabbing"
          />
      </svg>
    </div>
  );
}
export default CurvedScrollContainer;
