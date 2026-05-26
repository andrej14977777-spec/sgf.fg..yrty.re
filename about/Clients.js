'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Terminal, Radio, Link2, User } from 'lucide-react';
import { useP2p } from '@/components/P2pProvider';

export default function ClientsWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { isReady, isNodeConnected, messages, requestRoomData } = useP2p();
  const roomId = "about_room";

  useEffect(() => {
    if (isOpen && isReady && isNodeConnected) {
      requestRoomData(roomId);
    }
  }, [isOpen, isReady, isNodeConnected, requestRoomData, roomId]);

  const isP2pOnline = isReady && isNodeConnected;
  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed top-16 right-4 md:right-6 z-20 flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-5 md:py-3 
                  bg-background border border-(--cy-green)/40 rounded-full font-mono text-xs md:text-sm text-(--cy-green)
                  shadow-[0_0_20px_rgba(0,255,150,0.2)] hover:shadow-[0_0_30px_rgba(0,255,150,0.4)]
                  cursor-pointer transition-all duration-300 group"
      >
        <MessageSquare className="size-3.5 md:size-4.5 group-hover:rotate-12 transition-transform" />
        
        <span className="tracking-wider uppercase drop-shadow-[0_0_5px_rgba(0,255,150,0.5)]">Discuss</span>
        
        {isP2pOnline ? (
          <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-(--cy-green) animate-ping inline-block ml-0.5 md:ml-1" />
        ) : (
          <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-amber-500 inline-block ml-0.5 md:ml-1" title="Your device's local server's P2P core is unavailable." />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'circle(0% at 100% 100%)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at 100% 100%)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at 100% 100%)' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="fixed inset-x-0 bottom-0 top-16 z-50 bg-black/95 backdrop-blur-md flex flex-col font-mono text-white border-t border-(--cy-green)/20"
          >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_4px,3px_100%] pointer-events-none opacity-40" />

            <header className="relative z-10 flex items-center justify-between p-4 border-b border-(--cy-green)/20 bg-background/50">
              <div className="flex items-center gap-3">
                <Radio className={isP2pOnline ? "text-(--cy-green) animate-pulse" : "text-amber-500"} size={20} />
                <div>
                  <h3 className="text-sm font-bold tracking-widest text-white uppercase">
                    P2P_ROOM: <span className="text-(--cy-green)">{roomId}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Status: {isP2pOnline ? (
                      <span className="text-(--cy-green)">ONLINE (Wasm-Bridge)</span>
                    ) : (
                      <span className="text-amber-500 animate-pulse">SEARCHING_ANDROID_CORE</span>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 border border-muted-foreground/20 rounded-lg hover:border-red-500/50 hover:text-red-400 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </header>

            <main className="relative z-10 flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl mx-auto w-full custom-scrollbar">
              {!isNodeConnected ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center my-auto">
                  <Terminal size={40} className="text-amber-500 opacity-60 mb-2 animate-pulse" />
                  <p className="text-2xl text-amber-400">Local node not found</p>
                  <p className="text-center text-xs md:text-sm italic opacity-80 -mt-1 max-w-xs mx-auto leading-relaxed">
                    This page's functionality is not yet available. A background service will be launched soon on your Android device and PC to sync and expand new features using a local server.
                  </p>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                  <Terminal size={40} className="text-(--cy-cyan) opacity-40 mb-3 animate-pulse" />
                  <p className="text-sm">Waiting for network peers..</p>
                  <p className="text-xs opacity-60 mt-1">Data is requested through a local server</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-(--cy-green)/30 transition-all shadow-md group relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2 text-xs text-(--cy-cyan)">
                        <User size={14} />
                        <span className="truncate max-w-37.5 font-light" title={msg.authorPublicKey}>
                          {/* Безопасный вызов substring с использованием опциональной цепочки */}
                          {msg.authorPublicKey ? msg.authorPublicKey.substring(0, 12) : 'Peer_Node'}...
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : '—'}
                      </span>
                    </div>

                    <p className="text-sm text-white/90 mb-3 font-sans font-light leading-relaxed">
                      {msg.description}
                    </p>

                    {msg.url && (
                      <a
                        href={msg.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-black/40 border border-white/5 
                                   text-xs text-(--cy-green) hover:bg-(--cy-green)/10 hover:border-(--cy-green)/40 transition-all w-full md:w-auto truncate"
                      >
                        <Link2 size={12} className="shrink-0" />
                        <span className="break-all">{msg.url}</span>
                      </a>
                    )}
                    
                    <div className="absolute right-2 bottom-1 opacity-2 text-[8px] tracking-widest select-none pointer-events-none text-white font-mono">
                      SIG_VALID_2026
                    </div>
                  </motion.div>
                ))
              )}
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}