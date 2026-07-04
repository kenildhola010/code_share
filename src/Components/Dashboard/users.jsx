import React from 'react';

const Users = ({ name }) => {
  const getInitials = (str) => {
    if (!str) return '??';
    const parts = str.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  const getGradient = (str) => {
    const colors = [
      'from-pink-500 to-rose-500',
      'from-purple-500 to-indigo-500',
      'from-blue-500 to-cyan-500',
      'from-emerald-500 to-teal-500',
      'from-amber-500 to-orange-500',
      'from-fuchsia-500 to-purple-600',
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const initials = getInitials(name);
  const gradientClass = getGradient(name);

  return (
    <div className="flex items-center gap-3 p-2.5 bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/40 rounded-xl transition-all duration-200 w-full">
      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white font-bold text-xs tracking-wider shadow-md`}>
        {initials}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-semibold text-slate-200 truncate">{name}</span>
        <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Online
        </span>
      </div>
    </div>
  );
};

export default Users;
