// ForgotPassword.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native'; 
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import head from '../assets/images/Capture.png'; 

const ForgotPassword = () => {
  const navigation = useNavigation(); // Get the navigation prop
  const [email, setEmail] = useState('');

  const handleRequestReset = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    // Simulate password reset logic (e.g., call an API)
    Alert.alert('Success', `Reset link sent to ${email}`);
    setEmail(''); // Clear the input field after submission
    navigation.navigate('Login'); // Navigate back to the login screen
  };

  return (
    <View style={styles.container}>
      <Image source={head} style={styles.headerImage} />
      <Text style={styles.headerText}>Appointment Management System</Text>
      <Text style={styles.instructionText}>
        Enter your email address to receive a password reset link.
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleRequestReset}>
        <Text style={styles.submitButtonText}>Request Reset</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.switchMode}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
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
  instructionText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 14,
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
  switchMode: {
    color: '#007bff',
    marginTop: 10,
    textAlign: 'center',
  },
  headerImage: {
    alignItems: 'center',
    marginBottom: 24,
  },
});

export default ForgotPassword;
