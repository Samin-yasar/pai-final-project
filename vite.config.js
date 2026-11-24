import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// Vercel serves this Vite app from the domain root.
export default defineConfig({plugins: [react()]});
