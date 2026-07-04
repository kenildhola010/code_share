import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './login.css';

function Login() {
    const [name, setName] = useState('');
    const [roomid, setRoomId] = useState('');
    const navigate = useNavigate();

    const senddata = {
        name: name,
        roomId: roomid
    };

    const isvalid = async (e) => {
        e.preventDefault();
        if (name.trim() === '' || roomid.trim() === '') {
            return;
        } else if (name.trim().length < 2) {
            return;
        } else {
            localStorage.setItem('name', name.trim());
            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
            try {
                await axios.post(`${BACKEND_URL}/data`, senddata);
                navigate(`room/${roomid.trim()}`);
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    const handleCreateRoom = (e) => {
        e.preventDefault();
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const rand = (len) => Array.from({length: len}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        const newRoomId = `${rand(4)}-${rand(4)}-${rand(4)}`;
        setRoomId(newRoomId);
    };

    return (
        <div className='min-h-screen w-screen bg-[#090d16] flex items-center justify-center p-4 relative overflow-hidden font-sans'>
            {/* Background glowing circles */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-md p-8 bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl shadow-indigo-950/20 relative z-10">
                <div className="text-center mb-8">
                    <img src="/logo.png" alt="CodeShare Logo" className="w-16 h-16 mx-auto mb-4 rounded-2xl shadow-lg border border-slate-800/80" />
                    <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                        CodeShare
                    </h1>
                    <p className="text-sm text-slate-400">
                        Real-time collaborative code workspace
                    </p>
                </div>

                <form className="space-y-6" onSubmit={isvalid}>
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                            Username
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                            required
                            value={name}
                            placeholder="Enter your username"
                            className="w-full bg-slate-950/50 text-white placeholder-slate-500 border border-slate-800 rounded-xl py-3 px-4 leading-tight focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                            Room ID
                        </label>
                        <div className="flex gap-2">
                            <input
                                name="roomid"
                                type="text"
                                placeholder="Enter Room ID"
                                required
                                id="roomid"
                                value={roomid}
                                onChange={(e) => setRoomId(e.target.value)}
                                className="flex-1 bg-slate-950/50 text-white placeholder-slate-500 border border-slate-800 rounded-xl py-3 px-4 leading-tight focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                            />
                            <button
                                type="button"
                                onClick={handleCreateRoom}
                                className="bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white px-4 rounded-xl border border-slate-700/50 transition-all duration-200 flex items-center justify-center font-medium text-sm whitespace-nowrap gap-1"
                                title="Generate random room ID"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                                New Room
                            </button>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            Join Workspace
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;


