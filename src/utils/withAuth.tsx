import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withAuth = (WrappedComponent: any) => {
  const AuthComponent = (props: any) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('customerEmail');
      if (!token) {
        router.push('/Auth');
      }
    }, [router]);
    return localStorage.getItem('customerEmail') ? <WrappedComponent {...props} /> : null;
  };

  return AuthComponent;
};

export default withAuth;
