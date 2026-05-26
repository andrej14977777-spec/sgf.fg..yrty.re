"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import init, { P2pBridge } from "../pkg/wasm_mini_server";

export interface LinkMessage {
  id: string;
  roomId: string;
  url: string;
  description: string;
  timestamp: number;
  authorPublicKey: string;
  signature: string;
}

interface P2pContextType {
  isReady: boolean;
  isNodeConnected: boolean;
  messages: LinkMessage[];
  requestRoomData: (roomId: string) => void;
}

const P2pContext = createContext<P2pContextType | null>(null);

export function P2pProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isNodeConnected, setIsNodeConnected] = useState(false);
  const [bridge, setBridge] = useState<P2pBridge | null>(null);
  const [messages, setMessages] = useState<LinkMessage[]>([]);

  const handleRustMessage = useCallback((event: Event) => {
    const customEvent = event as CustomEvent; 
    const response = customEvent.detail;
    
    if (response.type === "ROOM_DATA") {
      setMessages(response.data as LinkMessage[]);
    } else if (response.type === "NEW_LINK") {
      setMessages((prev) => [response.data as LinkMessage, ...prev]);
    }
  }, []);

  useEffect(() => {
    let bridgeInstance: P2pBridge;
    let isMounted = true;

    // 1. АВТОНОМНАЯ ЗАЩИТА ОТ КРАША WASM СО СТРОГОЙ ТИПИЗАЦИЕЙ (Без any!)
    const OriginalWebSocket = window.WebSocket;
    
    // Проверяем, не проксировали ли мы уже сокет (используем unknown для обхода строгих типов)
    if (OriginalWebSocket && !(OriginalWebSocket as unknown as { __isProxied?: boolean }).__isProxied) {
      const ProxiedWebSocket = function(url: string | URL, protocols?: string | string[]) {
        const wsInstance = new OriginalWebSocket(url, protocols);
        // Строгий тип для обработчика событий вместо any
        let wasmOnErrorHandler: ((event: Event) => void) | null = null;
        
        Object.defineProperty(wsInstance, 'onerror', {
          get() { return wasmOnErrorHandler; },
          set(handler: ((event: Event) => void) | null) {
            wasmOnErrorHandler = handler;
            wsInstance.addEventListener('error', (event: Event) => {
              if (wasmOnErrorHandler) {
                // Расширяем стандартный Event свойством message (которое ждет Rust Wasm)
                const customErrorEvent = event as Event & { message?: string };
                if (customErrorEvent.message === undefined) {
                  Object.defineProperty(customErrorEvent, 'message', { value: '', writable: true, configurable: true });
                }
                wasmOnErrorHandler(customErrorEvent);
              }
            });
          },
          configurable: true
        });
        return wsInstance;
      } as unknown as typeof WebSocket; // Приводим к типу оригинального конструктора

      Object.setPrototypeOf(ProxiedWebSocket, OriginalWebSocket);
      ProxiedWebSocket.prototype = OriginalWebSocket.prototype;
      // Помечаем сокет как проксированный
      (ProxiedWebSocket as unknown as { __isProxied: boolean }).__isProxied = true;
      window.WebSocket = ProxiedWebSocket;
    }

    // 2. ИНИЦИАЛИЗАЦИЯ WASM И ПОДКЛЮЧЕНИЕ К ANDROID
    async function initializeWasm() {
      try {
        await init('/wasm/wasm_mini_server_bg.wasm');
        if (!isMounted) return; 
        
        bridgeInstance = new P2pBridge("ws://localhost:8080/ws");
        if (!isMounted) {
            bridgeInstance.free();
            return;
        }

        setBridge(bridgeInstance);
        setIsReady(true);
        console.log("P2P Bridge: Connected to Android Node via WebSocket");

        window.addEventListener("p2p_message_received", handleRustMessage);
      } catch (err) {
        console.error("Critical Wasm Initialization Error:", err);
      }
    }

    initializeWasm();

    // 3. ФОНОВЫЙ ПИНГ ЛОКАЛЬНОГО СЕРВЕРА ANDROID
    function checkAndroidNode() {
      const testWs = new OriginalWebSocket('ws://localhost:8080/ws');
      
      const timeout = setTimeout(() => {
        if (testWs.readyState !== OriginalWebSocket.OPEN) {
          testWs.close();
          setIsNodeConnected(false);
        }
      }, 1500);

      testWs.onopen = () => {
        clearTimeout(timeout);
        setIsNodeConnected(true);
        testWs.close(); 
      };

      testWs.onerror = () => {
        clearTimeout(timeout);
        setIsNodeConnected(false);
      };
    }

    checkAndroidNode();
    // ИСПРАВЛЕНИЕ: Используем const вместо let
    const intervalId = setInterval(checkAndroidNode, 5000); 

    return () => {
      isMounted = false;
      clearInterval(intervalId);
      window.removeEventListener("p2p_message_received", handleRustMessage);
      if (bridgeInstance) {
        bridgeInstance.free();
      }
    };
  }, [handleRustMessage]); 

  const requestRoomData = useCallback((roomId: string) => {
    if (bridge) {
      bridge.request_room_data(roomId);
    }
  }, [bridge]);

  return (
    <P2pContext.Provider value={{ isReady, isNodeConnected, messages, requestRoomData }}>
      {children}
    </P2pContext.Provider>
  );
}

export function useP2p() {
  const context = useContext(P2pContext);
  if (!context) {
    throw new Error("useP2p must be used within a P2pProvider");
  }
  return context;
}