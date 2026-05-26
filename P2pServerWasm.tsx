"use client";

import { useState } from "react";
import { useP2p } from "./P2pProvider"; 

export default function CyberBoard() {
  const { isReady, messages, requestRoomData } = useP2p(); 
  const [currentRoom, setCurrentRoom] = useState("cybersecurity");

  const loadRoom = () => {
    requestRoomData(currentRoom);
  };

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg border border-gray-700">
      <h3 className="text-xl mb-4 font-bold text-green-400">P2P Decentralized Board</h3>
      
      {!isReady ? (
        <p className="animate-pulse text-yellow-500">Establishing P2P Secure Tunnel...</p>
      ) : (
        <>
          <div className="flex gap-2 mb-4">
            <input 
              value={currentRoom}
              onChange={(e) => setCurrentRoom(e.target.value)}
              className="bg-black border border-green-500 text-green-400 px-2 py-1 flex-1"
              placeholder="Enter room name..."
            />
            <button 
              onClick={loadRoom}
              className="px-4 py-1 bg-green-600 rounded hover:bg-green-500 font-bold"
            >
              Sync Room
            </button>
          </div>

          <div className="text-xs bg-black p-2 rounded overflow-auto h-64 border border-gray-700">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center mt-10">No data found. Sync to load links.</p>
            ) : (
              <ul className="space-y-4">
                {messages.map((msg) => (
                  <li key={msg.id} className="border-b border-gray-800 pb-2">
                    {/* ИСПРАВЛЕН CSS класс на break-all */}
                    <p className="text-blue-400 break-all">{msg.url}</p> 
                    <p className="text-gray-400 mt-1">{msg.description}</p>
                    <p className="text-gray-600 mt-1" style={{ fontSize: '10px' }}>
                      {/* ДОБАВЛЕНА ЗАЩИТА: знак вопроса перед substring */}
                      Auth: {msg.authorPublicKey?.substring(0, 16) || 'Unknown'}...
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}