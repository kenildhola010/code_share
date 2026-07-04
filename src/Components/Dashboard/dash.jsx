import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./Dash.css";
import Selectlang from './selectlang';
import Code from './code';
import io from 'socket.io-client';
import { toast } from 'react-toastify';
import Users from './users.jsx';
import LogoutIcon from '@mui/icons-material/Logout';

function Dash() {
    const navigate = useNavigate();
    const [selectedLanguage, setSelectedLanguage] = useState('javascript');
    const [code, setCode] = useState('');
    const [socket, setSocket] = useState(null);
    const [usernames, setUsernames] = useState([]);
    const [copied, setCopied] = useState(false);

    const username = localStorage.getItem('name');
    const location = useLocation();
    const id = location.pathname.split('/')[2];

    useEffect(() => {
        if (!username) {
            toast.error("Please enter a username to join the room.");
            navigate('/');
        }
    }, [username, navigate]);

    const handleLanguageChange = (event) => {
        setSelectedLanguage(event.target.value);
    };

    const handleCodeChange = (newCode) => {
        setCode(newCode);
    };

    useEffect(() => {
        if (id && username && !socket) {
            const socketConn = io('http://localhost:3000/');
            socketConn.emit('Update_users', { id, username });
            setSocket(socketConn);
        }
    }, [id, username, socket]);

    useEffect(() => {
        if (!socket) return;

        socket.on('User list for frontend', (usernamesList) => {
            setUsernames(usernamesList);
        });

        socket.on('New user joined', (joinedUsername) => {
            toast.info(`${joinedUsername} joined the workspace`);
        });

        socket.on('User left the room', (leftUsername) => {
            toast.warn(`${leftUsername} left the workspace`);
        });

        return () => {
            socket.off('User list for frontend');
            socket.off('New user joined');
            socket.off('User left the room');
        };
    }, [socket]);

    const copyRoomId = () => {
        navigator.clipboard.writeText(id);
        setCopied(true);
        toast.success("Room ID copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const logoutt = () => {
        navigate('/');
        window.location.reload();
    };

    return (
        <div className="flex h-screen w-screen bg-[#090d16] text-slate-100 overflow-hidden font-sans relative">
            {/* Ambient background glows */}
            <div className="absolute top-[-30%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-[-30%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-500/5 blur-[150px] pointer-events-none"></div>

            {/* Left Main Workspace */}
            <main className="flex-1 flex flex-col h-full bg-[#070a12]/80 z-10 overflow-hidden">
                {/* Editor Header */}
                <header className="h-16 border-b border-slate-900 px-6 flex items-center justify-between bg-slate-950/40 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="CodeShare Logo" className="w-8 h-8 rounded-lg border border-slate-800 shadow" />
                        <span className="font-extrabold text-white tracking-tight">CodeShare</span>
                    </div>

                    {/* Room ID Badge & Copier */}
                    <div 
                        onClick={copyRoomId}
                        className="flex items-center gap-3 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl px-4 py-2 transition-all duration-200 cursor-pointer group shadow-lg"
                        title="Click to copy Room ID"
                    >
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-400 transition-colors">Workspace ID</span>
                        <span className="text-xs font-mono font-bold text-indigo-400">{id}</span>
                        <div className="text-slate-400 group-hover:text-white transition-colors">
                            {copied ? (
                                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                                </svg>
                            )}
                        </div>
                    </div>
                </header>

                {/* Editor Container */}
                <div className="flex-1 overflow-hidden relative">
                    <Code language={selectedLanguage} sockett={socket} onCodeChange={handleCodeChange} />
                </div>
            </main>

            {/* Right Sidebar */}
            <aside className="w-80 flex flex-col h-full bg-[#090d16] border-l border-slate-900/60 p-6 justify-between z-10 backdrop-blur-xl">
                {/* Top Section - Language Selector */}
                <div className="space-y-6">
                    <Selectlang sockett={socket} onChange={handleLanguageChange} />
                </div>

                {/* Middle Section - Online Users */}
                <div className="flex flex-col flex-1 min-h-0 my-8">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center justify-between">
                        <span>Collaborators</span>
                        <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                            {usernames?.length || 0}
                        </span>
                    </h3>
                    <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
                        {usernames?.map((name, key) => (
                            <Users name={name} key={key} />
                        ))}
                    </div>
                </div>

                {/* Bottom Section - Exit Button */}
                <div className="pt-4 border-t border-slate-900">
                    <button 
                        onClick={logoutt}
                        className="w-full flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500 active:bg-rose-600 border border-rose-500/20 hover:border-rose-500 text-rose-400 hover:text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-rose-950/10"
                    >
                        <LogoutIcon className="w-4 h-4" />
                        Leave Room
                    </button>
                </div>
            </aside>
        </div>
    );
}

export default Dash;
