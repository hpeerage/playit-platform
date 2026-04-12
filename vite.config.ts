import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages 서브디렉토리 배포를 위한 base 설정 복구
  base: '/playit-platform/',
})
