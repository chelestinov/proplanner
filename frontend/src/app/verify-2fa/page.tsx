'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { Toaster, toast } from 'react-hot-toast';
import { ShieldCheck, KeyRound, Loader2, ArrowLeft } from 'lucide-react';

export default function Verify2FA() {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const toastId = toast.loading('⏳ Проверка на кода...');

        // 1. Взимаме имейла, който запазихме от предишния екран
        const email = sessionStorage.getItem('login_email');

        if (!email) {
            toast.error('❌ Сесията е изтекла. Моля, влезте отново.', { id: toastId });
            router.push('/login');
            return;
        }

        try {
            // 2. Изпращаме ИМЕЙЛА и КОДА заедно, точно както Laravel ги очаква!
            const res = await axios.post('/api/2fa/verify', { email, code });
            
            // 3. Запазваме токена под правилното име (access_token), което Laravel ни връща
            localStorage.setItem('token', res.data.access_token);
            
            // Изчистваме временния имейл, вече не ни трябва
            sessionStorage.removeItem('login_email'); 

            toast.success('Успешен вход!', { id: toastId });
            router.push('/dashboard');
        } catch (error: any) {
            toast.error(error.response?.data?.message || '❌ Невалиден или изтекъл код', { id: toastId });
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-cyan-50/50 relative selection:bg-indigo-500 selection:text-white font-sans">
            <Toaster position="bottom-right" toastOptions={{ className: 'font-bold text-sm rounded-xl shadow-lg' }} />
            
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-indigo-300/30 rounded-full mix-blend-multiply filter blur-[80px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-cyan-300/40 rounded-full mix-blend-multiply filter blur-[80px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <nav className="relative z-10 w-full bg-white/60 backdrop-blur-lg border-b border-white/50 sticky top-0">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-tr from-indigo-600 to-cyan-500 p-2.5 rounded-xl shadow-md shadow-indigo-200">
                            <KeyRound className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-extrabold text-2xl tracking-tight text-slate-900">
                            PRO<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">PLANNER</span>
                        </span>
                    </div>
                    
                    <button onClick={() => router.push('/login')} className="flex items-center gap-2 bg-white/80 backdrop-blur-sm text-slate-500 font-extrabold px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 hover:text-indigo-600 hover:shadow-md transition-all duration-300">
                        <ArrowLeft className="w-4 h-4" /> Назад
                    </button>
                </div>
            </nav>

            <main className="relative z-10 flex-1 flex items-center justify-center p-6 w-full">
                <div className="w-full max-w-md bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-10 transform transition-all hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)]">
                    
                    <div className="text-center mb-10">
                        <div className="mx-auto bg-gradient-to-tr from-indigo-600 to-cyan-500 w-16 h-16 flex items-center justify-center rounded-2xl shadow-lg shadow-indigo-200 mb-6 transform hover:scale-105 transition-transform duration-500">
                            <ShieldCheck className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Потвърждение</h1>
                        <p className="text-xs font-black text-slate-400 tracking-widest uppercase mt-3">Въведи 6-цифрения код</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <div className="relative group">
                                <input 
                                    type="text" 
                                    required 
                                    maxLength={6}
                                    value={code}
                                    placeholder="••••••"
                                    onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                                    className="w-full bg-white/80 border border-slate-200/60 shadow-inner px-4 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-3xl tracking-[0.5em] text-center font-black text-slate-800 placeholder:text-slate-300" 
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading || code.length !== 6}
                            className="w-full bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white py-4 rounded-2xl font-black tracking-widest text-sm shadow-lg shadow-indigo-200 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'ПОТВЪРДИ ВХОДА'}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-slate-200/50 pt-6">
                        <p className="text-xs font-bold text-slate-500">
                            Кодът е изпратен на твоя имейл.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}