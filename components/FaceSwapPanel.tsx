
import React, { useState, useRef, useCallback } from 'react';
import { DownloadIcon, UploadIcon, UsersIcon } from './Icons';
import { swapFaces } from '../services/geminiService';

const LoadingSpinner: React.FC = () => (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center rounded-xl z-10">
        <svg className="animate-spin h-10 w-10 text-white mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg font-semibold">Đang tạo...</p>
        <p className="text-sm text-gray-300">Quá trình này có thể mất một lúc.</p>
    </div>
);

const ImageUploader: React.FC<{ image: string | null; onImageUpload: (file: File) => void; title: string; description: string; }> = ({ image, onImageUpload, title, description }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            onImageUpload(event.target.files[0]);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <div className="w-full aspect-square border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center relative mb-4">
                {image ? (
                    <img src={image} alt={title} className="max-w-full max-h-full object-contain rounded-lg"/>
                ) : (
                    <div className="text-center text-gray-400 p-4">
                        <UploadIcon className="w-10 h-10 mx-auto mb-2"/>
                        <p className="text-sm">{description}</p>
                    </div>
                )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden"/>
            <button onClick={handleUploadClick} className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
                {image ? 'Đổi ảnh' : 'Tải ảnh lên'}
            </button>
        </div>
    );
};

export const FaceSwapPanel: React.FC = () => {
    const [sourceImage, setSourceImage] = useState<string | null>(null);
    const [targetImage, setTargetImage] = useState<string | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = (file: File, setImage: React.Dispatch<React.SetStateAction<string | null>>) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = useCallback(async () => {
        if (!sourceImage || !targetImage) {
            setError("Vui lòng tải lên cả ảnh gốc (mặt) và ảnh đích (thân hình).");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResultImage(null);
        try {
            const result = await swapFaces(sourceImage, targetImage);
            setResultImage(result);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định.");
        } finally {
            setIsLoading(false);
        }
    }, [sourceImage, targetImage]);

    const handleDownload = () => {
        if (!resultImage) return;
        const link = document.createElement('a');
        link.href = resultImage;
        link.download = 'ket-qua-ghep-mat.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-[#292d33] rounded-xl p-6 h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-6">Ghép Mặt Ảnh Gia Đình</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow">
                <ImageUploader 
                    image={sourceImage} 
                    onImageUpload={(file) => handleImageUpload(file, setSourceImage)}
                    title="Ảnh Gốc (Mặt)"
                    description="Tải lên ảnh rõ mặt bạn muốn sử dụng."
                />
                <ImageUploader 
                    image={targetImage} 
                    onImageUpload={(file) => handleImageUpload(file, setTargetImage)}
                    title="Ảnh Đích (Thân hình)"
                    description="Tải lên ảnh bạn muốn ghép mặt vào."
                />

                <div className="flex flex-col md:col-span-2 lg:col-span-1">
                    <h3 className="text-lg font-semibold mb-2">Kết quả</h3>
                     <div className="w-full aspect-square border-2 border-gray-500 bg-gray-800/50 rounded-xl flex items-center justify-center relative">
                        {isLoading && <LoadingSpinner />}
                        {resultImage && !isLoading ? (
                            <img src={resultImage} alt="Result" className="max-w-full max-h-full object-contain rounded-lg"/>
                        ) : (
                            !isLoading && (
                                <div className="text-center text-gray-400 p-4">
                                    <UsersIcon className="w-10 h-10 mx-auto mb-2"/>
                                    <p className="text-sm">Kết quả sẽ hiện ở đây.</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
            
            {error && <p className="text-red-400 text-sm my-4 text-center">{error}</p>}

            <div className="mt-6 flex flex-col sm:flex-row justify-center sm:justify-end items-center gap-4">
                 <button
                    onClick={handleDownload}
                    disabled={!resultImage || isLoading}
                    className="w-full sm:w-auto flex items-center justify-center bg-gray-700 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
                >
                    <DownloadIcon className="w-5 h-5 mr-2" />
                    Tải xuống
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !sourceImage || !targetImage}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
                >
                    {isLoading ? 'Đang tạo...' : 'Ghép mặt'}
                </button>
            </div>
        </div>
    );
};
