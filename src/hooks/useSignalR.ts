/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useCallback, useRef, useState } from "react";
import signalRService from "../services/signalRService";

interface UseSignalROptions {
  autoConnect?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

export const useSignalR = (options: UseSignalROptions = {}) => {
  const { autoConnect = true, onConnect, onDisconnect, onError } = options;
  const isConnecting = useRef(false);
  const hasConnected = useRef(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Only attempt connection if autoConnect is true and we haven't already connected
    if (autoConnect && !isConnecting.current && !hasConnected.current) {
      isConnecting.current = true;

      signalRService
        .startConnection()
        .then(() => {
          console.debug("SignalR hook: Connection established");
          setConnected(true);
          hasConnected.current = true;
          onConnect?.();
        })
        .catch((error) => {
          console.error("SignalR hook: Connection failed", error);
          setConnected(false);
          onError?.(error);
        })
        .finally(() => {
          isConnecting.current = false;
        });
    }

    // Cleanup function
    return () => {
      // Only disconnect if we're turning off autoConnect or unmounting
      if (!autoConnect && hasConnected.current) {
        console.debug("SignalR hook: Cleaning up connection");
        signalRService.stopConnection().catch((error) => {
          console.error("Error stopping SignalR connection:", error);
        });
        setConnected(false);
        hasConnected.current = false;
        onDisconnect?.();
      }
    };
  }, [autoConnect]); // Only depend on autoConnect, not the callbacks

  const subscribe = useCallback(
    (methodName: string, callback: (...args: any[]) => void) => {
      signalRService.on(methodName, callback);

      return () => {
        signalRService.off(methodName, callback);
      };
    },
    []
  );

  const invoke = useCallback(async (methodName: string, ...args: any[]) => {
    return await signalRService.invoke(methodName, ...args);
  }, []);

  const send = useCallback(async (methodName: string, ...args: any[]) => {
    await signalRService.send(methodName, ...args);
  }, []);

  const isConnected = useCallback(() => {
    return connected && signalRService.isConnected();
  }, [connected]);

  return {
    subscribe,
    invoke,
    send,
    isConnected,
    connected, // Return the state directly for easier use
    connection: signalRService,
  };
};

// Hook for listening to specific events
export const useSignalREvent = (
  eventName: string,
  callback: (...args: any[]) => void,
  deps: any[] = []
) => {
  useEffect(() => {
    signalRService.on(eventName, callback);
    return () => {
      signalRService.off(eventName, callback);
    };
  }, [eventName, ...deps]);
};
