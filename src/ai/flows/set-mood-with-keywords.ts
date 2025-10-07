'use server';
/**
 * @fileOverview An AI agent that sets the graphic design mood for music based on user-provided keywords.
 *
 * - setMoodWithKeywords - A function that accepts keywords and returns a graphic design mood.
 * - SetMoodWithKeywordsInput - The input type for the setMoodWithKeywords function.
 * - SetMoodWithKeywordsOutput - The return type for the setMoodWithKeywords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SetMoodWithKeywordsInputSchema = z.object({
  keywords: z
    .string()
    .describe('Keywords that describe the desired graphic design mood.'),
});
export type SetMoodWithKeywordsInput = z.infer<typeof SetMoodWithKeywordsInputSchema>;

const SetMoodWithKeywordsOutputSchema = z.object({
  mood: z.string().describe('The graphic design mood that matches the keywords.'),
});
export type SetMoodWithKeywordsOutput = z.infer<typeof SetMoodWithKeywordsOutputSchema>;

export async function setMoodWithKeywords(
  input: SetMoodWithKeywordsInput
): Promise<SetMoodWithKeywordsOutput> {
  return setMoodWithKeywordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'setMoodWithKeywordsPrompt',
  input: {schema: SetMoodWithKeywordsInputSchema},
  output: {schema: SetMoodWithKeywordsOutputSchema},
  prompt: `You are a graphic designer specializing in music visuals.

  Based on the user-provided keywords, pick a graphic design mood that suits the music and the keywords.

  Keywords: {{{keywords}}}`,
});

const setMoodWithKeywordsFlow = ai.defineFlow(
  {
    name: 'setMoodWithKeywordsFlow',
    inputSchema: SetMoodWithKeywordsInputSchema,
    outputSchema: SetMoodWithKeywordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
