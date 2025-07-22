import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../auth/AuthContext';
import Button from '../../components/button';
import PasswordInput from '../../components/inputs';
import Spacer from '../../components/Spacer';
import TextHeading from '../../components/TextHeading';

const Profile = () => {
  const {logout} = useAuth();
  const [activeTab, setActiveTab] = useState('Personal Info');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>

      <Spacer height={30}/>

      <View style={styles.tabs}>
        {['Personal Info', 'Security'].map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab ,activeTab === tab && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
            <View style={[activeTab != tab && styles.inactiveTabIndicator , activeTab === tab && styles.tabIndicator] } />
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'Personal Info' ? (
          <>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarCircle} />
              <TouchableOpacity style={styles.editIcon} onPress={() => logout()}>
                <Ionicons name="create-outline" size={16} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoData}>
                <Text style={styles.label}>Name</Text>
                <Text style={styles.value}>Duleepa Edirisinghe</Text>
              </View>
              <View>
                <View style={styles.rowIcon}>
                  <TouchableOpacity >
                    <Ionicons name="arrow-forward-outline" size={20} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoData}>
                <Text style={styles.label}>Phone number</Text>
                <View style={styles.inlineRow}>
                  <Text style={styles.value}>+94783152739</Text>
                  <Ionicons name="checkmark-circle" size={16} color="green" />
                </View>
              </View>
              <View>
                <View style={styles.rowIcon}>
                  <TouchableOpacity >
                    <Ionicons name="arrow-forward-outline" size={20} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoData}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inlineRow}>
                  <Text style={styles.value}>duleepa24@gmail.com</Text>
                  <Ionicons name="warning" size={16} color="orange" />
                </View>
              </View>
              <View>
                <View style={styles.rowIcon}>
                  <TouchableOpacity >
                    <Ionicons name="arrow-forward-outline" size={20} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoData}>
                <Text style={styles.label}>Language</Text>
                <View style={styles.inlineRow}>
                  <Text style={styles.value}>English</Text>
                  <Ionicons name="open-outline" size={16} color="#000" />
                </View>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.securityContainer}>
              <TextHeading>
                Change Password
              </TextHeading>
              <PasswordInput
                label="Current Password"
                placeholder="Enter current password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                error={errors.currentPassword}
              />

              <PasswordInput
                label="New Password"
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={setNewPassword}
                error={errors.newPassword}
              />

              <PasswordInput
                label="Confirm New Password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                error={errors.confirmPassword}
              />

              <Spacer/>

              <Button
                title="Update Password"
                varient='outlined-black'
                onPress={() => {
                  
                  console.log('Password updated!');
                }}
              />
          </View>
        )}
        const router = useRouter();

        <Button
          title="Go to Guardian"
          varient="outlined-black"
          onPress={() => router.push('/guardian/guardian')}
        />
        
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  tabs: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    paddingTop:15,
    alignItems: 'center',
  },
   activeTab: {
    backgroundColor: '#eee',
  },
  tabText: {
    fontSize: 14,
    color: '#888',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#000',
  },
  tabIndicator: {
    height: 5,
    width: '100%',
    backgroundColor: '#000',
    marginTop: 12,
  },
  inactiveTabIndicator: {
    height: 5,
    width: '100%',
    backgroundColor: '#eee',
    marginTop: 12,
  },
  content: {
    paddingHorizontal: 20,
  },
  avatarContainer: {
    alignItems: 'start',
    marginVertical: 50,
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 100,
    backgroundColor: '#ddd',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    left: 100,
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginHorizontal: 1,
    borderBottomWidth: 0.5,
    borderColor: '#ccc'
  },
  infoData:{
  }
  ,
  rowIcon:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    flex:1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    color: '#555',
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  securityContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
});
