import React from 'react';
import type { RestoreSettings } from '../types';

interface ControlsPanelProps {
    settings: RestoreSettings;
    setSettings: React.Dispatch<React.SetStateAction<RestoreSettings>>;
    onSubmit: () => void;
    isLoading: boolean;
    isImageUploaded: boolean;
}

const Checkbox: React.FC<{ label: string; checked: boolean; onChange: (checked: boolean) => void; }> = ({ label, checked, onChange }) => (
    <label className="flex items-center space-x-2 cursor-pointer text-gray-300 text-sm">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="form-checkbox h-4 w-4 bg-gray-600 border-gray-500 rounded text-blue-500 focus:ring-blue-500" />
        <span>{label}</span>
    </label>
);

const Select: React.FC<{ label: string; value: string; onChange: (value: string) => void; options: string[]; }> = ({ label, value, onChange, options }) => (
    <div className="w-full">
        <label className="text-xs text-gray-400 mb-1 block">{label}</label>
        <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm text-white focus:ring-blue-500 focus:border-blue-500">
            {options.map(opt => <option key={opt}>{opt}</option>)}
        </select>
    </div>
);

const PresetButton: React.FC<{ label: string; onClick: () => void; }> = ({ label, onClick }) => (
    <button onClick={onClick} className="bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm py-2 px-3 rounded-md transition-colors duration-200 w-full">
        {label}
    </button>
);


export const ControlsPanel: React.FC<ControlsPanelProps> = ({ settings, setSettings, onSubmit, isLoading, isImageUploaded }) => {
    
    const handlePreset = (preset: Partial<RestoreSettings>) => {
        setSettings(s => ({...s, ...preset}));
    }

    return (
        <div className="bg-[#292d33] rounded-xl p-6 flex flex-col h-full overflow-y-auto">
            <h2 className="text-xl font-semibold mb-6">Phục Chế Ảnh Cũ</h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
                <Checkbox label="Tô màu" checked={settings.colorize} onChange={c => setSettings(s => ({...s, colorize: c}))} />
                <Checkbox label="Bám theo chi tiết khuôn mặt" checked={settings.stickToFaceDetails} onChange={c => setSettings(s => ({...s, stickToFaceDetails: c}))} />
                <Checkbox label="Chất lượng cao" checked={settings.highQuality} onChange={c => setSettings(s => ({...s, highQuality: c}))} />
                <Checkbox label="Làm nét" checked={settings.sharpen} onChange={c => setSettings(s => ({...s, sharpen: c}))} />
                <Checkbox label="Làm nét nếp nhăn" checked={settings.sharpenWrinkles} onChange={c => setSettings(s => ({...s, sharpenWrinkles: c}))} />
                <Checkbox label="Vẽ lại tóc chi tiết" checked={settings.redrawHair} onChange={c => setSettings(s => ({...s, redrawHair: c}))} />
                <Checkbox label="Người Việt Nam" checked={settings.isVietnamese} onChange={c => setSettings(s => ({...s, isVietnamese: c}))} />
                <Checkbox label="Làm rõ nét hậu cảnh" checked={settings.sharpenBackground} onChange={c => setSettings(s => ({...s, sharpenBackground: c}))} />
                <Checkbox label="Vẽ lại trang phục" checked={settings.redrawClothing} onChange={c => setSettings(s => ({...s, redrawClothing: c}))} />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <Select label="Giới tính" value={settings.gender} onChange={v => setSettings(s => ({...s, gender: v as RestoreSettings['gender']}))} options={['Automatic', 'Male', 'Female']} />
                <Select label="Độ tuổi" value={settings.age} onChange={v => setSettings(s => ({...s, age: v as RestoreSettings['age']}))} options={['Automatic', 'Child', 'Young Adult', 'Adult', 'Senior']} />
                <Select label="Nụ cười" value={settings.smile} onChange={v => setSettings(s => ({...s, smile: v as RestoreSettings['smile']}))} options={['Automatic', 'Add Smile', 'Neutral']} />
            </div>

            <div className="mb-6">
                <h3 className="text-xs text-gray-400 mb-2">Hoặc chọn một mẫu có sẵn</h3>
                <div className="grid grid-cols-2 gap-3">
                    <PresetButton label="Phục chế chất lượng cao" onClick={() => handlePreset({ highQuality: true, colorize: false })} />
                    <PresetButton label="Phục chế & Tô màu" onClick={() => handlePreset({ highQuality: true, colorize: true })} />
                    <PresetButton label="Tái tạo ảnh hồng nầng" onClick={() => handlePreset({ advancedPrompt: 'Recreate with a rosy, vibrant, and slightly nostalgic feel.' })} />
                    <PresetButton label="Khử ố vàng & Phai màu" onClick={() => handlePreset({ advancedPrompt: 'Focus on removing yellow stains and faded colors, restoring original tones.' })} />
                </div>
            </div>

            <div className="space-y-4 flex-grow">
                 <div>
                    <label className="text-xs text-gray-400 mb-1 block">Yêu cầu nâng cao (Tùy chọn)</label>
                    <textarea value={settings.advancedPrompt} onChange={(e) => setSettings(s => ({...s, advancedPrompt: e.target.value}))} rows={2} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm text-white focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., make the sky blue, change shirt color to red..."></textarea>
                </div>
                <div>
                    <label className="text-xs text-gray-400 mb-1 block">Số lượng kết quả (tối đa 5)</label>
                    <input type="number" min="1" max="5" value={settings.numResults} onChange={(e) => setSettings(s => ({...s, numResults: parseInt(e.target.value, 10)}))} className="w-24 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
            </div>

            <button
                onClick={onSubmit}
                disabled={isLoading || !isImageUploaded}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 mt-6"
            >
                {isLoading ? 'Đang xử lý...' : 'Phục chế ảnh'}
            </button>
        </div>
    );
};
