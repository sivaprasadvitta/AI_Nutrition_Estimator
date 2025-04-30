import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config();

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

export default async function getOpenAiResponse(dish) {

    const client = new OpenAI({ baseURL: endpoint, apiKey: token });

    const response = await client.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: [
                    'You are a strict JSON generator. ',
                    'Your sole output must be valid JSON—nothing else.',
                    'You must produce an array of objects. ',
                    'Each object must have exactly three keys: ',
                    '"ingredient" (string), "quantity" (number), and "unit" (string).'
                ].join('')
            },
            {
                role: 'user',
                content: `List ingredients for "${dish}" and output *only* a JSON array of objects in this exact format:
    
    [
      {
        "ingredient": "Paneer",
        "quantity": 0.75,
        "unit": "cup"
      },
      {
        "ingredient": "Butter",
        "quantity": 2,
        "unit": "teaspoon"
      },
      …
    ]
    
    Do **not** include any markdown fences (\`\`\`), explanations, or extra keys—just the JSON array itself.`
            }
        ],
        temperature: 1,
        top_p: 1,
        model: model
    });

    // console.log(response.choices[0].message.content);
    return response.choices[0].message.content;
}

// getOpenAiResponse().catch((err) => {
//   console.error("The sample encountered an error:", err);
// });

