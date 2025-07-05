import React from "react";
import Lucide from "@/components/Base/Lucide";
import { icons } from "lucide-react";

interface NoDataDisplayProps {
  icon: keyof typeof icons;
  title: string;
  message: string;
}

const NoDataDisplay: React.FC<NoDataDisplayProps> = ({ icon, title, message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-10">
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-slate-100">
        <Lucide
          icon={icon}
          className="w-8 h-8 text-slate-400"
        />
      </div>
      <div className="mt-4 text-lg font-medium">{title}</div>
      <div className="mt-1 text-slate-500">{message}</div>
    </div>
  );
};

export default NoDataDisplay;
