//my-pwa\app\[lang]\about\AboutClient.js
'use client';
import { motion } from 'motion/react';
import { Terminal, Clock } from 'lucide-react';

export default function AboutClient({ dict }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen relative font-sans text-white overflow-hidden bg-background">
      {/* Мягкий фоновый градиент */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,#1a1a1a,transparent)] pointer-events-none" />

      <motion.header 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 px-4 pt-21 pb-2 max-w-6xl mx-auto"
      >
        <motion.h1 variants={itemVariants} className="text-2xl md:text-7xl font-mono font-bold text-white mb-2 leading-tight">
          <span className="text-(--cy-green) drop-shadow-[0_0_20px_rgba(0,255,150,0.4)]">
            {dict.hero.titleHighlight}
          </span>
          {dict.hero.titleSuffix}
        </motion.h1>
        
        <motion.div variants={itemVariants} className="flex gap-6 items-start border-l-2 border-(--cy-green)/30 pl-8 group">
          <Clock className="text-(--cy-green) mt-1 shrink-0 group-hover:rotate-12 transition-transform" size={24} />
          <p className="text-(--cy-cyan) max-w-3xl font-mono text-sm md:text-lg opacity-90 leading-relaxed italic whitespace-pre-line">
            {dict.hero.subtitle}
          </p>
        </motion.div>
      </motion.header>

      <motion.main 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="px-4 mx-auto w-full max-w-6xl pb-6 relative z-10"
      >
        <div className="space-y-8">
        <motion.div variants={itemVariants} className="group flex flex-col items-center text-center">
        
        {/* Центрированный блок с иконкой и свечением */}
        <div className="flex items-center justify-center gap-8 mb-4">
            {/* Иконка слева с эффектом свечения */}
            <div className="p-2 rounded-full bg-(--cy-green)/5 border border-(--cy-green)/20 
                            shadow-[0_0_30px_rgba(0,255,150,0.15)] group-hover:shadow-[0_0_50px_rgba(0,255,150,0.3)] 
                            transition-all duration-700 shrink-0">
                <Terminal 
                    size={36} 
                    className="text-(--cy-green) animate-pulse drop-shadow-[0_0_10px_rgba(0,255,150,0.9)]" 
                />
            </div>
            
            {/* Заголовок справа */}
            <h2 className="font-mono text-xs md:text-xl tracking-[0.4em] text-(--cy-green) uppercase 
                        drop-shadow-[0_0_15px_rgba(0,255,150,0.5)] leading-tight text-left">
                {dict.main.heading}
            </h2>
        </div>

        
        {/* Основной контент тоже центрируем для баланса */}
        <div className="space-y-4 text-sm md:text-xl text-muted-foreground leading-relaxed font-light max-w-7xl mx-auto">
            <div className="flex flex-col items-center gap-2">
            <p className="hover:text-white transition-colors duration-500">
                {dict.main.paragraph1}
            </p>
            </div>

            <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            className="h-px bg-linear-to-r from-transparent via-(--cy-green) to-transparent opacity-90 mx-auto" 
            />
            
            <div className="flex flex-col items-center gap-1">
            <div className="space-y-1 flex flex-col items-center">
                <p className="hover:text-white transition-colors duration-500 whitespace-pre-line">
                {dict.main.paragraph2}
                </p>
            </div>
            </div>
        </div>
        </motion.div>
        </div>
      </motion.main>
    </div>
  );
}
