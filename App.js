// App.js
import React, { useEffect } from 'react';
import * as SplashScreenExpo from 'expo-splash-screen';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';
import { UserProvider } from './src/context/UserContext';
import { BillsProvider } from './src/context/BillsContext';

import EntryScreen from './src/screens/EntryScreen';
import SplashScreen from './src/screens/SplashScreen'; // your custom Lottie splash
import QuickControScreen from './src/screens/QuickControScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import AddBillScreen from './src/screens/AddBillScreen';
import EditBillScreen from './src/screens/EditBillScreen';
import AddFriendScreen from './src/screens/AddFriendScreen';
import FriendsScreen from './src/screens/FriendsScreen';
import InvoiceScreen from './src/screens/InvoiceScreen';
import AboutScreen from './src/screens/AboutScreen';

// Disable native screens optimization to avoid white flash
enableScreens(false);

// JS stacks
const RootStack = createStackNavigator();
const MainStack = createStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#181717ff',
  },
};

// ✅ Main app stack
function MainAppStack() {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#6200EE' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        cardStyle: { backgroundColor: '#181717ff' },
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        ...TransitionPresets.SlideFromRightIOS,
        gestureEnabled: true,
      }}
    >
      <MainStack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <MainStack.Screen name="AddBill" component={AddBillScreen} options={{ title: 'Add Bill' }} />
      <MainStack.Screen name="EditBill" component={EditBillScreen} options={{ title: 'Edit Bill' }} />
      <MainStack.Screen name="AddFriend" component={AddFriendScreen} options={{ title: 'Add Friend' }} />
      <MainStack.Screen name="FriendsScreen" component={FriendsScreen} options={{ title: 'My Friends' }} />
    </MainStack.Navigator>
  );
}

// Prevent native splash from hiding before JS loads
SplashScreenExpo.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    const timer = setTimeout(async () => {
      await SplashScreenExpo.hideAsync(); // hide native splash quickly
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <UserProvider>
      <BillsProvider>
        <NavigationContainer theme={MyTheme}>
          <RootStack.Navigator
            screenOptions={{
              headerShown: false,
              gestureEnabled: true,
              cardStyle: { backgroundColor: '#181717ff' },
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          >
            <RootStack.Screen name="Splash" component={SplashScreen} />
            <RootStack.Screen name="Entry" component={EntryScreen} />
            <RootStack.Screen name="About" component={AboutScreen} />
            <RootStack.Screen name="QuickContro" component={QuickControScreen} />
            <RootStack.Screen name="Invoice" component={InvoiceScreen} />
            <RootStack.Screen name="Signup" component={SignupScreen} />
            <RootStack.Screen name="MainApp" component={MainAppStack} />
          </RootStack.Navigator>
        </NavigationContainer>
      </BillsProvider>
    </UserProvider>
  );
}
