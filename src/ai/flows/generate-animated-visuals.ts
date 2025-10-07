'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating animated visuals based on music characteristics.
 *
 * The flow takes music genre and mood keywords as input and produces a data URI
 * for animated visual that corresponds to the music characteristics.
 *
 * @interface GenerateAnimatedVisualsInput - The input for the generateAnimatedVisuals flow.
 * @interface GenerateAnimatedVisualsOutput - The output of the generateAnimatedVisuals flow.
 * @function generateAnimatedVisuals - The function to call to generate animated visuals.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAnimatedVisualsInputSchema = z.object({
  genre: z.string().describe('The music genre.'),
  moodKeywords: z.string().describe('Keywords describing the mood of the music.'),
});
export type GenerateAnimatedVisualsInput = z.infer<typeof GenerateAnimatedVisualsInputSchema>;

const GenerateAnimatedVisualsOutputSchema = z.object({
  visualDataUri: z.string().describe('A data URI for the generated animated visual.'),
});
export type GenerateAnimatedVisualsOutput = z.infer<typeof GenerateAnimatedVisualsOutputSchema>;

export async function generateAnimatedVisuals(input: GenerateAnimatedVisualsInput): Promise<GenerateAnimatedVisualsOutput> {
  return generateAnimatedVisualsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAnimatedVisualsPrompt',
  input: {schema: GenerateAnimatedVisualsInputSchema},
  output: {schema: GenerateAnimatedVisualsOutputSchema},
  prompt: `You are a visual artist specializing in creating animated visuals that respond to music.

  Based on the music's genre and mood, generate a description for the animated visual.

  The visual should be abstract and dynamic, reflecting the energy and emotion of the music.
  Consider using colors, shapes, and patterns that are appropriate for the genre and mood.

  Genre: {{{genre}}}
  Mood Keywords: {{{moodKeywords}}}

  Output the description to be used to generate a visual using the image generation model.
  `,
});

const generateAnimatedVisualsFlow = ai.defineFlow(
  {
    name: 'generateAnimatedVisualsFlow',
    inputSchema: GenerateAnimatedVisualsInputSchema,
    outputSchema: GenerateAnimatedVisualsOutputSchema,
  },
  async input => {
    const {text} = await prompt(input);

    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: text,
    });

    return {visualDataUri: media.url!};
  }
);
