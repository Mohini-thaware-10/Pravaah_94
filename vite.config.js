import { defineConfig } from 'vite'
import { copyFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

// The dashboards use classic (non-module) scripts that must keep global load
// order, so Vite does not bundle them. Copy them into the build output so the
// built pages reference real files.
function copyClassicScripts() {
  return {
    name: 'pravaah-copy-classic-scripts',
    apply: 'build',
    closeBundle() {
      const root = process.cwd()
      const outDir = join(root, 'dist')
      readdirSync(root)
        .filter((file) => file.endsWith('.js') && file !== 'vite.config.js')
        .forEach((file) => copyFileSync(join(root, file), join(outDir, file)))
    }
  }
}

export default defineConfig({
  base: './',
  root: '.',
  publicDir: false,
  plugins: [copyClassicScripts()],
  server: {
    port: 5173,
    host: true,
    open: true
  },
  resolve: {
    alias: {
      '@': '.'
    }
  },
  build: {
    rollupOptions: {
      input: {
        index: 'index.html',
        signin: 'signin.html',
        signup: 'signup.html',
        app: 'app.html'
      }
    },
    outDir: 'dist'
  }
})
