import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                // 1. Make sure this file name matches what is in your folder!
                // If you named your file "whiteboard.html", keep this line:
                whiteboard: resolve(__dirname, 'whiteboard.html'),

                // 2. Make sure your background script path is correct
                background: resolve(__dirname, 'src/background.js')
            },
            output: {
                entryFileNames: '[name].js',
            }
        }
    }
})