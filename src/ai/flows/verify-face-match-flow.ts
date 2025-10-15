'use server';
/**
 * @fileOverview A user face verification AI agent.
 *
 * - verifyFaceMatch - A function that handles the face verification process.
 * - VerifyFaceMatchInput - The input type for the verifyFaceMatch function.
 * - VerifyFaceMatchOutput - The return type for the verifyFaceMatch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyFaceMatchInputSchema = z.object({
  savedPhotoDataUri: z
    .string()
    .describe(
      "The saved photo from the user's ID card, as a data URI."
    ),
  verificationPhotoDataUri: z
    .string()
    .describe(
      'The new photo taken for verification, as a data URI.'
    ),
});
export type VerifyFaceMatchInput = z.infer<typeof VerifyFaceMatchInputSchema>;

const VerifyFaceMatchOutputSchema = z.object({
  isMatch: z
    .boolean()
    .describe(
      'Whether the faces in the two photos are a match.'
    ),
  reason: z
    .string()
    .describe(
      'A brief explanation for the decision, especially if it is not a match.'
    ),
});
export type VerifyFaceMatchOutput = z.infer<typeof VerifyFaceMatchOutputSchema>;

const prompt = ai.definePrompt({
  name: 'verifyFaceMatchPrompt',
  input: {schema: VerifyFaceMatchInputSchema},
  output: {schema: VerifyFaceMatchOutputSchema},
  prompt: `You are a highly accurate facial recognition AI. Your task is to determine if two photographs are of the same person.

Analyze the two images provided.
- The first image is the reference photo from a digital ID card.
- The second image is a new photo taken for verification.

Compare the facial features in both images and decide if they belong to the same individual.
Provide a clear 'isMatch' boolean result and a brief reason for your decision.

Reference Photo: {{media url=savedPhotoDataUri}}
Verification Photo: {{media url=verificationPhotoDataUri}}`,
});

const verifyFaceMatchFlow = ai.defineFlow(
  {
    name: 'verifyFaceMatchFlow',
    inputSchema: VerifyFaceMatchInputSchema,
    outputSchema: VerifyFaceMatchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

export const verifyFaceMatch = verifyFaceMatchFlow;
