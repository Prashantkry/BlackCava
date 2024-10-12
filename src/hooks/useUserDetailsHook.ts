// hooks/useUserDetailsHook.ts
import { useForm } from 'react-hook-form';

interface userInputs {
  firstName: string;
  middleName: string|null;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  addressLine1: string;
  addressLine2: string|null;
  city: string;
  state: string;
  pinCode: string;
  profile: string; // URL or base64 string
}

const useUserDetailsHook = () => {
  return useForm<userInputs>({
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      gender: 'Male', // Default gender
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pinCode: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
};

export default useUserDetailsHook;
