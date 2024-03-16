import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  Image,
} from "react-native";
import React from "react";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_300Light,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { BlurView } from "expo-blur";
import { ScaledSheet } from "react-native-size-matters";

export default function Analyse() {
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
          <Text style={styles.HeaderText}>Analyse</Text>
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
    backgroundColor: "red",
  },
});
