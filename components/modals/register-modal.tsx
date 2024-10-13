import useRegisterModal from '@/hooks/useRegisterModal';
import { useState } from 'react';
import Modal from '../ui/modal';

export default function RegisterModal() {
  const [step, setStep] = useState(1);

  const registerModal = useRegisterModal();

  const bodyContent = step === 1 ? <RegisterStep1 /> : <RegisterStep2 />;

  const footer = (
    <div className="text-neutral-400 text-center mb-4">
      <p>
        Already have an account?{' '}
        <span className="text-white cursor-pointer hover:underline">
          Sign in
        </span>
      </p>
    </div>
  );

  return (
    <Modal
      title="Create an account"
      body={bodyContent}
      footer={footer}
      isOpen={registerModal.isOpen}
      onClose={registerModal.onClose}
      step={step}
      totalSteps={2}
    />
  );
}

function RegisterStep1() {
  return <div>Register step 1</div>;
}

function RegisterStep2() {
  return <div>Register step 2</div>;
}
