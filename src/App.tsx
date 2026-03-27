/* src/App.tsx - Main Router with Auth Guard */
import { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import AdminDashboard from './pages/AdminDashboard';
import ClientLauncher from './pages/ClientLauncher';
import LoginPage from './pages/LoginPage';
import { useAuth } from './hooks/useAuth';

// 인증 보호 및 자동 로그인 가드 (테스트용)
const AutoLoginGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performAutoLogin = async () => {
      if (!loading && !user) {
        // 테스트 모드: 세션이 없으면 자동으로 로그인 시도
        console.log('Test Mode: Attempting auto-login...');
        try {
          const { error } = await supabase.auth.signInWithPassword({
            email: 'test@playit.com',
            password: 'password123'
          });
          if (error) {
            console.error('Auto-login failed:', error.message);
            navigate('/login', { replace: true });
          }
        } catch (err) {
          console.error('Auto-login error:', err);
          navigate('/login', { replace: true });
        }
      }
    };

    performAutoLogin();
  }, [user, loading, navigate]);

  if (loading || (!user)) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
            {!user ? 'Auto-Connecting Test Node...' : 'Decrypting Session...'}
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
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
            <AutoLoginGuard>
              <ClientLauncher />
            </AutoLoginGuard>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
