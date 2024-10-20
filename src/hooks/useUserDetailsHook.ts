// hooks/useUserDetailsHook.ts
import { useForm } from 'react-hook-form';

interface userInputs {
  name: string;
  email: string;
  phoneNumber: string;
  addressLine1: string;
  city: string;
  state: string;
  pinCode: string;
  profilePic: string; 
}

const useUserDetailsHook = () => {
  const methods= useForm<userInputs>({
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      addressLine1: '',
      city: '',
      state: '',
      pinCode: '',
      profilePic: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
  return {...methods, watch: methods.watch,clearErrors: methods.clearErrors};
};

export default useUserDetailsHook;
