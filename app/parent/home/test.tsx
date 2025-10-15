import { onValue, ref, set } from 'firebase/database';
import { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import { getFirebaseDB } from '../../../services/firebase';

export default function TestFirebase() {
  const [data, setData] = useState<any>(null);
  
  const testWrite = async () => {
    const db = getFirebaseDB();
    await set(ref(db, 'test/mobile'), {
      message: 'Hello from mobile',
      timestamp: Date.now(),
    });
  };
  
  useEffect(() => {
    const db = getFirebaseDB();
    const dataRef = ref(db, 'test/mobile');
    
    const unsubscribe = onValue(dataRef, (snapshot) => {
      setData(snapshot.val());
    });
    
    return () => unsubscribe();
  }, []);
  
  return (
    <View style={{ padding: 20 }}>
      <Text>Firebase Test</Text>
      <Button title="Write Data" onPress={testWrite} />
      <Text>{JSON.stringify(data, null, 2)}</Text>
    </View>
  );
}