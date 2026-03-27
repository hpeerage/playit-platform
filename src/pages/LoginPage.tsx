/* src/pages/LoginPage.tsx */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Shield, Lock, Mail, LogIn, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/client');
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: { full_name: name }
          }
        });
        if (error) throw error;
        
        alert('회원가입 확인 메일이 발송되었습니다.');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
      
      <div className="relative w-full max-w-[480px] animate-in fade-in zoom-in-95 duration-700">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-[28px] flex items-center justify-center shadow-[0_0_50px_rgba(139,92,246,0.3)] mb-6 group transition-transform hover:scale-105 duration-500">
                <Shield className="w-10 h-10 text-white group-hover:rotate-12 transition-transform" />
            </div>
            <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none mb-2">
                Playit <span className="text-purple-500">Platform</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Ultimate PC Launcher Experience</p>
        </div>

        {/* Card Section */}
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[40px] p-10 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
            <div className="flex gap-1 mb-8">
                <button 
                    onClick={() => setIsLogin(true)}
                    className={cn(
                        "flex-1 py-4 text-[11px] font-black uppercase tracking-widest transition-all rounded-2xl",
                        isLogin ? "bg-white/5 text-white border border-white/10" : "text-slate-600 hover:text-slate-400"
                    )}
                >
                    Identity Login
                </button>
                <button 
                    onClick={() => setIsLogin(false)}
                    className={cn(
                        "flex-1 py-4 text-[11px] font-black uppercase tracking-widest transition-all rounded-2xl",
                        !isLogin ? "bg-white/5 text-white border border-white/10" : "text-slate-600 hover:text-slate-400"
                    )}
                >
                    New Node
                </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-5">
                {!isLogin && (
                    <div className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-purple-500 transition-colors">
                            <LogIn className="w-4 h-4" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="DISPLAY NAME" 
                            className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 transition-all"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                )}

                <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-purple-500 transition-colors">
                        <Mail className="w-4 h-4" />
                    </div>
                    <input 
                        type="email" 
                        placeholder="ACCESS EMAIL" 
                        className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-purple-500 transition-colors">
                        <Lock className="w-4 h-4" />
                    </div>
                    <input 
                        type="password" 
                        placeholder="ACCESS KEY" 
                        className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 transition-all"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black text-red-500 uppercase tracking-widest animate-shake">
                        {error}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 text-white font-black py-5 rounded-[24px] uppercase tracking-[0.3em] text-xs shadow-xl shadow-purple-900/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <>
                            {isLogin ? 'Establish Connection' : 'Register Node'}
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>
        </div>

        <div className="mt-10 text-center">
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.4em]">
                Secure Access Terminal v1.1.0-STABLE
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
