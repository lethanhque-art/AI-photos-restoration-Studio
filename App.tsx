
import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { ControlsPanel } from './components/ControlsPanel';
import { ImagePanel } from './components/ImagePanel';
import { restorePhoto } from './services/geminiService';
import type { RestoreSettings } from './types';

const App: React.FC = () => {
    const [settings, setSettings] = useState<RestoreSettings>({
        colorize: true,
        highQuality: true,
        redrawHair: false,
        sharpenBackground: false,
        stickToFaceDetails: true,
        sharpenWrinkles: false,
        isVietnamese: true,
        redrawClothing: false,
        gender: 'Automatic',
        age: 'Automatic',
        smile: 'Automatic',
        advancedPrompt: '',
        numResults: 1,
    });
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setOriginalImage(reader.result as string);
            setProcessedImage(null);
            setError(null);
        };
        reader.readAsDataURL(file);
    };
    
    const handleSubmit = useCallback(async () => {
        if (!originalImage) {
            setError("Please upload an image first.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setProcessedImage(null);

        try {
            const result = await restorePhoto(originalImage, settings);
            setProcessedImage(result);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [originalImage, settings]);

    const handleReset = () => {
        setOriginalImage(null);
        setProcessedImage(null);
        setError(null);
    };

    return (
        <div className="min-h-screen bg-[#1e2025] flex flex-col lg:flex-row font-sans">
            <Sidebar />
            <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 p-4 lg:p-6 gap-6">
                <ControlsPanel 
                    settings={settings} 
                    setSettings={setSettings} 
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    isImageUploaded={!!originalImage}
                />
                <ImagePanel 
                    originalImage={originalImage}
                    processedImage={processedImage}
                    isLoading={isLoading}
                    error={error}
                    onImageUpload={handleImageUpload}
                    onReset={handleReset}
                />
            </main>
        </div>
    );
};

export default App;
