// withAuth.tsx
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withAuth = (WrappedComponent: any) => {
  const AuthComponent = (props: any) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('customerId'); // Assume the token is stored in localStorage
      if (!token) {
        router.push('/Auth'); // Redirect to sign-in page if not authenticated
      }
    }, [router]);
    return localStorage.getItem('customerId') ? <WrappedComponent {...props} /> : null;
  };

  return AuthComponent;
};

export default withAuth;
