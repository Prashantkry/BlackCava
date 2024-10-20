import { useForm } from 'react-hook-form';

interface passwordInput {
  newPassword: string;
  confirmPassword: string;
}

const usePasswordHook = () => {
  const methods = useForm<passwordInput>({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  return { ...methods, watch: methods.watch,clearErrors: methods.clearErrors};
};

export default usePasswordHook;