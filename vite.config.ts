import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages 배포를 위한 base 설정
  // 저장소 이름이 'playit-platform'인 경우에 맞춰 설정되어 있습니다.
  base: '/playit-platform/',
})
