import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const withAuth = (WrappedComponent: any) => {
  const AuthComponent = (props: any) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('customerEmail');
        if (!token) {
          router.push('/Auth');
        } else {
          setIsAuthenticated(true);
        }
      }
    }, [router]);

    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };

  return AuthComponent;
};

export default withAuth;
