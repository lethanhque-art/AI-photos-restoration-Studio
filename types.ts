// FIX: Import React to resolve 'React' namespace for ComponentType.
import type React from 'react';

export interface RestoreSettings {
    colorize: boolean;
    highQuality: boolean;
    redrawHair: boolean;
    sharpenBackground: boolean;
    stickToFaceDetails: boolean;
    sharpenWrinkles: boolean;
    isVietnamese: boolean;
    redrawClothing: boolean;
    sharpen: boolean;
    gender: 'Automatic' | 'Male' | 'Female';
    age: 'Automatic' | 'Child' | 'Young Adult' | 'Adult' | 'Senior';
    smile: 'Automatic' | 'Add Smile' | 'Neutral';
    advancedPrompt: string;
    numResults: number;
}

export interface NavItem {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    active?: boolean;
}
