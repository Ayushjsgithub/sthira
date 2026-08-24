'use client';

import React, { useState } from 'react';
import { motion, MotionProps, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface LiquidGlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  draggable?: boolean;
  expandable?: boolean;
  width?: string;
  height?: string;
  expandedWidth?: string;
  expandedHeight?: string;
  blurIntensity?: 'sm' | 'md' | 'lg' | 'xl';
  shadowIntensity?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  borderRadius?: string;
  glowIntensity?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export const LiquidGlassCard = ({
  children,
  className = '',
  draggable = false,
  expandable = false,
  width,
  height,
  expandedWidth,
  expandedHeight,
  blurIntensity = 'xl',
  borderRadius = '24px',
  glowIntensity = 'sm',
  shadowIntensity = 'md',
  onClick,
  style,
  ...props
}: LiquidGlassCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpansion = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) onClick(e);
    if (!expandable) return;
    const target = e.target as HTMLElement;
    if (target.closest('a, button, input, select, textarea')) return;
    setIsExpanded(!isExpanded);
  };

  const blurClasses = {
    sm: 'backdrop-blur-xs',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
  };

  const shadowStyles = {
    none: 'inset 0 0 0 0 rgba(255, 255, 255, 0)',
    xs: 'inset 1px 1px 1px 0 rgba(255, 255, 255, 0.3), inset -1px -1px 1px 0 rgba(255, 255, 255, 0.3)',
    sm: 'inset 2px 2px 2px 0 rgba(255, 255, 255, 0.35), inset -2px -2px 2px 0 rgba(255, 255, 255, 0.35)',
    md: 'inset 3px 3px 3px 0 rgba(255, 255, 255, 0.45), inset -3px -3px 3px 0 rgba(255, 255, 255, 0.45)',
    lg: 'inset 4px 4px 4px 0 rgba(255, 255, 255, 0.5), inset -4px -4px 4px 0 rgba(255, 255, 255, 0.5)',
    xl: 'inset 6px 6px 6px 0 rgba(255, 255, 255, 0.55), inset -6px -6px 6px 0 rgba(255, 255, 255, 0.55)',
    '2xl': 'inset 8px 8px 8px 0 rgba(255, 255, 255, 0.6), inset -8px -8px 8px 0 rgba(255, 255, 255, 0.6)',
  };

  const glowStyles = {
    none: '0 4px 4px rgba(0, 0, 0, 0.05), 0 0 12px rgba(0, 0, 0, 0.05)',
    xs: '0 4px 4px rgba(0, 0, 0, 0.15), 0 0 12px rgba(0, 0, 0, 0.08), 0 0 16px rgba(255, 255, 255, 0.05)',
    sm: '0 4px 4px rgba(0, 0, 0, 0.15), 0 0 12px rgba(0, 0, 0, 0.08), 0 0 24px rgba(255, 255, 255, 0.1)',
    md: '0 4px 4px rgba(0, 0, 0, 0.15), 0 0 12px rgba(0, 0, 0, 0.08), 0 0 32px rgba(255, 255, 255, 0.15)',
    lg: '0 4px 4px rgba(0, 0, 0, 0.15), 0 0 12px rgba(0, 0, 0, 0.08), 0 0 40px rgba(255, 255, 255, 0.2)',
    xl: '0 4px 4px rgba(0, 0, 0, 0.15), 0 0 12px rgba(0, 0, 0, 0.08), 0 0 48px rgba(255, 255, 255, 0.25)',
    '2xl': '0 4px 4px rgba(0, 0, 0, 0.15), 0 0 12px rgba(0, 0, 0, 0.08), 0 0 60px rgba(255, 255, 255, 0.3)',
  };

  const containerVariants: Variants | undefined = expandable
    ? {
        collapsed: {
          width: width || 'auto',
          height: height || 'auto',
          transition: {
            duration: 0.4,
            ease: [0.5, 1.5, 0.5, 1],
          },
        },
        expanded: {
          width: expandedWidth || 'auto',
          height: expandedHeight || 'auto',
          transition: {
            duration: 0.4,
            ease: [0.5, 1.5, 0.5, 1],
          },
        },
      }
    : undefined;

  return (
    <>
      {/* Global SVG Liquid Glass Filter */}
      <svg className="absolute w-0 h-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <defs>
          <filter
            id="liquid-glass-blur"
            x="0"
            y="0"
            width="100%"
            height="100%"
            filterUnits="objectBoundingBox"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.003 0.007"
              numOctaves={1}
              result="turbulence"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale={200}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <motion.div
        className={cn(
          `relative overflow-hidden ${draggable ? 'cursor-grab active:cursor-grabbing' : ''} ${expandable ? 'cursor-pointer' : ''}`,
          className
        )}
        style={{
          borderRadius,
          ...(width && !expandable ? { width } : {}),
          ...(height && !expandable ? { height } : {}),
          ...style,
        }}
        variants={expandable ? containerVariants : undefined}
        animate={expandable ? (isExpanded ? 'expanded' : 'collapsed') : undefined}
        onClick={handleToggleExpansion}
        drag={draggable}
        dragConstraints={draggable ? { left: 0, right: 0, top: 0, bottom: 0 } : undefined}
        dragElastic={draggable ? 0.3 : undefined}
        dragTransition={
          draggable
            ? {
                bounceStiffness: 300,
                bounceDamping: 10,
                power: 0.3,
              }
            : undefined
        }
        whileDrag={draggable ? { scale: 1.02 } : undefined}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        {...(props as MotionProps)}
      >
        {/* Bend Layer (Backdrop blur with refraction displacement) */}
        <div
          className={cn('absolute inset-0 z-0 bg-foreground/[0.04]', blurClasses[blurIntensity])}
          style={{
            borderRadius,
            filter: 'url(#liquid-glass-blur)',
          }}
        />

        {/* Face Layer (Ambient Glow & Depth Drop) */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            borderRadius,
            boxShadow: glowStyles[glowIntensity],
          }}
        />

        {/* Edge Layer (Refractive Inner Specular Bevel Highlights) */}
        <div
          className="absolute inset-0 z-20 pointer-events-none border border-foreground/15"
          style={{
            borderRadius,
            boxShadow: shadowStyles[shadowIntensity],
          }}
        />

        {/* Content Container */}
        <div className="relative z-30 w-full h-full">
          {children}
        </div>
      </motion.div>
    </>
  );
};
