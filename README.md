# Viziona

A web-based immersive simulator for manifesting your ideal lifestyle.

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

