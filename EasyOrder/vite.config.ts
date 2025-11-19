import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // 简单的环境变量处理，允许在客户端访问 process.env.API_KEY
    // 使用 || '' 确保即使未定义也不会导致构建时出错
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  }
});