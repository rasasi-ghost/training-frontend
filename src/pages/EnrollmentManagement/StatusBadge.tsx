import React from "react";
import Lucide from "@/components/Base/Lucide";

interface StatusBadgeProps {
  status: number;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // Get status info based on status code
  const getStatusInfo = (statusCode: number) => {
    switch (statusCode) {
      case 0:
        return {
          label: "Pending",
          bgClass: "bg-warning/20",
          textClass: "text-warning",
          icon: "Clock"
        };
      case 1:
        return {
          label: "Approved",
          bgClass: "bg-success/20",
          textClass: "text-success",
          icon: "CheckCircle"
        };
      case 2:
        return {
          label: "Completed",
          bgClass: "bg-primary/20",
          textClass: "text-primary",
          icon: "Award"
        };
      case 3:
        return {
          label: "Rejected",
          bgClass: "bg-danger/20",
          textClass: "text-danger",
          icon: "XCircle"
        };
      default:
        return {
          label: "Unknown",
          bgClass: "bg-slate-200",
          textClass: "text-slate-600",
          icon: "HelpCircle"
        };
    }
  };

  const statusInfo = getStatusInfo(status);

  return (
    <div className={`flex items-center px-3 py-1.5 rounded-full ${statusInfo.bgClass} ${statusInfo.textClass} text-xs font-medium`}>
      <Lucide icon={statusInfo.icon} className="w-3.5 h-3.5 mr-1" />
      {statusInfo.label}
    </div>
  );
};

export default StatusBadge;
