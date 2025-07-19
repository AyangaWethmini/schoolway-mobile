import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SplashScreenSchoolway } from '../components/SplashScreen';
import { useAuth } from './AuthContext';

const UserProtected = ({children}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isReady  &&  !isLoading) {
      if (isAuthenticated || user ) {
        if (user && user.role === 'DRIVER') {
            router.replace('driver');
            setIsReady(false);
        }else if(user.role && user.role === 'PARENT') {
        router.replace('parent');
        setIsReady(false);
      }
      } else {
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

export default UserProtected
