import React from "react";
import "./TopCenterNotification.css";
import { BellRing } from "lucide-react"; // ✅ Lucide-react icon

interface TopCenterNotificationProps {
  message: string;
  show: boolean;
}

const TopCenterNotification: React.FC<TopCenterNotificationProps> = ({
  message,
  show,
}) => {
  return (
    <div className={`top-center-notification ${show ? "show" : ""}`}>
      <span className="icon">
        <BellRing size={20} strokeWidth={2.2} />
      </span>
      <span className="message">{message}</span>
    </div>
  );
};

export default TopCenterNotification;
