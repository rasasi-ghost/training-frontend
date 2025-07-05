import React from "react";
import { Dialog } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import { icons } from "lucide-react";

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  icon?: keyof typeof icons;
  iconColor?: string;
  primaryButtonText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  title,
  message,
  icon = "CheckCircle",
  iconColor = "text-success",
  primaryButtonText = "OK",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="sm"
    >
      <Dialog.Panel>
        <div className="p-5 text-center">
          <Lucide
            icon={icon}
            className={`w-16 h-16 mx-auto mt-3 ${iconColor}`}
          />
          <div className="mt-5 text-2xl">{title}</div>
          <div className="mt-2 text-slate-500">
            {message}
          </div>
        </div>
        <div className="px-5 pb-8 text-center">
          <Button
            type="button"
            variant="primary"
            onClick={onClose}
            className="w-24"
          >
            {primaryButtonText}
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default ConfirmationModal;
