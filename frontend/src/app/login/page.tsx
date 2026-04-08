'use client';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { KeyRound, Mail, Lock, Loader2 } from 'lucide-react';
import Link from 'next/link';

const translations = {
    bg: {
        checking: '⏳ Проверка на данните...',
        successMsg: 'Успешно! Изпращане на код...',
        errorMsg: '❌ Грешен имейл или парола',
        loginBtnNav: 'Вход',
        welcome: 'Добре дошли',
        subtitle: 'Система за AI Инструменти',
        emailLabel: 'Имейл Адрес',
        passLabel: 'Парола',
        submitBtn: 'ВЛЕЗ В СИСТЕМАТА',
        noAccount: 'Нямаш акаунт?',
        registerHere: 'Регистрирай се тук',
        adminLabel: 'Админ:'
    },
    en: {
        checking: '⏳ Checking credentials...',
        successMsg: 'Success! Sending code...',
        errorMsg: '❌ Invalid email or password',
        loginBtnNav: 'Login',
        welcome: 'Welcome',
        subtitle: 'AI Tools System',
        emailLabel: 'Email Address',
        passLabel: 'Password',
        submitBtn: 'LOGIN TO SYSTEM',
        noAccount: 'Don\'t have an account?',
        registerHere: 'Register here',
        adminLabel: 'Admin:'
    }
};

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [lang, setLang] = useState<'bg' | 'en'>('bg');
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        const savedLang = localStorage.getItem('app_lang');
        if (savedLang) setLang(savedLang as 'bg' | 'en');
    }, []);

    const changeLang = (newLang: 'bg' | 'en') => {
        setLang(newLang);
        localStorage.setItem('app_lang', newLang);
    };

    const t = translations[lang];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const toastId = toast.loading(t.checking);

        try {
            await axios.get('/sanctum/csrf-cookie');
            await axios.post('/api/2fa/send', { email, password });
            
            toast.success(t.successMsg, { id: toastId });
            
            sessionStorage.setItem('login_email', email); 
            
            router.push('/verify-2fa');
        } catch (error: any) {
            toast.error(error.response?.data?.message || t.errorMsg, { id: toastId });
            setIsLoading(false);
        }
    };

    if (!mounted) return null; // Предотвратява трептене на езика при зареждане

    return (
        <div className="h-[100dvh] overflow-hidden flex flex-col bg-gradient-to-br from-slate-50 to-cyan-50/50 relative selection:bg-indigo-500 selection:text-white font-sans">
            <Toaster position="bottom-right" toastOptions={{ className: 'font-bold text-sm rounded-xl shadow-lg' }} />
            
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-indigo-300/30 rounded-full mix-blend-multiply filter blur-[80px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-cyan-300/40 rounded-full mix-blend-multiply filter blur-[80px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <nav className="relative z-10 w-full bg-white/60 backdrop-blur-lg border-b border-white/50 sticky top-0">
                <div className="max-w-7xl mx-auto px-6 h-16 sm:h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-tr from-indigo-600 to-cyan-500 p-2.5 rounded-xl shadow-md shadow-indigo-200">
                            <KeyRound className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-extrabold text-2xl tracking-tight text-slate-900">
                            PRO<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">PLANNER</span>
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 shadow-inner">
                            <button 
                                onClick={() => changeLang('bg')} 
                                className={`px-3 py-1.5 text-xs font-black rounded-md transition-all ${lang === 'bg' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                БГ
                            </button>
                            <button 
                                onClick={() => changeLang('en')} 
                                className={`px-3 py-1.5 text-xs font-black rounded-md transition-all ${lang === 'en' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                EN
                            </button>
                        </div>

                        <button className="hidden sm:block bg-white/80 backdrop-blur-sm text-indigo-700 font-extrabold px-7 py-2.5 rounded-xl border border-indigo-100 shadow-sm hover:bg-indigo-50 hover:shadow-md transition-all duration-300">
                            {t.loginBtnNav}
                        </button>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 flex-1 flex items-center justify-center p-4 w-full">
                <div className="w-full max-w-md bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8 transform transition-all hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)]">
                    
                    <div className="text-center mb-6">
                        <div className="mx-auto bg-gradient-to-tr from-indigo-600 to-cyan-500 w-14 h-14 flex items-center justify-center rounded-2xl shadow-lg shadow-indigo-200 mb-4 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                            <KeyRound className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t.welcome}</h1>
                        <p className="text-[11px] font-black text-slate-400 tracking-widest uppercase mt-2">{t.subtitle}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">{t.emailLabel}</label>
                            <div className="relative group">
                                <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-indigo-500 transition-colors" />
                                <input 
                                    type="email" 
                                    required 
                                    value={email}
                                    placeholder="ivan@admin.local"
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full bg-white/80 border border-slate-200/60 shadow-inner pl-12 pr-4 py-3 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold text-slate-800 placeholder:text-slate-400" 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">{t.passLabel}</label>
                            <div className="relative group">
                                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-indigo-500 transition-colors" />
                                <input 
                                    type="password" 
                                    required 
                                    value={password}
                                    placeholder="••••••••"
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full bg-white/80 border border-slate-200/60 shadow-inner pl-12 pr-4 py-3 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold text-slate-800 placeholder:text-slate-400" 
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white py-3.5 rounded-2xl font-black tracking-widest text-sm shadow-lg shadow-indigo-200 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t.submitBtn}
                        </button>
                    </form>
                    
                    <div className="mt-5 text-center">
                        <p className="text-slate-500 font-bold text-sm">
                            {t.noAccount} {' '}
                            <Link href="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors decoration-indigo-400/30 underline underline-offset-4">
                            {t.registerHere}
                            </Link>
                        </p>
                    </div>
                    <div className="mt-5 text-center border-t border-slate-200/50 pt-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {t.adminLabel} <span className="text-slate-600">ivan@admin.local</span> <span className="mx-1 opacity-50">|</span> Pass: <span className="text-slate-600">password</span>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}