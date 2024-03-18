import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  Image,
  ScrollView,
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
import { LineChart, BarChart } from "react-native-chart-kit";

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

  // Sample data for the LineChart
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [20, 45, 28, 80, 100, 43, 10],
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 4,
      },
    ],
  };

  // Chart configuration
  const chartConfig = {
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,

    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

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
        <View style={styles.view2}>
          <ScrollView
            contentContainerStyle={styles.Scroll}
            showsVerticalScrollIndicator={false}
          >
            <BlurView
              experimentalBlurMethod="dimezisBlurView"
              intensity={50}
              tint="default"
              style={styles.Box}
            >
              <View style={styles.Box1}>
                <Text style={styles.NameText}>Temperature</Text>
              </View>
              <LineChart
                data={data}
                width={360}
                height={160}
                chartConfig={chartConfig}
                yAxisSuffix={" °C"}
              />
            </BlurView>

            <BlurView
              experimentalBlurMethod="dimezisBlurView"
              intensity={50}
              tint="default"
              style={styles.Box}
            >
              <View style={styles.Box1}>
                <Text style={styles.NameText}>Timer</Text>
              </View>
            </BlurView>

            <BlurView
              experimentalBlurMethod="dimezisBlurView"
              intensity={50}
              tint="default"
              style={styles.Box}
            >
              <View style={styles.Box1}>
                <Text style={styles.NameText}>Timer</Text>
              </View>
            </BlurView>
            <BlurView
              experimentalBlurMethod="dimezisBlurView"
              intensity={50}
              tint="default"
              style={styles.Box}
            >
              <View style={styles.Box1}>
                <Text style={styles.NameText}>Timer</Text>
              </View>
            </BlurView>

            <BlurView
              experimentalBlurMethod="dimezisBlurView"
              intensity={50}
              tint="default"
              style={styles.Box}
            >
              <View style={styles.Box1}>
                <Text style={styles.NameText}>Timer</Text>
              </View>
            </BlurView>
          </ScrollView>
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
    alignItems: "center",
  },

  Scroll: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },

  view2: {
    flexDirection: "column",
    flex: 1,
  },

  Box: {
    marginTop: 10,
    width: "90%",
    height: "200@mvs",
    overflow: "hidden",
    borderRadius: 30,
    borderColor: "#fff",
    borderWidth: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 30,
  },

  Box1: {
    marginTop: 10,
    marginBottom: 10,
  },
  NameText: {
    color: "white",
    fontFamily: "Inter_700Bold",
    fontSize: "15@mvs",
  },
});
