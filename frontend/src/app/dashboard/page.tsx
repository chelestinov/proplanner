'use client';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { LogOut, Plus, Search, Filter, Edit, Trash2, Image as ImageIcon, UserCircle, ShieldCheck, Clock, BookOpen, Video, X, LayoutGrid, List, Camera, Star, Send } from 'lucide-react';

const translations = {
    bg: {
        adminPanel: 'Админ Панел',
        hello: 'Здравей,',
        userRole: 'Потребител',
        title: 'Задачи & Ресурси',
        subtitle: 'Организирай, филтрирай и управлявай екипните ресурси.',
        addTask: 'Добави задача',
        search: 'Търси по име...',
        allCategories: 'Всички категории',
        allRoles: 'Всички роли',
        noTasks: 'Няма намерени задачи.',
        tryFilters: 'Опитайте да промените филтрите.',
        createTaskTitle: 'Създай нова задача',
        editTaskTitle: 'Редактирай задача',
        nameLabel: 'Име *',
        namePlaceholder: 'Напр. Дизайн система',
        urlLabel: 'URL Линк *',
        descLabel: 'Кратко описание',
        descPlaceholder: 'С няколко думи за какво служи...',
        docsLabel: 'Документация',
        videoLabel: 'Видео урок',
        howToLabel: 'Как се използва?',
        examplesLabel: 'Реални примери',
        catLabel: 'Категория *',
        diffLabel: 'Ниво на трудност',
        diffBeginner: 'Начинаещи',
        diffIntermediate: 'Напреднали',
        diffAdvanced: 'Експерти',
        imgLabel: 'Изображение / Скрийншот',
        imgUpload: 'Качи',
        rolesLabel: 'Подходящо за роли',
        tagsLabel: 'Тагове',
        tagsPlaceholder: 'Напр. design, code (със запетая)',
        cancel: 'Отказ',
        save: 'Запази задачата',
        selectCat: 'Избери Категория',
        selectDiff: 'Избери ниво...',
        pending: 'Чака',
        rateBtn: 'Оцени',
        reviewsTitle: 'Отзиви',
        anonymous: 'Анонимен',
        reviewPlaceholder: 'Мнение...',
        system: 'Система',
        gridTooltip: 'Решетка',
        listTooltip: 'Списък',
        logoutTooltip: 'Изход'
    },
    en: {
        adminPanel: 'Admin Panel',
        hello: 'Hello,',
        userRole: 'User',
        title: 'Tasks & Resources',
        subtitle: 'Organize, filter and manage team resources.',
        addTask: 'Add Task',
        search: 'Search by name...',
        allCategories: 'All Categories',
        allRoles: 'All Roles',
        noTasks: 'No tasks found.',
        tryFilters: 'Try changing the filters.',
        createTaskTitle: 'Create new task',
        editTaskTitle: 'Edit task',
        nameLabel: 'Name *',
        namePlaceholder: 'E.g. Design system',
        urlLabel: 'URL Link *',
        descLabel: 'Short description',
        descPlaceholder: 'Briefly explain what it does...',
        docsLabel: 'Documentation',
        videoLabel: 'Video Tutorial',
        howToLabel: 'How to use?',
        examplesLabel: 'Real examples',
        catLabel: 'Category *',
        diffLabel: 'Difficulty Level',
        diffBeginner: 'Beginner',
        diffIntermediate: 'Intermediate',
        diffAdvanced: 'Advanced',
        imgLabel: 'Image / Screenshot',
        imgUpload: 'Upload',
        rolesLabel: 'Suitable for roles',
        tagsLabel: 'Tags',
        tagsPlaceholder: 'E.g. design, code (comma separated)',
        cancel: 'Cancel',
        save: 'Save Task',
        selectCat: 'Select Category',
        selectDiff: 'Select Level...',
        pending: 'Pending',
        rateBtn: 'Rate',
        reviewsTitle: 'Reviews',
        anonymous: 'Anonymous',
        reviewPlaceholder: 'Your review...',
        system: 'System',
        gridTooltip: 'Grid view',
        listTooltip: 'List view',
        logoutTooltip: 'Logout'
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

const translateCategory = (catName: string, lang: 'bg' | 'en') => {
    if (!catName) return '';
    const map: any = {
        'чатботове и текст': { bg: 'Чатботове и Текст', en: 'Chatbots & Text' },
        'изображения и видео': { bg: 'Изображения и Видео', en: 'Images & Video' },
        'програмиране': { bg: 'Програмиране', en: 'Programming' }
    };
    return map[catName.toLowerCase()]?.[lang] || catName;
};

export default function Dashboard() {
    const [user, setUser] = useState<any>(null);
    const [lang, setLang] = useState<'bg' | 'en'>('bg');
    const [mounted, setMounted] = useState(false);
    const t = translations[lang];

    const [tools, setTools] = useState([]);
    const [categories, setCategories] = useState([]);
    const [roles, setRoles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    
    const [activeReviewTool, setActiveReviewTool] = useState<number | null>(null);
    const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
    
    const [weather, setWeather] = useState<{temp: number, code: number} | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    
    const [newTool, setNewTool] = useState({ 
        name: '', description: '', url: '', category_id: '', 
        documentation_url: '', video_url: '', difficulty_level: '',
        how_to_use: '', real_examples: '', image_path: '',
        image_file: null as File | null,
        roles: [] as number[], tags: '' 
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [filterTag, setFilterTag] = useState('');
    
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        const savedLang = localStorage.getItem('app_lang');
        if (savedLang) setLang(savedLang as 'bg' | 'en');

        const loadData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }
            const config = { headers: { Authorization: `Bearer ${token}` } };
            try {
                const uRes = await axios.get('/api/user', config);
                setUser(uRes.data);
            } catch (err: any) {
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    router.push('/login');
                }
                return; 
            }
            try {
                const cRes = await axios.get('/api/categories', config);
                setCategories(cRes.data.data ? cRes.data.data : cRes.data);
            } catch (e) {}
            try {
                const rRes = await axios.get('/api/roles', config);
                setRoles(rRes.data.data ? rRes.data.data : rRes.data);
            } catch (e) {}
            try {
                const tRes = await axios.get('/api/ai-tools', config);
                setTools(tRes.data.data ? tRes.data.data : tRes.data);
            } catch (e) {}
        };
        loadData();

        fetch('https://api.open-meteo.com/v1/forecast?latitude=43.61&longitude=25.35&current_weather=true')
            .then(res => res.json())
            .then(data => {
                if (data && data.current_weather) {
                    setWeather({
                        temp: Math.round(data.current_weather.temperature),
                        code: data.current_weather.weathercode
                    });
                }
            })
            .catch(() => {});
    }, [router]);

    useEffect(() => {
        setCurrentTime(new Date()); 
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer); 
    }, []);

    const changeLang = (newLang: 'bg' | 'en') => {
        setLang(newLang);
        localStorage.setItem('app_lang', newLang);
    };

    const getWeatherIcon = (code: number) => {
        if (code === 0) return '☀️'; 
        if (code >= 1 && code <= 3) return '⛅'; 
        if (code >= 45 && code <= 48) return '🌫️'; 
        if (code >= 51 && code <= 67) return '🌧️'; 
        if (code >= 71 && code <= 77) return '❄️'; 
        if (code >= 95) return '⛈️'; 
        return '☁️';
    };

    const submitReview = async (toolId: number) => {
        const toastId = toast.loading(lang === 'bg' ? 'Запазване...' : 'Saving...');
        try {
            const token = localStorage.getItem('token');
            await axios.post(`/api/ai-tools/${toolId}/reviews`, reviewData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(lang === 'bg' ? 'Оценката е приета!' : 'Review accepted!', { id: toastId });
            setActiveReviewTool(null);
            setReviewData({ rating: 5, comment: '' });
            const res = await axios.get('/api/ai-tools');
            setTools(res.data);
        } catch (err) {
            toast.error(lang === 'bg' ? "Грешка при запис" : "Error saving", { id: toastId });
        }
    };

    const calculateAverageRating = (reviews: any[]) => {
        if (!reviews || reviews.length === 0) return "0.0";
        const sum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
        return (sum / reviews.length).toFixed(1);
    };

    const handleLogout = async () => {
        try { await axios.post('/logout'); } catch (err) {} 
        finally {
            localStorage.removeItem('token');
            sessionStorage.clear();
            router.push('/login');
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        const toastId = toast.loading(lang === 'bg' ? 'Качване на снимка...' : 'Uploading image...');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/user/avatar', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}` 
                }
            });
            setUser({ ...user, avatar: res.data.avatar_url });
            toast.success(lang === 'bg' ? 'Аватарът е обновен!' : 'Avatar updated!', { id: toastId });
        } catch (error) {
            toast.error(lang === 'bg' ? 'Грешка при качване.' : 'Upload error.', { id: toastId });
        }
    };

    const openCreateModal = () => {
        setEditingId(null);
        setNewTool({ 
            name: '', description: '', url: '', category_id: '', 
            documentation_url: '', video_url: '', difficulty_level: '',
            how_to_use: '', real_examples: '', image_path: '', image_file: null,
            roles: [], tags: '' 
        });
        setIsModalOpen(true);
    };

    const openEditModal = (tool: any) => {
        setEditingId(tool.id);
        setNewTool({ 
            name: tool.name, description: tool.description || '', url: tool.url, 
            category_id: tool.category_id || '', documentation_url: tool.documentation_url || '',
            video_url: tool.video_url || '', difficulty_level: tool.difficulty_level || '',
            how_to_use: tool.how_to_use || '', real_examples: tool.real_examples || '',
            image_path: tool.image_path || '', image_file: null,
            roles: tool.roles ? tool.roles.map((r: any) => r.id) : [],
            tags: tool.tags ? tool.tags.map((t: any) => t.name).join(', ') : ''
        });
        setIsModalOpen(true);
    };

    const handleRoleToggle = (roleId: number) => {
        setNewTool(prev => ({
            ...prev,
            roles: prev.roles.includes(roleId) ? prev.roles.filter(id => id !== roleId) : [...prev.roles, roleId]
        }));
    };

    const handleSave = async (e: any) => {
        e.preventDefault();
        const toastId = toast.loading(lang === 'bg' ? 'Запазване...' : 'Saving...');
        try {
            const formData = new FormData();
            formData.append('name', newTool.name);
            formData.append('url', newTool.url);
            if (newTool.description) formData.append('description', newTool.description);
            if (newTool.category_id) formData.append('category_id', newTool.category_id);
            if (newTool.difficulty_level) formData.append('difficulty_level', newTool.difficulty_level);
            if (newTool.documentation_url) formData.append('documentation_url', newTool.documentation_url);
            if (newTool.video_url) formData.append('video_url', newTool.video_url);
            if (newTool.how_to_use) formData.append('how_to_use', newTool.how_to_use);
            if (newTool.real_examples) formData.append('real_examples', newTool.real_examples);
            
            if (newTool.image_file) formData.append('image_file', newTool.image_file);
            else if (newTool.image_path) formData.append('image_path', newTool.image_path);

            newTool.roles.forEach((roleId) => formData.append('roles[]', roleId.toString()));
            const tagsArray = newTool.tags.split(',').map(t => t.trim()).filter(t => t !== '');
            tagsArray.forEach((tag) => formData.append('tags[]', tag));

            const token = localStorage.getItem('token');
            const config = { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` } };
            const isOwner = user?.roles?.some((r:any) => r.name?.toLowerCase() === 'owner');
            if (editingId) {
                formData.append('_method', 'PUT');
                await axios.post(`/api/ai-tools/${editingId}`, formData, config);
                toast.success(lang === 'bg' ? 'Задачката е обновена успешно!' : 'Task updated successfully!', { id: toastId });
            } else {
                await axios.post('/api/ai-tools', formData, config);
                if (isOwner) toast.success(lang === 'bg' ? 'Задачката е добавена публично!' : 'Task added publicly!', { id: toastId });
                else toast.success(lang === 'bg' ? 'Добавена! Чака одобрение.' : 'Added! Pending approval.', { id: toastId, icon: '⏳' });
            }
            
            const res = await axios.get('/api/ai-tools');
            setTools(res.data);
            setIsModalOpen(false);
        } catch (err) { toast.error(lang === 'bg' ? "Грешка при записа!" : "Error saving!", { id: toastId }); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm(lang === 'bg' ? "Сигурни ли сте, че искате да изтриете тази задача завинаги?" : "Are you sure you want to delete this task permanently?")) return;
        const toastId = toast.loading(lang === 'bg' ? 'Изтриване...' : 'Deleting...');
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/ai-tools/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setTools(tools.filter((t: any) => t.id !== id));
            toast.success(lang === 'bg' ? 'Изтрито успешно!' : 'Deleted successfully!', { id: toastId });
        } catch (err) { toast.error(lang === 'bg' ? "Грешка при изтриването!" : "Error deleting!", { id: toastId }); }
    };

    const isOwner = user?.roles?.some((r: any) => r.name?.toLowerCase() === 'owner');

    const filteredTools = tools.filter((t: any) => {
        const isApproved = t.status === 'approved';
        const isMine = t.user_id === user?.id;
        if (!isApproved && !isMine && !isOwner) return false;

        const matchName = t.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = filterCategory ? t.category_id == filterCategory : true;
        const matchRole = filterRole ? t.roles?.some((r: any) => r.id == filterRole) : true;
        const matchTag = filterTag ? t.tags?.some((tag: any) => tag.name.toLowerCase().includes(filterTag.toLowerCase())) : true;
        return matchName && matchCategory && matchRole && matchTag;
    });

    const getImageUrl = (path: string) => {
        if (!path) return '';
        if (path.startsWith('http')) return path; 
        return `http://localhost${path}`; 
    };

    if (!user) return <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white font-bold text-xl animate-pulse">Loading...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50/40 text-slate-800 font-sans pb-12">
            <Toaster position="bottom-right" toastOptions={{ className: 'font-bold text-sm rounded-xl shadow-lg' }} />
            
            <style dangerouslySetInnerHTML={{__html: `
                body::-webkit-scrollbar, .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
                body::-webkit-scrollbar-track, .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                body::-webkit-scrollbar-thumb, .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.4); border-radius: 10px; }
                body::-webkit-scrollbar-thumb:hover, .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(148, 163, 184, 0.7); }
            `}} />

            <nav className="bg-white/70 backdrop-blur-xl shadow-sm border-b border-white/60 sticky top-0 z-40">
                <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-tr from-indigo-600 to-cyan-500 w-10 h-10 rounded-xl shadow-md shadow-indigo-200 flex items-center justify-center">
                                    <span className="text-white font-black text-xl">P</span>
                                </div>
                                <span className="font-extrabold text-2xl tracking-tight text-slate-900 hidden sm:block">
                                    PRO<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">PLANNER</span>
                                </span>
                            </div>
                            
                            {mounted && currentTime && (
                                <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-100/50 px-4 py-2 rounded-full border border-slate-200/50 shadow-sm">
                                    {weather && (
                                        <div className="flex items-center gap-1 text-slate-600 bg-white px-2 py-0.5 rounded-md shadow-sm border border-slate-200/60 mr-1" title="Температура навън">
                                            <span className="text-sm">{getWeatherIcon(weather.code)}</span>
                                            <span>{weather.temp}°C</span>
                                        </div>
                                    )}
                                    <Clock className="w-3.5 h-3.5 text-cyan-500" />
                                    <span className="capitalize">{currentTime.toLocaleDateString(lang === 'bg' ? 'bg-BG' : 'en-US', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                                    <span className="text-slate-300 mx-0.5">•</span>
                                    <span className="tracking-widest">{currentTime.toLocaleTimeString(lang === 'bg' ? 'bg-BG' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-4 md:gap-6">
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

                            {isOwner && (
                                <button onClick={() => router.push('/admin')} className="flex items-center gap-2 text-emerald-700 bg-emerald-50/80 backdrop-blur px-4 py-2 rounded-xl font-bold transition-all text-sm border border-emerald-200/50 shadow-sm hover:shadow-md hover:bg-emerald-100/80">
                                    <ShieldCheck className="w-4 h-4" /> <span className="hidden lg:inline">{t.adminPanel}</span>
                                </button>
                            )}
                            
                            <div className="flex items-center gap-4 border-l border-slate-200/60 pl-4 md:pl-6">
                                <div className="hidden md:flex flex-col items-end justify-center">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{t.hello}</span>
                                    <span className="text-sm font-extrabold text-slate-800 leading-tight">{user.name}</span>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <span className="text-[9px] font-bold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded-md shadow-sm">ID:{user.id}</span>
                                        <span className="text-[9px] font-black text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
                                            {translateRole(user.roles?.[0]?.name, lang) || t.userRole}
                                        </span>
                                    </div>
                                </div>
                                
                                <label htmlFor="avatar-upload" className="relative group cursor-pointer block w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[2px] shadow-sm hover:shadow-md transition-shadow">
                                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden relative">
                                        {user.avatar ? (
                                            <img src={getImageUrl(user.avatar)} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <UserCircle className="w-full h-full text-slate-300" strokeWidth={1} />
                                        )}
                                        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                                            <Camera className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                    <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                                </label>

                                <button onClick={handleLogout} title={t.logoutTooltip} className="text-slate-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50">
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t.title}</h1>
                        <p className="text-sm font-medium text-slate-500 mt-1">{t.subtitle}</p>
                    </div>
                    <button onClick={openCreateModal} className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white px-6 py-3 rounded-2xl font-extrabold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:-translate-y-0.5 transition-all w-full sm:w-auto justify-center">
                        <Plus className="w-5 h-5" /> {t.addTask}
                    </button>
                </div>

                <div className="bg-white/60 backdrop-blur-xl p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 mb-8 flex flex-wrap gap-3 items-center justify-between">
                    <div className="flex flex-wrap gap-3 items-center flex-1">
                        <div className="flex items-center gap-2 text-slate-400 font-bold px-2">
                            <Filter className="w-4 h-4 text-cyan-500" />
                        </div>
                        <div className="relative w-full sm:flex-1 sm:min-w-[200px]">
                            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                            <input type="text" placeholder={t.search} className="w-full bg-white/80 border border-slate-200/60 shadow-inner pl-10 pr-4 py-2.5 rounded-xl outline-none text-sm focus:ring-2 focus:ring-cyan-500/30 transition-all font-bold text-slate-700" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                        <select className="flex-1 sm:flex-none sm:w-48 bg-white/80 border border-slate-200/60 shadow-inner px-4 py-2.5 rounded-xl outline-none text-sm cursor-pointer focus:ring-2 focus:ring-cyan-500/30 transition-all font-bold text-slate-700 appearance-none" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                            <option value="">{t.allCategories}</option>
                            {categories.map((c: any) => <option key={c.id} value={c.id}>{translateCategory(c.name, lang)}</option>)}
                        </select>
                        <select className="flex-1 sm:flex-none sm:w-40 bg-white/80 border border-slate-200/60 shadow-inner px-4 py-2.5 rounded-xl outline-none text-sm cursor-pointer focus:ring-2 focus:ring-cyan-500/30 transition-all font-bold text-slate-700 appearance-none" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
                            <option value="">{t.allRoles}</option>
                            {roles.map((r: any) => <option key={r.id} value={r.id} className="capitalize">{translateRole(r.name, lang)}</option>)}
                        </select>
                    </div>

                    <div className="flex items-center bg-slate-100/50 p-1 rounded-xl border border-slate-200/50 ml-auto shrink-0">
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-600'}`} title={t.gridTooltip}>
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-600'}`} title={t.listTooltip}>
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className={viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" 
                    : "flex flex-col gap-3"}> 
                    
                    {filteredTools.map((t: any) => (
                        <div key={t.id} className={`group bg-white/60 backdrop-blur-xl rounded-2xl border ${t.status === 'pending' ? 'border-amber-300/50' : 'border-white/80'} shadow-sm hover:shadow-[0_20px_40px_rgba(79,70,229,0.12)] transition-all duration-300 ease-out hover:-translate-y-1 hover:z-10 overflow-hidden flex ${viewMode === 'grid' ? 'flex-col' : 'flex-row items-stretch'}`}>
                            
                            <div className={`bg-white relative overflow-hidden flex items-center justify-center shrink-0 ${viewMode === 'grid' ? 'w-full h-44 border-b border-slate-100 p-4' : 'w-48 h-full border-r border-slate-100 p-3'}`}>
                                {t.image_path ? (
                                    <img src={getImageUrl(t.image_path)} alt={t.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm" onError={(e: any) => e.target.style.display = 'none'} />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-cyan-50/50 flex items-center justify-center">
                                        <ImageIcon className="w-10 h-10 text-indigo-200" />
                                    </div>
                                )}
                                <div className="absolute top-2 left-2 flex gap-1.5 flex-col items-start z-10">
                                    <span className="bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider text-indigo-800 shadow-sm border border-white/50">{translateCategory(t.category?.name, lang) || 'Общи'}</span>
                                    <div className="bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                                        <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                                        <span className="text-[9px] font-black text-amber-700">{calculateAverageRating(t.reviews)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className={`flex flex-col flex-grow ${viewMode === 'grid' ? 'p-5' : 'p-4'}`}>
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-lg font-black text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">{t.name}</h3>
                                    {t.status === 'pending' && <span className="bg-amber-100/90 text-[9px] font-black uppercase text-amber-800 px-2 py-0.5 rounded-md shrink-0 ml-2">⏳ {t.pending}</span>}
                                </div>
                                
                                <p className={`text-xs text-slate-500 mb-3 transition-all duration-300 ${viewMode === 'grid' ? 'line-clamp-2 group-hover:line-clamp-none' : 'line-clamp-1 group-hover:line-clamp-2'}`}>
                                    {t.description || (lang === 'bg' ? 'Няма въведено описание.' : 'No description provided.')}
                                </p>

                                <div className="mb-4 pt-3 border-t border-slate-50">
                                    {activeReviewTool === t.id ? (
                                        <div className="space-y-2 p-2 bg-slate-50 rounded-xl">
                                            <div className="flex justify-center gap-1">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <button key={s} onClick={() => setReviewData({...reviewData, rating: s})}>
                                                        <Star className={`w-5 h-5 ${reviewData.rating >= s ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="flex gap-1">
                                                <input className="text-[10px] flex-1 border border-slate-200 p-1.5 rounded-lg outline-none" placeholder={t.reviewPlaceholder} value={reviewData.comment} onChange={e => setReviewData({...reviewData, comment: e.target.value})} />
                                                <button onClick={() => submitReview(t.id)} className="bg-indigo-600 text-white p-1.5 rounded-lg"><Send className="w-3 h-3" /></button>
                                            </div>
                                            <button onClick={() => setActiveReviewTool(null)} className="w-full text-[9px] font-bold text-slate-400 uppercase">{t.cancel}</button>
                                        </div>
                                    ) : (
                                        <button onClick={() => setActiveReviewTool(t.id)} className="w-full py-1.5 border border-dashed border-slate-200 rounded-xl text-[9px] font-black text-slate-400 hover:border-indigo-300 hover:text-indigo-600 transition-all uppercase tracking-widest">
                                            {t.rateBtn}
                                        </button>
                                    )}
                                </div>

                                {t.reviews && t.reviews.length > 0 && (
                                    <div className="mb-4 space-y-2 max-h-32 overflow-y-auto custom-scrollbar pr-1 border-t border-slate-50 pt-3">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t.reviewsTitle}</h4>
                                        {t.reviews.map((review: any) => (
                                            <div key={review.id} className="bg-white/50 p-2.5 rounded-xl border border-slate-100 shadow-sm">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-bold text-indigo-600 text-[10px] uppercase tracking-wider">
                                                        {review.user?.name || t.anonymous}
                                                    </span>
                                                    <span className="text-amber-400 text-[10px] flex">
                                                        {'★'.repeat(review.rating)}
                                                        <span className="text-slate-200">
                                                            {'★'.repeat(5 - review.rating)}
                                                        </span>
                                                    </span>
                                                </div>
                                                {review.comment && (
                                                    <p className="text-slate-600 text-[11px] italic leading-tight">
                                                        "{review.comment}"
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                <div className="mt-auto flex items-center justify-between border-t border-slate-100/80 pt-3">
                                    <div className="flex items-center gap-2">
                                        {t.user?.avatar ? (
                                            <img src={getImageUrl(t.user.avatar)} className="w-6 h-6 rounded-full object-cover" />
                                        ) : (
                                            <UserCircle className="w-6 h-6 text-slate-400" />
                                        )}
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-800 leading-none">{t.user?.name || t.system}</span>
                                            <span className="text-[9px] font-bold text-slate-400 mt-0.5">{formatDate(t.created_at, lang)}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-1">
                                        <button onClick={() => openEditModal(t)} className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg bg-white/50 hover:bg-indigo-50 transition-all"><Edit className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(t.id)} className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg bg-white/50 hover:bg-red-50 transition-all"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredTools.length === 0 && (
                    <div className="text-center py-24 bg-white/40 backdrop-blur-xl rounded-3xl border border-white/60 shadow-sm mt-6">
                        <Search className="w-12 h-12 text-indigo-300/50 mx-auto mb-4" />
                        <p className="text-slate-700 font-bold text-xl">{t.noTasks}</p>
                        <p className="text-slate-500 text-sm mt-2">{t.tryFilters}</p>
                    </div>
                )}
            </main>

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 z-50">
                    <div className="bg-white/90 backdrop-blur-2xl rounded-[2rem] shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-white/60 overflow-hidden relative transform scale-100 transition-transform">
                        
                        <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-5 flex justify-between items-center z-20 shrink-0 shadow-sm">
                            <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-cyan-600">
                                {editingId ? t.editTaskTitle : t.createTaskTitle}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 p-2 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-white/40">
                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">{t.nameLabel}</label>
                                        <input required value={newTool.name} placeholder={t.namePlaceholder} className="w-full bg-white border border-slate-200/60 shadow-inner p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all text-sm font-bold text-slate-800" onChange={e => setNewTool({...newTool, name: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">{t.urlLabel}</label>
                                        <input required type="url" value={newTool.url} placeholder="https://..." className="w-full bg-white border border-slate-200/60 shadow-inner p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all text-sm font-bold text-slate-800" onChange={e => setNewTool({...newTool, url: e.target.value})} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">{t.descLabel}</label>
                                    <textarea value={newTool.description} placeholder={t.descPlaceholder} className="w-full bg-white border border-slate-200/60 shadow-inner p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all h-20 text-sm font-medium resize-none text-slate-700 custom-scrollbar" onChange={e => setNewTool({...newTool, description: e.target.value})} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1"><BookOpen className="w-3.5 h-3.5 text-indigo-400"/> {t.docsLabel}</label>
                                        <input type="url" value={newTool.documentation_url} className="w-full bg-white border border-slate-200/60 shadow-inner p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/40 text-sm" onChange={e => setNewTool({...newTool, documentation_url: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1"><Video className="w-3.5 h-3.5 text-cyan-400"/> {t.videoLabel}</label>
                                        <input type="url" value={newTool.video_url} className="w-full bg-white border border-slate-200/60 shadow-inner p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/40 text-sm" onChange={e => setNewTool({...newTool, video_url: e.target.value})} />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">{t.howToLabel}</label>
                                        <textarea value={newTool.how_to_use} className="w-full bg-white border border-slate-200/60 shadow-inner p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/40 h-24 text-sm resize-none custom-scrollbar" onChange={e => setNewTool({...newTool, how_to_use: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">{t.examplesLabel}</label>
                                        <textarea value={newTool.real_examples} className="w-full bg-white border border-slate-200/60 shadow-inner p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/40 h-24 text-sm resize-none custom-scrollbar" onChange={e => setNewTool({...newTool, real_examples: e.target.value})} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">{t.catLabel}</label>
                                        <select required value={newTool.category_id} className="w-full bg-white border border-slate-200/60 shadow-inner p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/40 text-sm cursor-pointer font-bold text-slate-700" onChange={e => setNewTool({...newTool, category_id: e.target.value})}>
                                            <option value="">{t.selectCat}</option>
                                            {categories.map((c: any) => <option key={c.id} value={c.id}>{translateCategory(c.name, lang)}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">{t.diffLabel}</label>
                                        <select value={newTool.difficulty_level} className="w-full bg-white border border-slate-200/60 shadow-inner p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/40 text-sm cursor-pointer font-bold text-slate-700" onChange={e => setNewTool({...newTool, difficulty_level: e.target.value})}>
                                            <option value="">{t.selectDiff}</option>
                                            <option value="Beginner">{t.diffBeginner}</option>
                                            <option value="Intermediate">{t.diffIntermediate}</option>
                                            <option value="Advanced">{t.diffAdvanced}</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="bg-indigo-50/50 border border-indigo-100/50 p-6 rounded-2xl shadow-inner">
                                    <span className="block mb-4 text-[10px] font-black text-indigo-800 uppercase tracking-widest">{t.imgLabel}</span>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-4 bg-white p-2.5 rounded-xl shadow-sm">
                                            <span className="text-xs text-slate-500 font-black uppercase w-16 text-center">{t.imgUpload}</span>
                                            <input type="file" accept="image/*" className="flex-1 text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 cursor-pointer transition-colors" onChange={e => setNewTool({...newTool, image_file: e.target.files?.[0] || null})} />
                                        </div>
                                        <div className="flex items-center gap-4 bg-white p-2.5 rounded-xl shadow-sm">
                                            <span className="text-xs text-slate-500 font-black uppercase w-16 text-center">URL</span>
                                            <input type="url" value={newTool.image_path} placeholder="https://..." className="flex-1 outline-none text-sm font-bold text-slate-700 bg-transparent" onChange={e => setNewTool({...newTool, image_path: e.target.value})} />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-cyan-50/50 border border-cyan-100/50 p-6 rounded-2xl shadow-inner">
                                    <span className="block mb-4 text-[10px] font-black text-cyan-800 uppercase tracking-widest">{t.rolesLabel}</span>
                                    <div className="flex flex-wrap gap-3">
                                        {roles.map((r: any) => (
                                            <label key={r.id} className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 hover:text-cyan-700 transition-colors capitalize bg-white px-3 py-2 rounded-xl shadow-sm border border-slate-100">
                                                <input type="checkbox" checked={newTool.roles.includes(r.id)} onChange={() => handleRoleToggle(r.id)} className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300" />
                                                {translateRole(r.name, lang)}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">{t.tagsLabel}</label>
                                    <input type="text" value={newTool.tags} placeholder={t.tagsPlaceholder} className="w-full bg-white border border-slate-200/60 shadow-inner p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all text-sm font-bold text-slate-700" onChange={e => setNewTool({...newTool, tags: e.target.value})} />
                                </div>

                                <div className="flex gap-4 pt-6 mt-6">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-sm">{t.cancel}</button>
                                    <button type="submit" className="flex-[2] bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-0.5">{t.save}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function formatDate(dateString: string, lang: 'bg' | 'en') {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(lang === 'bg' ? 'bg-BG' : 'en-US', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}