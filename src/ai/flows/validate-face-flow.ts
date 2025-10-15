'use server';
/**
 * @fileOverview A user face validation AI agent.
 *
 * - validateFace - A function that handles the face validation process.
 * - ValidateFaceInput - The input type for the validateFace function.
 * - ValidateFaceOutput - The return type for the validateFace function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateFaceInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a person's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ValidateFaceInput = z.infer<typeof ValidateFaceInputSchema>;

const ValidateFaceOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the photo is valid for an ID card.'),
  reasons: z.array(z.string()).describe('A list of reasons why the photo is not valid. This will be empty if the photo is valid.'),
});
export type ValidateFaceOutput = z.infer<typeof ValidateFaceOutputSchema>;

export async function validateFace(input: ValidateFaceInput): Promise<ValidateFaceOutput> {
  return validateFaceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateFacePrompt',
  input: {schema: ValidateFaceInputSchema},
  output: {schema: ValidateFaceOutputSchema},
  prompt: `You are a strict photo validation AI for a university's digital ID card system.
You must analyze the provided photo to ensure it meets the following criteria for a professional ID photo:
1. The person's face must be facing the camera straight on.
2. The person's eyes must be clearly open.
3. The person's mouth must be closed with a neutral expression.

Analyze the photo provided and determine if it's valid.
If it is not valid, provide a list of all the reasons why.

Photo: {{media url=photoDataUri}}`,
});

const validateFaceFlow = ai.defineFlow(
  {
    name: 'validateFaceFlow',
    inputSchema: ValidateFaceInputSchema,
    outputSchema: ValidateFaceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
