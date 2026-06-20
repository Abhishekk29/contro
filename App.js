// App.js
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import * as SplashScreenExpo from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { enableScreens } from "react-native-screens";

import AboutScreen from "./src/screens/AboutScreen";
import EntryScreen from "./src/screens/EntryScreen";
import InvoiceScreen from "./src/screens/InvoiceScreen";
import QuickControScreen from "./src/screens/QuickControScreen";
import SavedControScreen from "./src/screens/SavedControScreen";
import SplashScreen from "./src/screens/SplashScreen";

enableScreens(true);

const Stack = createStackNavigator();

const DarkTheme = {
  dark: true,
  colors: {
    background: "#0b0b0f",
    card: "#0b0b0f",
    text: "#ffffff",
    border: "#1f1f2b",
    primary: "#7c6ff7",
    notification: "#7c6ff7",
  },
};

SplashScreenExpo.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    const timer = setTimeout(async () => {
      await SplashScreenExpo.hideAsync();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0b0b0f" />
      <NavigationContainer theme={DarkTheme}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            detachPreviousScreen: false,
            cardOverlayEnabled: false,
            ...TransitionPresets.SlideFromRightIOS,
            cardStyleInterpolator: ({ current, layouts }) => ({
              cardStyle: {
                backgroundColor: "#0b0b0f",
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
              overlayStyle: {
                opacity: 0,
              },
            }),
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Entry" component={EntryScreen} />
          <Stack.Screen name="QuickContro" component={QuickControScreen} />
          <Stack.Screen name="SavedContros" component={SavedControScreen} />
          <Stack.Screen name="Invoice" component={InvoiceScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
