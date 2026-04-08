'use client';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { ShieldCheck, ArrowLeft, CheckCircle, LayoutGrid, Users, Check, UserCircle, ImageIcon, XCircle } from 'lucide-react';

const translations = {
    bg: {
        loading: 'Зареждане на Админ Панел...',
        noAccess: 'Нямате достъп!',
        loadError: 'Грешка при зареждане на данните.',
        taskApproved: 'Задачата е одобрена!',
        approveError: 'Грешка при одобряване.',
        userActivated: 'Потребителят е активиран!',
        activateError: 'Грешка при активиране.',
        confirmDelete: 'Сигурни ли сте, че искате да изтриете този потребител завинаги?',
        userDeleted: 'Потребителят е изтрит!',
        deleteError: 'Грешка при изтриване.',
        backToSystem: 'Обратно към системата',
        tabTasks: 'ЗАДАЧИ',
        tabUsers: 'ПОТРЕБИТЕЛИ',
        noTasks: 'Няма нови задачи за одобрение',
        system: 'Система',
        btnApprove: 'Одобри',
        noUsers: 'Няма чакащи регистрации',
        role: 'Роля:',
        noRole: 'Няма',
        btnReject: 'Отхвърли',
        btnActivate: 'Активирай',
        adminLogo1: 'АДМИН',       
        adminLogo2: 'ПАНЕЛ'        
    },
    en: {
        loading: 'Loading Admin Hub...',
        noAccess: 'Access denied!',
        loadError: 'Error loading data.',
        taskApproved: 'Task approved!',
        approveError: 'Error approving task.',
        userActivated: 'User activated!',
        activateError: 'Error activating user.',
        confirmDelete: 'Are you sure you want to delete this user permanently?',
        userDeleted: 'User deleted!',
        deleteError: 'Error deleting user.',
        backToSystem: 'Back to system',
        tabTasks: 'TASKS',
        tabUsers: 'USERS',
        noTasks: 'No new tasks for approval',
        system: 'System',
        btnApprove: 'Approve',
        noUsers: 'No pending registrations',
        role: 'Role:',
        noRole: 'None',
        btnReject: 'Reject',
        btnActivate: 'Activate',
        adminLogo1: 'ADMIN',       
        adminLogo2: 'HUB'          
    }
};

const translateRole = (roleName: string, lang: 'bg' | 'en') => {
    if (!roleName) return '';
    const map: any = {
        owner: { bg: 'Собственик', en: 'Owner' },
        frontend: { bg: 'Фронтенд', en: 'Frontend' },
        backend: { bg: 'Бекенд', en: 'Backend' },
        qa: { bg: 'QA Тестер', en: 'QA' },
        pm: { bg: 'Мениджър', en: 'PM' },
        designer: { bg: 'Дизайнер', en: 'Designer' },
        video_editor: { bg: 'Видео Редактор', en: 'Video Editor' },
        admin: { bg: 'Админ', en: 'Admin' },
        user: { bg: 'Потребител', en: 'User' }
    };
    return map[roleName.toLowerCase()]?.[lang] || roleName;
};

export default function AdminPanel() {
    const [lang, setLang] = useState<'bg' | 'en'>('bg');
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<'tools' | 'users'>('tools');
    const [pendingTools, setPendingTools] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        const savedLang = localStorage.getItem('app_lang');
        if (savedLang) setLang(savedLang as 'bg' | 'en');

        const loadData = async () => {
            const token = localStorage.getItem('token');
            if (!token) { router.push('/login'); return; }

            try {
                const uRes = await axios.get('/api/user', { headers: { Authorization: `Bearer ${token}` } });
                if (!uRes.data.roles?.some((r: any) => r.name?.toLowerCase() === 'owner')) {
                    toast.error(savedLang === 'en' ? 'Access denied!' : 'Нямате достъп!');
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
                toast.error(savedLang === 'en' ? 'Error loading data.' : 'Грешка при зареждане на данните.');
            }
        };

        loadData();
    }, [router]);

    const changeLang = (newLang: 'bg' | 'en') => {
        setLang(newLang);
        localStorage.setItem('app_lang', newLang);
    };

    const t = translations[lang];

    const handleApproveTool = async (id: number) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/admin/tools/${id}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } });
            setPendingTools(prev => prev.filter((t: any) => t.id !== id));
            toast.success(t.taskApproved);
        } catch (e) { toast.error(t.approveError); }
    };

    const handleApproveUser = async (id: number) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/admin/users/${id}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } });
            setPendingUsers(prev => prev.filter((u: any) => u.id !== id));
            toast.success(t.userActivated);
        } catch (e) { toast.error(t.activateError); }
    };

    const handleDeleteUser = async (id: number) => {
        if (!confirm(t.confirmDelete)) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setPendingUsers(prev => prev.filter((u: any) => u.id !== id));
            toast.success(t.userDeleted);
        } catch (e) { toast.error(t.deleteError); }
    };

    const getImageUrl = (p: string) => p ? (p.startsWith('http') ? p : `http://localhost${p}`) : '';

    if (isLoading || !mounted) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-black animate-pulse">{t.loading}</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30 font-sans pb-20">
            <Toaster position="bottom-right" toastOptions={{ className: 'font-bold text-sm' }} />
            
            <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-600 p-2.5 rounded-xl shadow-lg shadow-emerald-200">
                            <ShieldCheck className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-slate-800">{t.adminLogo1} <span className="text-emerald-600">{t.adminLogo2}</span></span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 shadow-inner">
                            <button 
                                onClick={() => changeLang('bg')} 
                                className={`px-3 py-1.5 text-xs font-black rounded-md transition-all ${lang === 'bg' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                БГ
                            </button>
                            <button 
                                onClick={() => changeLang('en')} 
                                className={`px-3 py-1.5 text-xs font-black rounded-md transition-all ${lang === 'en' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                EN
                            </button>
                        </div>

                        <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition-colors">
                            <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">{t.backToSystem}</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 mt-12">
                <div className="flex gap-4 mb-10 bg-slate-100 p-1.5 rounded-2xl w-fit shadow-inner">
                    <button 
                        onClick={() => setActiveTab('tools')} 
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all ${activeTab === 'tools' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                        <LayoutGrid className="w-4 h-4" /> {t.tabTasks} ({pendingTools.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('users')} 
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all ${activeTab === 'users' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                        <Users className="w-4 h-4" /> {t.tabUsers} ({pendingUsers.length})
                    </button>
                </div>

                {activeTab === 'tools' && (
                    <div className="grid gap-6">
                        {pendingTools.length === 0 && (
                            <div className="text-center py-20 bg-white/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                                <CheckCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                <p className="text-slate-400 font-bold">{t.noTasks}</p>
                            </div>
                        )}
                        {pendingTools.map((tool: any) => (
                            <div key={tool.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 flex flex-col md:flex-row gap-6 items-center shadow-sm">
                                <div className="w-full md:w-48 h-32 bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-100 p-2">
                                    {tool.image_path ? <img src={getImageUrl(tool.image_path)} className="max-h-full object-contain" /> : <ImageIcon className="text-slate-200 w-10 h-10" />}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-black text-slate-800 mb-1">{tool.name}</h3>
                                    <p className="text-sm text-slate-500 line-clamp-2 mb-4">{tool.description}</p>
                                    <div className="flex items-center gap-2">
                                        <UserCircle className="w-4 h-4 text-slate-400" />
                                        <span className="text-xs font-bold text-slate-600">{tool.user?.name || t.system}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleApproveTool(tool.id)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all">
                                        <Check className="w-4 h-4" /> {t.btnApprove}
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
                                <p className="text-slate-400 font-bold">{t.noUsers}</p>
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
                                        <p className="text-sm font-bold text-slate-500">{u.email} <span className="mx-2 text-slate-300">•</span> {t.role} <span className="text-indigo-500 uppercase">{translateRole(u.roles?.[0]?.name, lang) || t.noRole}</span></p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleDeleteUser(u.id)} className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-3 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2">
                                        <XCircle className="w-4 h-4" /> <span className="hidden sm:inline">{t.btnReject}</span>
                                    </button>
                                    
                                    <button onClick={() => handleApproveUser(u.id)} className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2">
                                        <Check className="w-4 h-4" /> <span className="hidden sm:inline">{t.btnActivate}</span>
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