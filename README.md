# Slide Roulette

A local Next.js version of the Slide Roulette / PowerPoint Karaoke app.

## Run Locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Local Data

Decks are saved on your machine in:

```text
.data/decks.json
```

No external database is required.

## Optional AI Generation

The app works without an API key by using its built-in fallback deck generator.

For OpenAI-generated decks, copy `.env.example` to `.env.local` and set `OPENAI_API_KEY`.
