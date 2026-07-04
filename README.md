# Viziona

A web-based immersive simulator for experiencing your ideal wealthy lifestyle.

## Tech Stack

- Next.js (App Router, TypeScript)
- React, Zustand (state)
- React Three Fiber, Drei, Three.js (3D)
- Framer Motion, GSAP (animations)
- Firebase (auth, DB)

## Features

- Financial identity simulation
- Interactive lifestyle modules (shopping, travel, home, daily life)
- 3D immersive environment
- Emotional reinforcement (micro-interactions, affirmations)
- Fast, smooth, and scalable

## Creative Process

We built a photorealistic 3D Earth Globe simulation using React Three Fiber and custom WebGL shaders:

- **Custom Shaders**: Developed a GLSL shader to dynamically mix daytime satellite imagery with night city lights along the terminator line.
- **Polar Pinch Resolution**: Mitigated equirectangular mapping distortions at the poles by custom blending the polar caps to a soft slate-blue and fading out specular glares and clouds at high latitudes.
- **Lighting & Specular Reflections**: Softened and spread the sharp sunlight reflections on the ocean (reducing Phong exponent from `32` to `8`) to simulate a realistic, large light source.

### Color Theme
- **Space & Ocean**: Deep Space Blue (`#03050c` / `rgb(2, 8, 24)`)
- **Atmosphere & Highlights**: Electric atmospheric blue (`#3b82f6` halo) and soft slate-blue polar regions (`rgb(89, 110, 140)`)
- **Night Accents**: Warm yellow/amber city lights

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
