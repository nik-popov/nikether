'use server';

/**
 * @fileOverview Allows fans to interact with the animated visuals by adjusting parameters
 * like color schemes, patterns, and animation speeds using their input to influence the
 * generative AI algorithms, so they can customize the visual experience to their preferences.
 *
 * - interactWithVisuals - A function that handles the visual interaction process.
 * - InteractWithVisualsInput - The input type for the interactWithVisuals function.
 * - InteractWithVisualsOutput - The return type for the interactWithVisuals function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InteractWithVisualsInputSchema = z.object({
  musicGenre: z
    .string()
    .describe('The genre of the music currently playing.'),
  moodKeywords: z
    .string()
    .describe(
      'Keywords describing the desired mood or atmosphere of the visuals.'
    ),
  colorScheme: z
    .string()
    .describe(
      'The preferred color scheme for the visuals (e.g., vibrant, pastel, monochrome).'
    ),
  patternStyle: z
    .string()
    .describe(
      'The preferred pattern style for the visuals (e.g., geometric, abstract, organic).'
    ),
  animationSpeed: z
    .string()
    .describe(
      'The preferred animation speed for the visuals (e.g., fast, medium, slow).'
    ),
});
export type InteractWithVisualsInput = z.infer<typeof InteractWithVisualsInputSchema>;

const InteractWithVisualsOutputSchema = z.object({
  visualDescription: z
    .string()
    .describe(
      'A detailed description of the generated visuals, including color scheme, patterns, and animation style.'
    ),
});
export type InteractWithVisualsOutput = z.infer<typeof InteractWithVisualsOutputSchema>;

export async function interactWithVisuals(
  input: InteractWithVisualsInput
): Promise<InteractWithVisualsOutput> {
  return interactWithVisualsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interactWithVisualsPrompt',
  input: {schema: InteractWithVisualsInputSchema},
  output: {schema: InteractWithVisualsOutputSchema},
  prompt: `You are an AI visualizer that generates real time visuals.

  Based on the music genre: {{{musicGenre}}}, mood keywords: {{{moodKeywords}}}, color scheme: {{{colorScheme}}}, pattern style: {{{patternStyle}}}, and animation speed: {{{animationSpeed}}}, generate a description of the visuals.

  The visual description should include the color scheme, patterns, and animation style.
  Make sure the description is detailed and vivid.
  `,
});

const interactWithVisualsFlow = ai.defineFlow(
  {
    name: 'interactWithVisualsFlow',
    inputSchema: InteractWithVisualsInputSchema,
    outputSchema: InteractWithVisualsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
