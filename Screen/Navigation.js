import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./Home";
import Feeder from "./Feeder";
import Analyse from "./Analyse";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// Navigation Imported
const Tab = createBottomTabNavigator();

// Bottom Navigation Screens
function HomeScreen() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#00c4ff",
          tabBarInactiveTintColor: "#fff",
          tabBarStyle: { height: 70, backgroundColor: "#007ea4" },
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <MaterialCommunityIcons
                name="fishbowl-outline"
                size={35}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Feeder"
          component={Feeder} // You might need to define Location component
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name="fish-outline" size={35} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Analyse"
          component={Analyse}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name="pie-chart-outline" size={33} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default HomeScreen;
