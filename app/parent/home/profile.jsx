import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../../auth/AuthContext';
import Button from '../../components/button';
import CurvedHeader from '../../components/CurvedHeader';
import { TextInputComponent } from '../../components/inputs';
import Spacer from '../../components/Spacer';
import { useTheme } from "../../theme/ThemeContext";

import SWText from '../../components/SWText';

const API_URL = Constants.expoConfig?.extra?.apiUrl;


const Profile = () => {
  const {logout, token} = useAuth();
  const [activeTab, setActiveTab] = useState('Personal Info');

  const { theme } = useTheme();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [passwordloading, setpasswordLoading] = useState(false);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  

 useEffect(() => {
  async function loadSessionAndFetchProfile() {
    try {
      const session = await AsyncStorage.getItem('user_session');
      if (session) {
        const user = JSON.parse(session);
        console.log('User session:', user);

        // Now fetch profile using user.id
        console.log(`${API_URL}/parent/${user.user.id}`);
        const res = await fetch(`${API_URL}/parent/${user.user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to fetch profile');
        }

        const data = await res.json();
        setProfile(data);
      } else {
        throw new Error('No session found');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  loadSessionAndFetchProfile();
}, []);



  // if (loading) {
  //   return <SWText>Loading...</SWText>; 
  // }

  // if (error) {
  //   return <SWText>Error: {error}</SWText>;
  // }

  const handleUpdate = async () => {
    if (!editingField || !editValue || !profile) return;

    try {
      const res = await fetch(`${API_URL}/parent/${profile.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [editingField]: editValue }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Update failed');
      }

      const updated = await res.json();

      // Update local profile state with the new value
      setProfile((prev) => ({
        ...prev,
        [editingField]: editValue,
      }));

    } catch (err) {
      console.error('Update error:', err);
      // You can show a Toast here if needed
    } finally {
      setEditingField(null);
      setEditValue('');
    }
  };


   const handleUpdatePassword = async () => {
    const validationErrors = {};

    // Validation
    if (!currentPassword) {
      validationErrors.currentPassword = 'Current password is required';
    }

    if (!newPassword) {
      validationErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      validationErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (confirmPassword !== newPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setpasswordLoading(true);

    try {

      const response = await fetch(`${API_URL}/users/mobile-update-password/${profile.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong');
      }
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setpasswordLoading(false);
    }
  };

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
      color: theme.colors.accentblue,
    },
    tabIndicator: {
      height: 5,
      width: '100%',
      backgroundColor: theme.colors.accentblue,
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


  return (
    <SafeAreaView style={styles.container}>
      <CurvedHeader 
          title="Profile" 
          theme={theme}
      />

      <Spacer height={30}/>

      <View style={styles.tabs}>
        {['Personal Info', 'Security'].map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab ,activeTab === tab && styles.activeTab]}
          >
            <SWText
              uberBold = {activeTab === tab}
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </SWText>
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
                <SWText style={styles.label}>First Name</SWText>
                {editingField === 'firstname' ? (
                  <TextInput
                    style={styles.input}
                    value={editValue}
                    onChangeText={setEditValue}
                    autoFocus
                    onBlur={handleUpdate}
                  />
                ) : (
                  <SWText style={styles.value}>
                    {profile?.firstname} 
                  </SWText>
                )}
              </View>
              <View>
                <View style={styles.rowIcon}>
                  <TouchableOpacity
                    onPress={() => {
                      setEditingField('firstname');
                      setEditValue(`${profile?.firstname}`);
                    }}
                  >
                    <Ionicons name="arrow-forward-outline" size={20} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoData}>
                <SWText style={styles.label}>Last Name</SWText>
                {editingField === 'lastname' ? (
                  <TextInput
                    style={styles.input}
                    value={editValue}
                    onChangeText={setEditValue}
                    autoFocus
                    onBlur={handleUpdate}
                  />
                ) : (
                  <SWText style={styles.value}>
                    {profile?.lastname}
                  </SWText>
                )}
              </View>
              <View>
                <View style={styles.rowIcon}>
                  <TouchableOpacity
                    onPress={() => {
                      setEditingField('lastname');
                      setEditValue(`${profile?.lastname}`);
                    }}
                  >
                    <Ionicons name="arrow-forward-outline" size={20} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>


            <View style={styles.infoRow}>
              <View style={styles.infoData}>
                <SWText style={styles.label}>Phone number</SWText>
                <View style={styles.inlineRow}>
                  {editingField === 'mobile' ? (
                    <TextInput
                      style={styles.input}
                      value={editValue}
                      onChangeText={setEditValue}
                      keyboardType="phone-pad"
                      autoFocus
                      onBlur={handleUpdate}
                    />
                  ) : (
                    <>
                      <SWText style={styles.value}>
                        {profile?.mobile ?? 'Enter your Phone Number'}
                      </SWText>
                      <Ionicons name="checkmark-circle" size={16} color="green" />
                    </>
                  )}
                </View>
              </View>
              <View>
                <View style={styles.rowIcon}>
                  <TouchableOpacity
                    onPress={() => {
                      setEditingField('mobile');
                      setEditValue(profile?.mobile ?? '');
                    }}
                  >
                    <Ionicons name="arrow-forward-outline" size={20} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>


          <View style={styles.infoRow}>
            <View style={styles.infoData}>
              <SWText style={styles.label}>Email</SWText>
              <View style={styles.inlineRow}>
                {editingField === 'email' ? (
                  <TextInput
                    style={styles.input}
                    value={editValue}
                    onChangeText={setEditValue}
                    keyboardType="email-address"
                    autoFocus
                    onBlur={handleUpdate}
                  />
                ) : (
                  <>
                    <SWText style={styles.value}>{profile?.email}</SWText>
                    <Ionicons name="warning" size={16} color="orange" />
                  </>
                )}
              </View>
            </View>
            <View>
              <View style={styles.rowIcon}>
                <TouchableOpacity
                  onPress={() => {
                    setEditingField('email');
                    setEditValue(profile?.email ?? '');
                  }}
                >
                  <Ionicons name="arrow-forward-outline" size={20} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          </View>


            <View style={styles.infoRow}>
              <View style={styles.infoData}>
                <SWText style={styles.label}>Language</SWText>
                <View style={styles.inlineRow}>
                  <SWText style={styles.value}>English</SWText>
                  <Ionicons name="open-outline" size={16} color="#000" />
                </View>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.securityContainer}>
              <SWText bold h2>
                Change Password
              </SWText>
              <Spacer/>
              <TextInputComponent
                secureTextEntry={true}
                label="Current Password"
                placeholder="Enter current password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                error={errors.currentPassword}
              />

              <TextInputComponent
                secureTextEntry={true}
                label="New Password"
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={setNewPassword}
                error={errors.newPassword}
              />

              <TextInputComponent
                secureTextEntry={true}
                label="Confirm New Password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                error={errors.confirmPassword}
              />

              <Spacer/>

              <Button
                title={passwordloading ? "Updating..." : "Update Password"}
                varient='outlined-primaryDark'
                onPress={handleUpdatePassword}
                disabled={passwordloading}
              />
          </View>
        )}

        
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

