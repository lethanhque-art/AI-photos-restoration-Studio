
import { GoogleGenAI, Modality } from '@google/genai';
import type { RestoreSettings } from '../types';

function fileToBase64(fileDataUrl: string): {mimeType: string, data: string} {
    const [header, base64Data] = fileDataUrl.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1] || 'application/octet-stream';
    return { mimeType, data: base64Data };
}

function buildPrompt(settings: RestoreSettings): string {
    let prompt = "Please restore this old and potentially damaged photograph. ";
    const enhancements: string[] = [];
    
    if (settings.colorize) enhancements.push("colorize it vibrantly and naturally");
    if (settings.highQuality) enhancements.push("enhance it to high quality, improving resolution and clarity");
    if (settings.redrawHair) enhancements.push("carefully redraw and define hair details");
    if (settings.sharpenBackground) enhancements.push("sharpen the background details while keeping focus on the subjects");
    if (settings.stickToFaceDetails) enhancements.push("preserve and enhance the original facial features accurately");
    if (settings.sharpenWrinkles) enhancements.push("subtly sharpen wrinkles and textures for a more realistic look");
    if (settings.redrawClothing) enhancements.push("redraw and enhance the details of the clothing");
    
    if (enhancements.length > 0) {
        prompt += "Apply the following enhancements: " + enhancements.join(', ') + ". ";
    }

    if (settings.isVietnamese) {
        prompt += "The subjects in the photo are likely Vietnamese. Keep this cultural context in mind for accurate restoration of features and skin tones. "
    }

    if (settings.gender !== 'Automatic') {
        prompt += `The gender of the main subject is ${settings.gender}. `;
    }
    if (settings.age !== 'Automatic') {
        prompt += `The age of the main subject is approximately ${settings.age}. `;
    }
    if (settings.smile === 'Add Smile') {
        prompt += `If possible, add a subtle, natural-looking smile to the subjects. `;
    }
    
    if(settings.advancedPrompt) {
        prompt += `\n\nAdvanced user request: "${settings.advancedPrompt}"`;
    }

    prompt += "\n\nThe final output should be only the restored image, without any text or annotations."

    return prompt;
}

export const restorePhoto = async (imageDataUrl: string, settings: RestoreSettings): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const { mimeType, data } = fileToBase64(imageDataUrl);
    const textPrompt = buildPrompt(settings);

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: { data, mimeType },
                    },
                    {
                        text: textPrompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (imagePart && imagePart.inlineData) {
            return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
        } else {
            throw new Error("No image was generated. The model may have refused the request.");
        }
    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error("Failed to restore photo. Please check the console for more details.");
    }
};
