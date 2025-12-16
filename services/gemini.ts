import { GoogleGenAI } from "@google/genai";
import { EnhancementMode, UpscaleLevel } from '../types';

// Prompt templates based on the brief
const PROMPTS = {
  [EnhancementMode.LANDSCAPE]: `
Enhance landscape image clarity and sharpness.
Increase fine details in distant objects such as buildings, trees, mountains, and clouds.
Improve micro-contrast and edge definition while keeping natural colors.
Avoid over-sharpening, halos, or artificial textures.
Preserve realistic lighting and atmosphere.
Negative prompt: over-sharpening, noise, halos, artifacts, unrealistic colors, oversaturated sky.
`,
  [EnhancementMode.PORTRAIT]: `
Enhance portrait image with natural skin preservation.
Sharpen eyes, eyelashes, eyebrows, lips, and hair details.
Maintain smooth and realistic skin texture.
Avoid skin over-smoothing or excessive sharpening.
Keep natural skin tones and facial proportions.
Negative prompt: plastic skin, over-smoothing, harsh sharpening, unnatural skin tone, artifacts.
`,
  [EnhancementMode.PRODUCT]: `
Enhance product image sharpness and clarity.
Improve edge definition, text readability, logos, and surface details.
Increase overall crispness while keeping clean background.
Avoid reflections distortion and excessive contrast.
Maintain true product colors.
Negative prompt: blurred edges, color shift, noise, artificial reflections, distorted text.
`,
  [EnhancementMode.RETOUCH]: `
Professional beauty retouch and image enhancement.
Remove acne, cystic acne, blackheads, and skin blemishes.
Preserve natural skin texture, pores, and facial structure.
Enhance facial details such as eyes, lips, and hair naturally.
Maintain realistic lighting and color balance.

Apply subtle sharpening to eyes, eyelashes, eyebrows, and lips.
Avoid sharpening skin texture excessively.

CRITICAL INSTRUCTIONS FOR SKIN TONE:
1. If the subject has dark or brown skin tone:
   - Remove acne and blackheads only.
   - Do NOT brighten, whiten, or alter natural skin tone.
   - Preserve original skin color and texture.
   - Avoid skin smoothing beyond acne removal.

2. If the subject has fair or light skin tone:
   - Remove acne, blackheads, and minor imperfections.
   - Apply gentle skin smoothing while preserving pores.
   - Enhance skin to a soft, healthy, pinkish-white tone.
   - Avoid excessive whitening or unnatural glow.

Negative prompt: skin whitening (for dark skin), skin brightening (for dark skin), color shift, plastic skin, loss of texture, over-smoothing, over-whitening, harsh blur, unnatural glow.
`
};

export const enhanceImage = async (
  base64Image: string,
  mode: EnhancementMode,
  upscale: UpscaleLevel
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Determine model. For high fidelity retouching, use a capable model.
  // Using gemini-2.5-flash-image as the standard image editing model.
  const modelName = 'gemini-2.5-flash-image';

  // Construct prompt
  let promptText = PROMPTS[mode];

  // Add upscale hint
  if (upscale !== UpscaleLevel.OG) {
    promptText += `\nOutput the result in high resolution. Enhance details significantly (Simulate ${upscale} upscale).`;
  }

  const mimeType = base64Image.substring(
    base64Image.indexOf(":") + 1,
    base64Image.indexOf(";")
  );
  const cleanBase64 = base64Image.split(',')[1];

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [
          {
            text: promptText,
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64,
            },
          },
        ],
      },
      // Note: gemini-2.5-flash-image does not support 'responseMimeType' or 'imageConfig' in the standard way for edits yet,
      // but it will return an image in the parts.
    });

    // Extract image from response
    // The response might contain text (if it failed or has comments) or an image.
    const parts = response.candidates?.[0]?.content?.parts;
    
    if (!parts) {
      throw new Error("No content generated.");
    }

    // Find the image part
    const imagePart = parts.find(p => p.inlineData);

    if (imagePart && imagePart.inlineData) {
        return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
    }

    // If no image part, maybe text explanation of why?
    const textPart = parts.find(p => p.text);
    if (textPart) {
        console.warn("Model returned text instead of image:", textPart.text);
        throw new Error("The AI returned text instead of an image. Please try a different image or mode.");
    }

    throw new Error("Failed to generate image.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};