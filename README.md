<br/>

<p align="center">
  <a href='https://triviaup.adityabaindur.com/'> 
    <picture>
      <source srcset="./assets/logo-white.png" media="(prefers-color-scheme: dark)" />
      <source srcset="./assets/logo-dark.png" media="(prefers-color-scheme: light)" />
      <img src="./assets/logo-dark.png" alt="TriviaUP Logo" width="220" />
    </picture>
  </a>
</p>

<p align="center">
  Trivia that actually moves you up.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-000000?logo=react" />
  <img src="https://img.shields.io/badge/Backend-Next.js-000000?logo=nextdotjs" />
  <img src="https://img.shields.io/badge/UI-Tailwind%20%2B%20shadcn-000000?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel" />
</p>

---

## Overview

TriviaUP is a game platform designed to help users progressively build and test their trivia knowledge through a structured and interactive experience.

---

## Demo

https://github.com/user-attachments/assets/19cfe77d-e9d1-4cfb-bf0f-d0f4a3a40fcf

<p align="center">
  You can check out the deployed version here : <a href='https://triviaup.adityabaindur.com/'>triviaup.adityabaindur.com</a>
</p>

---

## Design Philosophy

Most trivia apps are random and disposable.

TriviaUP is built around progression, giving users structured difficulty, feedback, and scoring so improvement is measurable, not accidental.

---

## Achievements

### Core

- Boolean (true/false) question support with validation feedback
- Sequential question flow
- Multiple choice question support
- Difficulty selection (easy, medium, hard)
- Win condition system (completion feedback)

### Extended

- Scoring system with weighted difficulty
- Category based questions
- Animated transitions and interactions
- Performance metrics (difficulty and category tracking)

---

## Tech Stack

**Frontend**
- React (Vite), TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion (animations)

**Backend**
- Next.js API routes

**Deployment**
- Vercel (frontend + backend)

Documentation (includes API playground):

<p align="center" style="padding: 8px;"><a href="https://docs.adityabaindur.dev/docs/TriviaUP/API"><img src="https://docs.adityabaindur.dev/button/render?label=TriviaUP&target=%2Fdocs%2FTriviaUP%2FAPI&theme=dark" alt="TriviaUP API" /></a></p>

---

## Documentation

Full API and deployment documentation:

<p align="center" style="padding: 8px;"><a href="https://docs.adityabaindur.dev/docs/TriviaUP"><img src="https://docs.adityabaindur.dev/button/render?label=&target=%2Fdocs%2FTriviaUP&theme=dark&hideLabel=true" alt="TriviaUP" /></a></p>
---

## Local Development

### Clone the repo:

```bash
git clone https://github.com/Aditya-Baindur/TriviaUP.git
cd TriviaUP
```

### Setup the environment variables:

The default variable default to localhost:5173 (frontend) and localhost:3000 (backend). If you use other ports, you will need to change the values of those variables

```bash
cp frontend/env.example frontend/.env  
cp backend/env.example backend/.env  
```

### Install dependencies and run the project:

Always run in root of project for pnpm workspace

```bash
pnpm install
pnpm dev
```

Running `pnpm dev` will start both services and display their local URLs:

```bash
> pnpm dev

> @triviaup/root@1.0.0 dev /Users/adityabaindur/school/JuniorDev
> pnpm -r --parallel dev

Scope: 2 of 3 workspace projects
backend dev$ next dev
frontend dev$ vite
backend dev: ▲ Next.js 16.2.4 (Turbopack)
backend dev: - Local:         http://localhost:3000
backend dev: - Network:       http://10.20.5.35:3000
backend dev: - Environments: .env.local
backend dev: ✓ Ready in 502ms
frontend dev:   VITE v5.4.21  ready in 7051 ms
frontend dev:   ➜  Local:   http://localhost:5173/
frontend dev:   ➜  Network: use --host to expose

```

Finally, you can visit :

Frontend : [http://localhost:5173/](http://localhost:5173/)
Backend : [http://localhost:3000/](http://localhost:3000/)

### Deployment

Vercel guide:

<p align="center" style="padding: 8px;"><a href="https://docs.adityabaindur.dev/docs/TriviaUP/Hosting"><img src="https://docs.adityabaindur.dev/button/render?label=TriviaUP&target=%2Fdocs%2FTriviaUP%2FHosting&theme=dark" alt="TriviaUP Hosting" /></a></p>

---

## Structure

```
frontend/     # React (Vite) client
backend/      # API / services
assets/       # static assets
```

---

## Contributing

Pull requests are welcome. For major changes, open an issue first.

---

## License

MIT License © 2026 Aditya Baindur
