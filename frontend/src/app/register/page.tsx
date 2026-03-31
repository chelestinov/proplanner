'use client';
import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { UserPlus, Mail, Lock, User, Briefcase, Loader2, KeyRound } from 'lucide-react';
import Link from 'next/link';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role_id: ''
    });
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        axios.get('/api/roles').then(res => {
            const filteredRoles = res.data.filter((r: any) => r.name !== 'owner');
            setRoles(filteredRoles);
        }).catch(() => toast.error("Грешка при зареждане на ролите"));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const toastId = toast.loading('⏳ Изпращане на заявка...');

        try {
            await axios.get('/sanctum/csrf-cookie');
            await axios.post('/api/register', formData);
            toast.success('Успешно! Изчакайте одобрение от админ.', { id: toastId, duration: 5000 });
            router.push('/login');
        } catch (err: any) {
            const msg = err.response?.data?.message || '❌ Грешка при регистрацията';
            toast.error(msg, { id: toastId });
            setIsLoading(false);
        }
    };

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
                    
                    <Link href="/login" className="bg-white/80 backdrop-blur-sm text-indigo-700 font-extrabold px-7 py-2.5 rounded-xl border border-indigo-100 shadow-sm hover:bg-indigo-50 hover:shadow-md transition-all duration-300">
                        Вход
                    </Link>
                </div>
            </nav>

            <main className="relative z-10 flex-1 flex items-center justify-center p-4 w-full">
                <div className="w-full max-w-md bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-6 sm:p-8 transform transition-all hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)]">
                    
                    <div className="text-center mb-5">
                        <div className="mx-auto bg-gradient-to-tr from-indigo-600 to-cyan-500 w-12 h-12 flex items-center justify-center rounded-2xl shadow-lg shadow-indigo-200 mb-3 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                            <UserPlus className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Нов акаунт</h1>
                        <p className="text-[11px] font-black text-slate-400 tracking-widest uppercase mt-1.5">Създай своя профил</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 ml-1">Имена</label>
                            <div className="relative group">
                                <User className="w-4 h-4 text-slate-400 absolute left-4 top-3 group-focus-within:text-indigo-500 transition-colors" />
                                <input 
                                    type="text" 
                                    required 
                                    value={formData.name}
                                    placeholder="Иван Иванов"
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-white/80 border border-slate-200/60 shadow-inner pl-11 pr-4 py-2.5 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold text-slate-800 placeholder:text-slate-400" 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 ml-1">Имейл Адрес</label>
                            <div className="relative group">
                                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3 group-focus-within:text-indigo-500 transition-colors" />
                                <input 
                                    type="email" 
                                    required 
                                    value={formData.email}
                                    placeholder="ivan@example.com"
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    className="w-full bg-white/80 border border-slate-200/60 shadow-inner pl-11 pr-4 py-2.5 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold text-slate-800 placeholder:text-slate-400" 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 ml-1">Парола</label>
                            <div className="relative group">
                                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3 group-focus-within:text-indigo-500 transition-colors" />
                                <input 
                                    type="password" 
                                    required 
                                    value={formData.password}
                                    placeholder="••••••••"
                                    onChange={e => setFormData({...formData, password: e.target.value})}
                                    className="w-full bg-white/80 border border-slate-200/60 shadow-inner pl-11 pr-4 py-2.5 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold text-slate-800 placeholder:text-slate-400" 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 ml-1">Роля</label>
                            <div className="relative group">
                                <Briefcase className="w-4 h-4 text-slate-400 absolute left-4 top-3 group-focus-within:text-indigo-500 transition-colors z-10" />
                                <select 
                                    required 
                                    value={formData.role_id}
                                    onChange={e => setFormData({...formData, role_id: e.target.value})}
                                    className="w-full bg-white/80 border border-slate-200/60 shadow-inner pl-11 pr-4 py-2.5 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold text-slate-800 appearance-none relative z-0"
                                >
                                    <option value="" className="text-slate-400">Избери роля...</option>
                                    {roles.map((r: any) => (
                                        <option key={r.id} value={r.id} className="text-slate-800 capitalize">{r.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white py-3.5 rounded-2xl font-black tracking-widest text-sm shadow-lg shadow-indigo-200 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'РЕГИСТРИРАЙ СЕ'}
                        </button>
                    </form>
                    
                    <div className="mt-4 text-center border-t border-slate-200/50 pt-4">
                        <p className="text-slate-500 font-bold text-sm">
                            Вече имаш акаунт? {' '}
                            <Link href="/login" className="text-indigo-600 hover:text-indigo-700 transition-colors decoration-indigo-200 underline underline-offset-4">
                                Влез тук
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}