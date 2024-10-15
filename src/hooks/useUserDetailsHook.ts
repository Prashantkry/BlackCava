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
  return useForm<userInputs>({
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
};

export default useUserDetailsHook;
