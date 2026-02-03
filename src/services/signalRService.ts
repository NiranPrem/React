/* eslint-disable @typescript-eslint/no-explicit-any */
import * as signalR from "@microsoft/signalr";

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 1;
  private readonly reconnectDelay = 8000;
  private readonly hubUrl: string;

  constructor(hubUrl: string) {
    this.hubUrl = hubUrl;
  }

  // Initialize connection with authentication
  public async startConnection(): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      console.debug("Already connected to SignalR Hub");
      return;
    }

    // Get authentication token from localStorage
    const token = localStorage.getItem("token");

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        skipNegotiation: false,
        transport:
          signalR.HttpTransportType.WebSockets |
          signalR.HttpTransportType.ServerSentEvents,
        accessTokenFactory: () => {
          // Return the token for authentication
          return token || "";
        },
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          if (retryContext.previousRetryCount < this.maxReconnectAttempts) {
            return this.reconnectDelay;
          }
          return null; // Stop reconnecting
        },
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Connection event handlers
    this.connection.onreconnecting((error) => {
      console.debug("SignalR reconnecting...", error);
    });

    this.connection.onreconnected((connectionId) => {
      console.debug("SignalR reconnected. Connection ID:", connectionId);
      this.reconnectAttempts = 0;
    });

    this.connection.onclose((error) => {
      console.debug("SignalR connection closed", error);
      this.attemptReconnect();
    });

    try {
      await this.connection.start();
      console.debug("Connected to SignalR Hub");
      this.reconnectAttempts = 0;
    } catch (err) {
      console.error("Error connecting to SignalR Hub:", err);
      this.attemptReconnect();
    }
  }

  // Manual reconnection logic
  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.debug(
        `Reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`
      );
      setTimeout(() => this.startConnection(), this.reconnectDelay);
    } else {
      console.error("Max reconnection attempts reached");
    }
  }

  // Subscribe to hub methods
  public on(methodName: string, callback: (...args: any[]) => void): void {
    if (this.connection) {
      this.connection.on(methodName, callback);
    }
  }

  // Unsubscribe from hub methods
  public off(methodName: string, callback: (...args: any[]) => void): void {
    if (this.connection) {
      this.connection.off(methodName, callback);
    }
  }

  // Invoke server methods
  public async invoke(methodName: string, ...args: any[]): Promise<any> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      try {
        return await this.connection.invoke(methodName, ...args);
      } catch (err) {
        console.error(`Error invoking ${methodName}:`, err);
        throw err;
      }
    } else {
      throw new Error("SignalR connection is not established");
    }
  }

  // Send messages (fire and forget)
  public async send(methodName: string, ...args: any[]): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.send(methodName, ...args);
      } catch (err) {
        console.error(`Error sending ${methodName}:`, err);
        throw err;
      }
    } else {
      throw new Error("SignalR connection is not established");
    }
  }

  // Stop connection
  public async stopConnection(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
        console.debug("SignalR connection stopped");
        this.connection = null;
      } catch (err) {
        console.error("Error stopping SignalR connection:", err);
      }
    }
  }

  // Get connection state
  public getConnectionState(): signalR.HubConnectionState | null {
    return this.connection?.state || null;
  }

  // Check if connected
  public isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  // Get connection ID
  public getConnectionId(): string | null {
    return this.connection?.connectionId || null;
  }
}

// Create instance based on environment
const getHubUrl = () => {
  const mode = import.meta.env.MODE;
  switch (mode) {
    case "production":
      return import.meta.env.VITE_SIGNALR_HUB_URL_PROD;
    case "staging":
      return import.meta.env.VITE_SIGNALR_HUB_URL_STAGING;
    default:
      return import.meta.env.VITE_SIGNALR_HUB_URL_DEV;
  }
};

export const signalRService = new SignalRService(getHubUrl());
export default signalRService;
