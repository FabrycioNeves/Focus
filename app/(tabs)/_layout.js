import { Tabs } from "expo-router";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: "#000",
        tabBarStyle: {
          backgroundColor: "#fff",
          presentation: "card",
          animation: "slide_from_right",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
