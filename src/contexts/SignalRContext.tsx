/* eslint-disable @typescript-eslint/no-explicit-any */
// src/contexts/SignalRContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import signalRService from "../services/signalRService";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

interface SignalRContextType {
  isConnected: boolean;
  connectionId: string | null;
  subscribe: (
    methodName: string,
    callback: (...args: any[]) => void
  ) => () => void;
  invoke: (methodName: string, ...args: any[]) => Promise<any>;
  send: (methodName: string, ...args: any[]) => Promise<void>;
}

const SignalRContext = createContext<SignalRContextType | undefined>(undefined);

interface SignalRProviderProps {
  children: ReactNode;
}

export const SignalRProvider = ({ children }: SignalRProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      // Disconnect if not authenticated
      signalRService.stopConnection();
      setIsConnected(false);
      setConnectionId(null);
      return;
    }

    // Connect when authenticated
    const connect = async () => {
      try {
        await signalRService.startConnection();
        setIsConnected(true);
        setConnectionId(signalRService.getConnectionId());
      } catch (error) {
        console.error("Failed to connect to SignalR:", error);
        setIsConnected(false);
        setConnectionId(null);
      }
    };

    connect();

    // Cleanup on unmount
    return () => {
      signalRService.stopConnection();
      setIsConnected(false);
      setConnectionId(null);
    };
  }, [isAuthenticated]);

  const subscribe = (
    methodName: string,
    callback: (...args: any[]) => void
  ) => {
    signalRService.on(methodName, callback);
    return () => {
      signalRService.off(methodName, callback);
    };
  };

  const invoke = async (methodName: string, ...args: any[]) => {
    return await signalRService.invoke(methodName, ...args);
  };

  const send = async (methodName: string, ...args: any[]) => {
    await signalRService.send(methodName, ...args);
  };

  const value: SignalRContextType = {
    isConnected,
    connectionId,
    subscribe,
    invoke,
    send,
  };

  return (
    <SignalRContext.Provider value={value}>{children}</SignalRContext.Provider>
  );
};

export const useSignalRContext = () => {
  const context = useContext(SignalRContext);
  if (context === undefined) {
    throw new Error("useSignalRContext must be used within a SignalRProvider");
  }
  return context;
};
