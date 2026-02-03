/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useEffect,
  useCallback,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useSignalR } from "../hooks/useSignalR";
import ToastService from "../services/toastService";

interface SignalRContextType {
  subscribe: (
    eventName: string,
    handler: (...args: any[]) => void
  ) => () => void;
  connected: boolean;
}

const SignalRContext = createContext<SignalRContextType | null>(null);

export const useSignalRContext = () => {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error("useSignalRContext must be used within SignalRProvider");
  }
  return context;
};

interface SignalRProviderProps {
  children: ReactNode;
  onMessage?: (user: string, message: string) => void;
}

export const SignalRProvider = ({
  children,
  onMessage,
}: SignalRProviderProps) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleConnect = useCallback(() => {
    console.log("✅ SignalR connected successfully");
  }, []);

  const handleDisconnect = useCallback(() => {
    console.error("❌ SignalR disconnected");
  }, []);

  const handleError = useCallback((error: Error) => {
    console.error("❌ Notification connection error", error);
    ToastService.showError(`❌ Notification connection error ${error}`);
  }, []);

  const { subscribe, connected } = useSignalR({
    autoConnect: isAuthenticated,
    onConnect: handleConnect,
    onDisconnect: handleDisconnect,
    onError: handleError,
  });

  // Subscribe to SignalR events when authenticated and connected
  useEffect(() => {
    if (!isAuthenticated || !connected || !onMessage) {
      console.debug("Not ready to subscribe - waiting for auth and connection");
      return;
    }

    // Subscribe to receivemessage event
    const unsubscribe = subscribe(
      "receivemessage",
      (user: string, message: string) => {
        onMessage(user, message);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [isAuthenticated, connected, subscribe, onMessage]);

  const contextValue: SignalRContextType = {
    subscribe,
    connected,
  };

  return (
    <SignalRContext.Provider value={contextValue}>
      {children}
    </SignalRContext.Provider>
  );
};
