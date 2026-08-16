'use client';

import React, { useState, useEffect } from "react";
import "./FlipClock.css";
import { usePreferencesStore } from '@/store/usePreferencesStore';

const AnimatedCard = ({ animation, digit }: { animation: string, digit: string }) => {
    return (
        <div className={`flipCard ${animation}`}>
            <span>{digit}</span>
        </div>
    );
};

const StaticCard = ({ position, digit }: { position: string, digit: string }) => {
    return (
        <div className={position}>
            <span>{digit}</span>
        </div>
    );
};

const FlipUnitContainer = ({ digit, shuffle, max, blendMode }: { digit: number, shuffle: boolean, max: number, blendMode: string }) => {
    let currentDigit = digit;
    let previousDigit = digit + 1;

    // Time rolls downwards (e.g. 59 -> 58), so previous is +1.
    // If it was 0, it rolled from 1. If it was 59, it rolled from 0 (or max).
    if (previousDigit > max) {
        previousDigit = 0;
    }

    const currentStr = currentDigit < 10 ? `0${currentDigit}` : `${currentDigit}`;
    const previousStr = previousDigit < 10 ? `0${previousDigit}` : `${previousDigit}`;

    const digit1 = shuffle ? previousStr : currentStr;
    const digit2 = !shuffle ? previousStr : currentStr;

    const animation1 = shuffle ? "fold" : "unfold";
    const animation2 = !shuffle ? "fold" : "unfold";

    return (
        <div 
            className={"flipUnitContainer font-sans font-bold tabular-nums"}
            style={{ mixBlendMode: blendMode as any }}
        >
            <StaticCard key={`upper-${currentStr}`} position={"upperCard"} digit={currentStr} />
            <StaticCard key={`lower-${previousStr}`} position={"lowerCard"} digit={previousStr} />
            <AnimatedCard digit={digit1} animation={animation1} />
            <AnimatedCard digit={digit2} animation={animation2} />
        </div>
    );
};

export const AnimatedFlipClock = ({ minutes, seconds }: { minutes: number, seconds: number }) => {
    const { theme } = usePreferencesStore();
    
    // Determine if text is light (white) or dark (black) to apply the correct knockout blend mode
    const isLightText = theme.preset === 'custom'
        ? (theme.variables?.['--text-primary'] ? theme.variables['--text-primary'] !== '#000000' && theme.variables['--text-primary'] !== '#18181b' && theme.variables['--text-primary'] !== '#241933' && theme.variables['--text-primary'] !== '#2a2421' : true)
        : (theme.preset === 'oled' || theme.preset === 'lo-fi');

    const blendMode = isLightText ? 'multiply' : 'screen';

    const [minShuffle, setMinShuffle] = useState(true);
    const [secShuffle, setSecShuffle] = useState(true);
    
    // We need refs to track previous values to trigger shuffles
    const [prevMinutes, setPrevMinutes] = useState(minutes);
    const [prevSeconds, setPrevSeconds] = useState(seconds);

    useEffect(() => {
        if (seconds !== prevSeconds) {
            setSecShuffle(!secShuffle);
            setPrevSeconds(seconds);
        }
    }, [seconds, prevSeconds, secShuffle]);

    useEffect(() => {
        if (minutes !== prevMinutes) {
            setMinShuffle(!minShuffle);
            setPrevMinutes(minutes);
        }
    }, [minutes, prevMinutes, minShuffle]);

    return (
        <div className={"flipClock flex gap-4 drop-shadow-2xl"}>
            <FlipUnitContainer digit={minutes} shuffle={minShuffle} max={120} blendMode={blendMode} />
            <FlipUnitContainer digit={seconds} shuffle={secShuffle} max={59} blendMode={blendMode} />
        </div>
    );
};
