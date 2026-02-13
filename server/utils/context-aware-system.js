import { pipeline } from "@xenova/transformers";

const context = `Some of the most influential books across genres include Atomic Habits, The Alchemist, Rich Dad Poor Dad, The Psychology of Money, Think and Grow Rich, The Power of Now, Deep Work, The 7 Habits of Highly Effective People, To Kill a Mockingbird, 1984, The Great Gatsby, Sapiens, The Subtle Art of Not Giving a F*ck, The Lean Startup, Zero to One, The Hobbit, Harry Potter and the Sorcerer's Stone, The Catcher in the Rye, The Book Thief, and The Da Vinci Code, each offering unique insights into personal growth, philosophy, finance, history, or imaginative storytelling that have shaped readers worldwide.`;``
const gen = await pipeline("text2text-generation", "Xenova/flan-t5-small");
const prompt = `From this text, return only book titles that start with "D" as a JSON array.
Text: ${context}`;

const out = await gen(prompt, { max_new_tokens: 80 });
console.log(out[0].generated_text);
