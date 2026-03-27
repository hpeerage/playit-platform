/* src/App.tsx - Main Router with Auth Guard */
import { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import ClientLauncher from './pages/ClientLauncher';
import LoginPage from './pages/LoginPage';
import { useAuth } from './hooks/useAuth';

// 인증 보호 라우트 컴포넌트
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Decrypting Session...</span>
        </div>
      </div>
    );
  }

  return user ? <>{children}</> : null;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* 관리자 대시보드는 현재 공개 (추후 세션 관리 추가 가능) */}
        <Route path="/" element={<AdminDashboard />} />
        
        {/* 로그인/회원가입 페이지 */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* 클라이언트 런처 (인증 필수) */}
        <Route 
          path="/client" 
          element={
            <ProtectedRoute>
              <ClientLauncher />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
