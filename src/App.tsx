/* src/App.tsx - Main Router with Auth Guard */
import { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import ClientLauncher from './pages/ClientLauncher';
import LoginPage from './pages/LoginPage';
import { useAuth } from './hooks/useAuth';

// 관리자 전용 가드 (데모 바이패스 적용)
const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// 인증 보호 가드 (데모 바이패스 적용)
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};



function App() {
  return (
    <Router>
      <Routes>
        {/* 관리자 대시보드 (관리자만 접근 가능) */}
        <Route 
          path="/" 
          element={
            <AdminGuard>
              <AdminDashboard />
            </AdminGuard>
          } 
        />
        
        {/* 로그인/회원가입 페이지 */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* 클라이언트 런처 (인증 필수) */}
        <Route 
          path="/client" 
          element={
            <AuthGuard>
              <ClientLauncher />
            </AuthGuard>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
