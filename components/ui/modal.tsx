import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { title } from 'process';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  isStep?: boolean;
  step?: number;
  totalSteps?: number;
}

export default function Modal({
  isOpen,
  onClose,
  body,
  footer,
  isStep,
  step,
  totalSteps,
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">{body}</div>
        {footer && <div className="mt-4">{footer}</div>}
      </DialogContent>
    </Dialog>
  );
}
