
import React, { useRef } from 'react';
import { DownloadIcon, UploadIcon } from './Icons';

interface ImagePanelProps {
    originalImage: string | null;
    processedImage: string | null;
    isLoading: boolean;
    error: string | null;
    onImageUpload: (file: File) => void;
    onReset: () => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center rounded-xl z-10">
        <svg className="animate-spin h-10 w-10 text-white mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg font-semibold">Restoring your photo...</p>
        <p className="text-sm text-gray-300">This may take a moment.</p>
    </div>
);

export const ImagePanel: React.FC<ImagePanelProps> = ({ originalImage, processedImage, isLoading, error, onImageUpload, onReset }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            onImageUpload(event.target.files[0]);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleDownload = () => {
        if (!processedImage) return;
        const link = document.createElement('a');
        link.href = processedImage;
        link.download = 'restored-photo.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    const displayImage = processedImage || originalImage;

    return (
        <div className="bg-[#292d33] rounded-xl p-6 flex flex-col items-center justify-center h-full">
            <div className="w-full h-full max-h-[60vh] lg:max-h-full aspect-square border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center relative mb-6">
                {isLoading && <LoadingSpinner />}
                {displayImage ? (
                    <img src={displayImage} alt="Uploaded" className="max-w-full max-h-full object-contain rounded-lg"/>
                ) : (
                    <div className="text-center text-gray-400">
                        <UploadIcon className="w-12 h-12 mx-auto mb-2"/>
                        <p>Upload an old photo to get started</p>
                    </div>
                )}
            </div>
             {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <div className="flex items-center space-x-4">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden"/>
                <button
                    onClick={originalImage ? onReset : handleUploadClick}
                    className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
                >
                    {originalImage ? 'Choose another photo' : 'Choose photo'}
                </button>
                <button
                    onClick={handleDownload}
                    disabled={!processedImage}
                    className="flex items-center bg-gray-700 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
                >
                    <DownloadIcon className="w-5 h-5 mr-2" />
                    Download
                </button>
            </div>
        </div>
    );
};
