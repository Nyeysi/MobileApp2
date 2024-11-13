// LoginForm.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import head from '../assets/images/Capture.png'; // Ensure the image path is correct

const LoginForm = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
  
    const loginData = {
      email,
      password,
    };
  
    try {
      setLoading(true);
      const response = await fetch('http://192.168.0.103:5003/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
  
      setLoading(false);
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response Error:', errorText);
        Alert.alert('Error', 'Failed to log in. ' + errorText);
        return;
      }
  
      let responseData;
      try {
        responseData = await response.json();
        console.log('Response Data:', responseData);
      } catch (jsonError) {
        console.error('JSON Parse Error:', jsonError);
        Alert.alert('Error', 'Invalid response from the server.');
        return;
      }
  
      if (responseData.success) {
        Alert.alert('Success', 'Login successful!');
        // Store user information in state or context
        if (responseData.role === 'instructor') {
          navigation.navigate('DashboardProf', { user: responseData.user });
        } else if (responseData.role === 'student') {
          navigation.navigate('DashboardStudent', { user: responseData.user });
        }
      } else {
        Alert.alert('Error', responseData.message);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };
  return (
    <View style={styles.container}>
      <Image source={head} style={styles.headerImage} />
      <Text style={styles.headerText}>Appointment Management System</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"

        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleLogin} disabled={loading}>
        <Text style={styles.submitButtonText}>
          {loading ? 'Loading...' : 'Log In'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Forgot')}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Instructor')} style={styles.registerButton}>
        <Text style={styles.registerText}>Register as Instructor</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Student')} style={styles.registerButton}>
        <Text style={styles.registerText}>Register as Student</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles (same as before)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  headerImage: {
    alignItems: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 15,
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#276630',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  forgotPassword: {
    color: '#007bff',
    marginTop: 10,
    textAlign: 'center',
  },
  registerButton: {
    marginTop: 20,
  },
  registerText: {
    color: '#007bff',
    textAlign: 'center',
  },
});

export default LoginForm;
