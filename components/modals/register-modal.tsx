import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import useLoginModal from '@/hooks/useLoginModal';
import useRegisterModal from '@/hooks/useRegisterModal';
import { registerStep1Schema, registerStep2Schema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { AlertCircle } from 'lucide-react';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Button from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import Modal from '../ui/modal';

export default function RegisterModal() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ name: '', email: '' });

  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();

  const onToggle = useCallback(() => {
    loginModal.onOpen();
    registerModal.onClose();
  }, [loginModal, registerModal]);

  const bodyContent =
    step === 1 ? (
      <RegisterStep1 setData={setData} setStep={setStep} />
    ) : (
      <RegisterStep2 data={data} />
    );

  const footer = (
    <div className="text-neutral-400 text-center mb-4">
      <p>
        Already have an account?{' '}
        <span
          onClick={onToggle}
          className="text-white cursor-pointer hover:underline"
        >
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

function RegisterStep1({
  setData,
  setStep,
}: {
  setStep: Dispatch<SetStateAction<number>>;
  setData: Dispatch<SetStateAction<{ name: string; email: string }>>;
}) {
  const [error, setError] = useState<string>();

  const form = useForm<z.infer<typeof registerStep1Schema>>({
    resolver: zodResolver(registerStep1Schema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof registerStep1Schema>) {
    try {
      const { data } = await axios.post('/api/auth/register?step=1', values);
      if (data.success) {
        setData(values);
        setStep(2);
      }
    } catch (error: Error | any) {
      if (error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong, please try again later');
      }
    }
  }

  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-12">
        <h3 className="text-3xl font-semibold text-white">Create an account</h3>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}.</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          label={'Next'}
          type="submit"
          secondary
          fullWidth
          large
          disabled={isSubmitting}
        />
      </form>
    </Form>
  );
}

function RegisterStep2({ data }: { data: { name: string; email: string } }) {
  const [error, setError] = useState<string>();
  const registerModal = useRegisterModal();
  const form = useForm<z.infer<typeof registerStep2Schema>>({
    resolver: zodResolver(registerStep2Schema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof registerStep2Schema>) {
    try {
      const { data: response } = await axios.post('/api/auth/register?step=2', {
        ...data,
        ...values,
      });
      if (response.success) {
        registerModal.onClose();
        console.log(response);
      }
    } catch (error: Error | any) {
      if (error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong, please try again later');
      }
    }
  }

  const { isSubmitting } = form.formState;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-12">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}.</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Password" type="password" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          label={'Register'}
          type="submit"
          secondary
          fullWidth
          large
          disabled={isSubmitting}
        />
      </form>
    </Form>
  );
}
