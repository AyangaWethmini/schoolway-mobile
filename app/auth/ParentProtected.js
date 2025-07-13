import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SplashScreenSchoolway } from '../components/SplashScreen';
import { useAuth } from './AuthContext';

const ParentProtected = ({children}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isReady && user && isAuthenticated &&  !isLoading && user?.role) {
      if (user.role !== 'PARENT') {
        // Redirect to login if the user is not a driver
        router.replace('login/login');
        setIsReady(false);
      }else {
        setIsReady(true);
      }
    }
  }, [user]);

  if (isLoading || !isReady) {
    return (
      <SplashScreenSchoolway/>
    );
  }

  return (
    children
  )
}

export default ParentProtected
