import { useForm, Controller } from 'react-hook-form';
import { Coffee } from '@/app/Modals/modal'; // Adjust path according to your folder structure

export const useCoffeeForm = (defaultValues?: Coffee) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<Coffee>({
    defaultValues: defaultValues || {
      productId: '',
      name: '',
      image: '',
      description: '',
      category: '',
      flavour: '',
      small: '',
      medium: '',
      large: '',
    },
  });

  // This function will be used to handle the form submission
  const onSubmit = (data: Coffee, callback: (data: Coffee) => void) => {
    callback(data);
  };

  return {
    control,
    handleSubmit,
    errors,
    onSubmit,
    reset,
    setValue
  };
};


