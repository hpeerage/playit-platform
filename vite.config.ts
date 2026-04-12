import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 커스텀 도메인(playit.kr) 루트 배포를 위한 base 설정
  base: '/',
})
