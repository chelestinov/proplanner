'use client';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { ShieldCheck, ArrowLeft, CheckCircle, LayoutGrid, Users, Check, UserCircle, ImageIcon, XCircle } from 'lucide-react';

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState<'tools' | 'users'>('tools');
    const [pendingTools, setPendingTools] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadData = async () => {
            const token = localStorage.getItem('token');
            if (!token) { router.push('/login'); return; }

            try {
                const uRes = await axios.get('/api/user', { headers: { Authorization: `Bearer ${token}` } });
                if (!uRes.data.roles?.some((r: any) => r.name === 'owner')) {
                    toast.error('Нямате достъп!');
                    router.push('/dashboard');
                    return;
                }

                const [toolsRes, usersRes] = await Promise.all([
                    axios.get('/api/admin/tools/pending', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('/api/admin/users/pending', { headers: { Authorization: `Bearer ${token}` } })
                ]);

                setPendingTools(toolsRes.data);
                setPendingUsers(usersRes.data);
                setIsLoading(false);
            } catch (err) {
                toast.error('Грешка при зареждане на данните.');
            }
        };

        loadData();
    }, [router]);

    const handleApproveTool = async (id: number) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/admin/tools/${id}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } });
            setPendingTools(prev => prev.filter((t: any) => t.id !== id));
            toast.success('Задачата е одобрена!');
        } catch (e) { toast.error('Грешка при одобряване.'); }
    };

    const handleApproveUser = async (id: number) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/admin/users/${id}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } });
            setPendingUsers(prev => prev.filter((u: any) => u.id !== id));
            toast.success('Потребителят е активиран!');
        } catch (e) { toast.error('Грешка при активиране.'); }
    };

    // ТУК Е ФУНКЦИЯТА ЗА ИЗТРИВАНЕ
    const handleDeleteUser = async (id: number) => {
        if (!confirm('Сигурни ли сте, че искате да изтриете този потребител завинаги?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setPendingUsers(prev => prev.filter((u: any) => u.id !== id));
            toast.success('Потребителят е изтрит!');
        } catch (e) { toast.error('Грешка при изтриване.'); }
    };

    const getImageUrl = (p: string) => p ? (p.startsWith('http') ? p : `http://localhost${p}`) : '';

    if (isLoading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-black animate-pulse">Зареждане на Admin Hub...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30 font-sans pb-20">
            <Toaster position="bottom-right" toastOptions={{ className: 'font-bold text-sm' }} />
            
            <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-600 p-2.5 rounded-xl shadow-lg shadow-emerald-200">
                            <ShieldCheck className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-slate-800">ADMIN <span className="text-emerald-600">HUB</span></span>
                    </div>
                    <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Обратно към системата
                    </button>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 mt-12">
                <div className="flex gap-4 mb-10 bg-slate-100 p-1.5 rounded-2xl w-fit shadow-inner">
                    <button 
                        onClick={() => setActiveTab('tools')} 
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all ${activeTab === 'tools' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                        <LayoutGrid className="w-4 h-4" /> ЗАДАЧИ ({pendingTools.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('users')} 
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all ${activeTab === 'users' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                        <Users className="w-4 h-4" /> ПОТРЕБИТЕЛИ ({pendingUsers.length})
                    </button>
                </div>

                {activeTab === 'tools' && (
                    <div className="grid gap-6">
                        {pendingTools.length === 0 && (
                            <div className="text-center py-20 bg-white/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                                <CheckCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                <p className="text-slate-400 font-bold">Няма нови задачи за одобрение</p>
                            </div>
                        )}
                        {pendingTools.map((t: any) => (
                            <div key={t.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 flex flex-col md:flex-row gap-6 items-center shadow-sm">
                                <div className="w-full md:w-48 h-32 bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-100 p-2">
                                    {t.image_path ? <img src={getImageUrl(t.image_path)} className="max-h-full object-contain" /> : <ImageIcon className="text-slate-200 w-10 h-10" />}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-black text-slate-800 mb-1">{t.name}</h3>
                                    <p className="text-sm text-slate-500 line-clamp-2 mb-4">{t.description}</p>
                                    <div className="flex items-center gap-2">
                                        <UserCircle className="w-4 h-4 text-slate-400" />
                                        <span className="text-xs font-bold text-slate-600">{t.user?.name || 'Система'}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleApproveTool(t.id)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all">
                                        <Check className="w-4 h-4" /> Одобри
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="grid gap-4">
                        {pendingUsers.length === 0 && (
                            <div className="text-center py-20 bg-white/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                                <CheckCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                <p className="text-slate-400 font-bold">Няма чакащи регистрации</p>
                            </div>
                        )}
                        {pendingUsers.map((u: any) => (
                            <div key={u.id} className="bg-white p-5 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-black text-lg">
                                        {u.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-800 text-lg">{u.name}</h4>
                                        <p className="text-sm font-bold text-slate-500">{u.email} <span className="mx-2 text-slate-300">•</span> Роля: <span className="text-indigo-500 uppercase">{u.roles?.[0]?.name || 'Няма'}</span></p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {/* ТУК Е ЧЕРВЕНИЯТ БУТОН */}
                                    <button onClick={() => handleDeleteUser(u.id)} className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-3 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2">
                                        <XCircle className="w-4 h-4" /> Отхвърли
                                    </button>
                                    
                                    <button onClick={() => handleApproveUser(u.id)} className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2">
                                        <Check className="w-4 h-4" /> Активирай
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}