import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginForm from '../app/login';
import authprof from '../app/authprof';
import authstud from './authstud';
import forgot from '../app/forgot';
import dashboardProf from '../app/dashboardProf'; 
import dashboardStudent from '../app/dashboardStudent';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator >
        <Stack.Screen 
          name="Login" 
          component={LoginForm} 
          options={{headerShown:false}}
         
        />
        <Stack.Screen 
          name="Instructor" 
          component={authprof} 
          options={{headerShown:false}}
        />

          <Stack.Screen 
          name="Student" 
          component={authstud} 
          options={{headerShown:false}}
        />
        <Stack.Screen 
          name="Forgot" 
          component={forgot} 
          options={{headerShown:false}}
        />
        <Stack.Screen 
          name="DashboardProf" 
          component={dashboardProf} 
          options={{headerShown:false}}
        />
        <Stack.Screen 
          name="DashboardStudent" 
          component={dashboardStudent} 
          options={{headerShown:false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
