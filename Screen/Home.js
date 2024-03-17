import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  StatusBar,
} from "react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_300Light,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { BlurView } from "expo-blur";
import {
  FontAwesome6,
  Entypo,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { ScaledSheet } from "react-native-size-matters";
import { ref, onValue, off, onChildAdded } from "firebase/database";
import { db } from "../config";

export default function Home() {
  const [temperature, setTemperature] = useState(null);

  useEffect(() => {
    const temperatureRef = ref(db, "Temperature");

    const fetchTemperature = () => {
      onChildAdded(temperatureRef, (snapshot) => {
        const newTemperature = snapshot.val().Level;
        setTemperature(newTemperature);
      });
    };

    fetchTemperature();

    // Cleanup function to remove the listener when component unmounts
    return () => {
      // Detach the listener when the component unmounts
      off(temperatureRef);
    };
  }, []);

  let [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_300Light,
    Inter_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaView
      style={styles.container}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Image
        source={require("../assets/BkImage.png")}
        style={[styles.image, StyleSheet.absoluteFillObject]}
      />
      <StatusBar barStyle="light-content" backgroundColor="#2ca3c4" />
      <View style={styles.ContainerBox}>
        <View style={styles.Header}>
          <Text style={styles.HeaderText}>Home</Text>
        </View>
        <View style={styles.Middle}>
          <View style={styles.MiddleTop}>
            <BlurView
              experimentalBlurMethod="dimezisBlurView"
              intensity={50}
              style={styles.Box}
              tint="default"
            >
              <View style={styles.Box1}>
                <FontAwesome6 name="temperature-half" size={30} color="#fff" />
                <Text style={styles.NameText}>Temperature</Text>
                <Text style={styles.ValueText}>{temperature}</Text>
              </View>
            </BlurView>
            <BlurView
              experimentalBlurMethod="dimezisBlurView"
              intensity={50}
              tint="default"
              style={styles.Box}
            >
              <View style={styles.Box1}>
                <Entypo name="light-up" size={30} color="#fff" />
                <Text style={styles.NameText}>Light</Text>
                <Text style={styles.ValueText}>Light</Text>
              </View>
            </BlurView>
          </View>
          <View style={styles.MiddleMiddle}>
            <View style={styles.MiddleTop}>
              <BlurView
                experimentalBlurMethod="dimezisBlurView"
                intensity={50}
                style={styles.Box}
                tint="default"
              >
                <View style={styles.Box1}>
                  <MaterialCommunityIcons
                    name="test-tube"
                    size={30}
                    color="#fff"
                  />
                  <Text style={styles.NameText}>Ph value</Text>
                  <Text style={styles.ValueText}>6</Text>
                </View>
              </BlurView>
              <BlurView
                experimentalBlurMethod="dimezisBlurView"
                intensity={50}
                tint="default"
                style={styles.Box}
              >
                <View style={styles.Box1}>
                  <Entypo name="water" size={30} color="#fff" />
                  <Text style={styles.NameText}>Turbidity</Text>
                  <Text style={styles.ValueText}>10</Text>
                </View>
              </BlurView>
            </View>
          </View>
          <View style={styles.MiddleBottom}>
            <BlurView
              experimentalBlurMethod="dimezisBlurView"
              intensity={50}
              tint="default"
              style={styles.BoxBotom}
            >
              <View style={styles.Box2}>
                <MaterialCommunityIcons
                  name="chemical-weapon"
                  size={20}
                  color="#fff"
                />
                <Text style={styles.NameTextBottom}>
                  Total Dissolved solids level
                </Text>
                <Text style={styles.ValueTextBottom}>10</Text>
              </View>
            </BlurView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2ca3c4",
  },

  image: {
    alignSelf: "center",
    width: "100%",
    height: "100%",
  },

  ContainerBox: {
    alignSelf: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },

  Header: {
    justifyContent: "center",
    alignItems: "center",
    height: "10%",
  },
  HeaderText: {
    color: "white",
    fontFamily: "Inter_700Bold",
    fontSize: "25@mvs",
  },

  Middle: {
    flex: 1,
  },

  MiddleTop: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flex: 1,
  },

  MiddleMiddle: {
    flex: 1,
  },

  MiddleBottom: {
    flexDirection: "row",
    justifyContent: "space-around",
    flex: 1,
  },

  Box: {
    width: "40%",
    height: "60%",
    overflow: "hidden",
    borderRadius: 10,
    borderColor: "#fff",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  BoxBotom: {
    width: "70%",
    height: "30%",
    overflow: "hidden",
    borderRadius: 10,
    borderColor: "#fff",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },

  Box1: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },

  Box2: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    justifyContent: "space-evenly",
    alignItems: "center",
    alignContent: "center",
    textAlign: "center",
  },

  NameText: {
    color: "white",
    fontFamily: "Inter_400Regular",
    fontSize: "17@mvs",
  },

  ValueText: {
    color: "white",
    fontFamily: "Inter_500Medium",
    fontSize: "30@mvs",
  },
  NameTextBottom: {
    color: "white",
    fontFamily: "Inter_400Regular",
    fontSize: "17@mvs",
  },
  ValueTextBottom: {
    color: "white",
    fontFamily: "Inter_500Medium",
    fontSize: "20@mvs",
  },
  Bottom: {
    flex: 1,
    backgroundColor: "blue",
  },
});
