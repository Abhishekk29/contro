// App.js
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import {
  CardStyleInterpolators,
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import * as SplashScreenExpo from "expo-splash-screen";
import { useEffect } from "react";
import { enableScreens } from "react-native-screens";

import AboutScreen from "./src/screens/AboutScreen";
import EntryScreen from "./src/screens/EntryScreen";
import InvoiceScreen from "./src/screens/InvoiceScreen";
import QuickControScreen from "./src/screens/QuickControScreen";
import SplashScreen from "./src/screens/SplashScreen";

// Prevent white flash
enableScreens(false);

const Stack = createStackNavigator();

// Custom Dark Theme
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#0f0f12",
  },
};

// Prevent native splash from auto hiding
SplashScreenExpo.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    const timer = setTimeout(async () => {
      await SplashScreenExpo.hideAsync();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          cardStyle: { backgroundColor: "#0f0f12" },
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Entry" component={EntryScreen} />
        <Stack.Screen name="QuickContro" component={QuickControScreen} />
        <Stack.Screen name="Invoice" component={InvoiceScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
