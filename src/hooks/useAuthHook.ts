import { useForm } from 'react-hook-form';

interface authInputs {
    email:string;
    password:string;
    confirmPassword:string|null;
}

const useAuthHook = () => {
    const methods = useForm<authInputs>({
      defaultValues: {
        email: '',
        password:'',
        confirmPassword:null
      },
      mode: 'onBlur',
      reValidateMode: 'onChange',
    });
    return { ...methods, watch: methods.watch,reset:methods.reset,clearErrors:methods.clearErrors };
  };
  
  export default useAuthHook;