import React from "react";

const Card = React.memo(({ title, desc, icon, gradient, delay = 0 }) => {
    return (
        <div className="relative group perspective-1000 h-full">
            {/* Main card container */}
            <div className="relative bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl p-8 shadow-xl group-hover:shadow-2xl transition-all duration-500 transform-gpu preserve-3d overflow-hidden h-full flex flex-col hover:scale-105 hover:-translate-y-2">

                {/* Animated gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient || 'from-emerald-500 to-teal-600'} opacity-0 group-hover:opacity-10 transition-all duration-500 rounded-2xl`}></div>

                {/* Top gradient line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient || 'from-emerald-500 to-teal-600'} rounded-t-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>

                {/* Icon container */}
                <div className="relative mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient || 'from-emerald-500 to-teal-600'} flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:shadow-xl transform group-hover:rotate-6 transition-all duration-300`}>
                        {icon}
                    </div>
                    {/* Icon glow effect */}
                    <div className={`absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient || 'from-emerald-500 to-teal-600'} opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500`}></div>
                </div>

                {/* Content */}
                <div className="relative z-10 space-y-4 flex-grow flex flex-col">
                    <h3 className="text-slate-900 text-xl font-bold leading-tight group-hover:text-slate-800 transition-colors duration-300">
                        {title}
                    </h3>

                    <p className="text-slate-600 text-sm leading-relaxed flex-grow">
                        {desc}
                    </p>
                </div>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Floating particles effect */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-300"></div>
                <div className="absolute top-8 right-8 w-1 h-1 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-500 delay-100"></div>
            </div>
        </div>
    );
});

export default Card;