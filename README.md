# Drug Wordie

A Wordle-style guessing game in the browser. Each guess fills a grid of letter tiles, and an on-screen keyboard marks letters as you play. Stats stay in the browser.

## Stack

Create React App, React Router, Ant Design, and Tailwind CSS.

## Pages

| Path | Screen |
| --- | --- |
| `/` | Home |
| `/play` | The game (`GuessGrid`, `Keyboard`, `LetterTile`) |
| `/stats` | Saved stats |
| `/help` | How to play |

Word lists and stat storage live in `src/utils/wordService.js` and `src/utils/statsService.js`.

## Run locally

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000). `npm run build` writes the production bundle to `build/`.
