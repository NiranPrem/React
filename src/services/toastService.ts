import { Toast } from "primereact/toast";
import React from "react";

// Custom icon components for toast notifications
const SuccessIcon = () =>
  React.createElement(
    "div",
    { className: "custom-toast-icon custom-toast-icon-success" },
    React.createElement("img", {
      src: "/sucess.svg",
      alt: "success",
      width: "16",
      height: "16",
    })
  );

const InfoIcon = () =>
  React.createElement(
    "div",
    { className: "custom-toast-icon custom-toast-icon-info" },
    React.createElement("img", {
      src: "/info.svg",
      alt: "info",
      width: "16",
      height: "16",
    })
  );

const WarnIcon = () =>
  React.createElement(
    "div",
    { className: "custom-toast-icon custom-toast-icon-warn" },
    React.createElement("img", {
      src: "/warning.svg",
      alt: "warning",
      width: "16",
      height: "16",
    })
  );

const ErrorIcon = () =>
  React.createElement(
    "div",
    { className: "custom-toast-icon custom-toast-icon-error" },
    React.createElement("img", {
      src: "/error.svg",
      alt: "error",
      width: "16",
      height: "16",
    })
  );

// ToastService is a singleton service for displaying toast notifications
class ToastService {
  private toast: Toast | null = null;

  // Set the Toast reference to be used for displaying notifications
  setToast(ref: Toast | null) {
    this.toast = ref;
  }

  // Show success notifications
  showSuccess(message: string, summary?: string) {
    this.toast?.show({
      severity: "success",
      summary,
      detail: message,
      life: 3000,
      icon: React.createElement(SuccessIcon),
    });
  }

  // Show info notifications
  showInfo(message: string, summary?: string) {
    this.toast?.show({
      severity: "info",
      summary,
      detail: message,
      life: 3000,
      icon: React.createElement(InfoIcon),
    });
  }

  // Show warning notifications
  showWarn(message: string, summary?: string) {
    this.toast?.show({
      severity: "warn",
      summary,
      detail: message,
      life: 3000,
      icon: React.createElement(WarnIcon),
    });
  }

  // Show error notifications
  showError(message: string, summary?: string) {
    this.toast?.show({
      severity: "error",
      summary,
      detail: message,
      life: 3000,
      icon: React.createElement(ErrorIcon),
    });
  }
}

export default new ToastService();
