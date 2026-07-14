import React from 'react';
import { motion } from 'framer-motion';
import { Github, Code2, Globe, Heart, Shield, Sparkles, Terminal, User, Cpu, Briefcase, FolderKanban } from 'lucide-react';
import PrathamPic from '../assets/Pratham-pic.jpg';

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.4
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex-grow min-h-[calc(100vh-4rem)] bg-zinc-950 p-6 md:p-8 flex items-center justify-center relative overflow-hidden bg-fine-grid">
      {/* Background spotlights */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/[0.015] rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-indigo-500/[0.015] rounded-full blur-3xl pointer-events-none -z-10"></div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl w-full space-y-8 py-10"
      >
        {/* Gorgeous Header */}
        <motion.div variants={itemVariants} className="text-center space-y-3">
          <span className="bg-zinc-900 text-zinc-400 border border-zinc-800 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-flex items-center gap-1.5 select-none shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Developer Ecosystem</span>
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            About <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-zinc-300 bg-clip-text text-transparent">API Vault</span>
          </h1>
          <p className="text-zinc-500 text-xs md:text-sm max-w-lg mx-auto font-medium">
            Learn more about the vision behind the platform and the creator building high-fidelity tools for modern engineers.
          </p>
        </motion.div>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Box 1: The App Vision (7 columns) */}
          <motion.div 
            variants={itemVariants} 
            className="md:col-span-7 bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group bg-fine-grid"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.01] to-transparent pointer-events-none"></div>
            
            <div className="space-y-4">
              <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center shadow-sm">
                <Cpu className="w-4.5 h-4.5 text-blue-400" />
              </div>
              <h3 className="text-lg font-extrabold text-white">The Platform Vision</h3>
              <p className="text-zinc-400 text-[12px] leading-relaxed font-medium">
                API Vault was built on a simple yet powerful premise: to create a centralized, frictionless hub where developers can instantly discover free and open-source public APIs. No more wasting hours manually searching through fragmented directories or undocumented sites—API Vault aggregates production-ready resources all in one premium ecosystem.
              </p>
              <p className="text-zinc-400 text-[12px] leading-relaxed font-medium">
                A common hurdle for many developers—especially when starting a new project—is not knowing exactly which APIs are required or even exist to power their application's features. API Vault directly addresses this challenge by taking the guesswork out of system design.
              </p>
              <p className="text-zinc-400 text-[12px] leading-relaxed font-medium">
                Through our interactive AI Project Assistant, developers can simply input their raw project description. The system acts as a personalized architect, curating a custom stack of the precise, free, and open-source APIs needed to build their application.
              </p>
              <p className="text-zinc-400 text-[12px] leading-relaxed font-medium">
                Further expanding this workflow, our newly integrated **API Architect Studio** empowers developers to design custom endpoint schemas using REST, GraphQL, or gRPC. With bulk schema generation powered by Nemotron AI and interactive human-in-the-loop validation, developers can seamlessly design, review, and export ready-to-use specifications like OpenAPI JSON, GraphQL SDL, or Protobuf files instantly.
              </p>
            </div>

            <div className="flex gap-4 pt-6 border-t border-zinc-900/60 mt-6 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>Verified Endpoints</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FolderKanban className="w-3.5 h-3.5 text-blue-500" />
                <span>API Architect Studio</span>
              </div>
            </div>
          </motion.div>

          {/* Box 2: The Author Widget (5 columns) */}
          <motion.div 
            variants={itemVariants} 
            className="md:col-span-5 bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group bg-fine-grid"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.01] to-transparent pointer-events-none"></div>

            <div className="space-y-6 text-center md:text-left">
              <div className="relative w-32 h-32 mx-auto md:mx-0 rounded-full overflow-hidden border border-zinc-800 group-hover:border-zinc-700/80 shadow-md p-1 bg-zinc-900">
                <img 
                  src={PrathamPic} 
                  alt="Pratham Raval" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-black text-white tracking-tight">Pratham Raval</h3>
                <p className="text-[10px] text-blue-400 font-black uppercase tracking-wider inline-block bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-md">
                  Full-Stack Developer & AI Engineer
                </p>
                <p className="text-zinc-400 text-[11.5px] leading-relaxed font-medium pt-2">
                  I’m a Full-Stack Developer and AI Engineer passionate about building scalable software and intelligent systems that solve real-world problems. My ambition is to build something that is useful for most of the people who have an internet connection.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-900/60 mt-6 space-y-3">
              <a 
                href="https://github.com/PrathamR015"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-zinc-900 hover:bg-zinc-850 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 border border-zinc-800 hover:border-zinc-700 flex items-center justify-center space-x-2 py-3 shadow-md select-none active:scale-[0.98]"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Profile</span>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Footer info badge */}
        <motion.div variants={itemVariants} className="flex justify-center items-center gap-1.5 text-zinc-650 text-[10px] font-bold uppercase tracking-widest pt-4">
          <Heart className="w-3.5 h-3.5 text-rose-500 animate-pulse fill-rose-500" />
          <span>Built by Developers for Developers</span>
        </motion.div>

      </motion.div>
    </div>
  );
}
