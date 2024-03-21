import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  Image,
  ScrollView,
} from "react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_300Light,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { BlurView } from "expo-blur";
import { ScaledSheet } from "react-native-size-matters";
import { LineChart } from "react-native-chart-kit";
import { ref, onChildChanged, off, onChildAdded } from "firebase/database";
import { db } from "../config";

export default function Analyse() {
  const chartRef = useRef(null);
  const [sensorData, setSensorData] = useState([]);
  const [dailyAverages, setDailyAverages] = useState({
    Mon: { pH: 0, Temperature: 0, Turbidity: 0, TDS: 0 },
    Tue: { pH: 0, Temperature: 0, Turbidity: 0, TDS: 0 },
    Wed: { pH: 0, Temperature: 0, Turbidity: 0, TDS: 0 },
    Thu: { pH: 0, Temperature: 0, Turbidity: 0, TDS: 0 },
    Fri: { pH: 0, Temperature: 0, Turbidity: 0, TDS: 0 },
    Sat: { pH: 0, Temperature: 0, Turbidity: 0, TDS: 0 },
    Sun: { pH: 0, Temperature: 0, Turbidity: 0, TDS: 0 },
  });

  // console.log("Temp", AverageTemperature);
  // console.log("Turb", AverageTurbidity);

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_300Light,
    Inter_700Bold,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = () => {
      const sensorsRef = ref(db, "SensorData");

      const handleChildAdded = (snapshot) => {
        const newData = snapshot.val();
        if (isMounted) {
          setSensorData((prevData) => [...prevData, newData]);
        }
      };

      onChildAdded(sensorsRef, handleChildAdded);

      return () => {
        isMounted = false;
        off(sensorsRef, "child_added", handleChildAdded);
      };
    };

    fetchData();
  }, []); // Empty dependency array, so this effect runs only once

  useEffect(() => {
    // Initialize an object to hold daily averages
    const dailyAverages = {
      Mon: { pH: 0, Temperature: 0, Turbidity: 0, TDS: 0 },
      Tue: { pH: 0, Temperature: 0, Turbidity: 0, TDS: 0 },
      Wed: { pH: 0, Temperature: 0, Turbidity: 0, TDS: 0 },
      Thu: { pH: 0, Temperature: 0, Turbidity: 0, TDS: 0 },
      Fri: { pH: 0, Temperature: 0, Turbidity: 0, TDS: 0 },
      Sat: { pH: 0, Temperature: 0, Turbidity: 0, TDS: 0 },
      Sun: { pH: 0, Temperature: 0, Turbidity: 0, TDS: 0 },
    };

    // Initialize an object to count the number of data points for each day
    const dailyCounts = {
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
      Sun: 0,
    };

    const getDayOfWeekFromDate = (dateString) => {
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const date = new Date(dateString);
      return daysOfWeek[date.getDay()];
    };

    // Filter sensorData for the last week
    const today = new Date();
    const oneWeekAgo = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 7
    );
    const lastWeekData = sensorData.filter((data) => {
      const dataDate = new Date(data.Date);
      return dataDate >= oneWeekAgo && dataDate < today;
    });

    // Iterate through lastWeekData to accumulate daily totals and counts
    lastWeekData.forEach((data) => {
      const dayOfWeek = getDayOfWeekFromDate(data.Date);
      dailyAverages[dayOfWeek].pH += data.pH || 0;
      dailyAverages[dayOfWeek].Temperature += data.Temperature || 0;
      dailyAverages[dayOfWeek].Turbidity += data.Turbidity || 0;
      dailyAverages[dayOfWeek].TDS += data.TDS || 0;
      dailyCounts[dayOfWeek]++;
    });

    // Calculate daily averages and update state
    const updatedDailyAverages = { ...dailyAverages }; // Create a copy to avoid mutating state directly
    for (const day in updatedDailyAverages) {
      if (dailyCounts[day] > 0) {
        updatedDailyAverages[day].pH /= dailyCounts[day];
        updatedDailyAverages[day].Temperature /= dailyCounts[day];
        updatedDailyAverages[day].Turbidity /= dailyCounts[day];
        updatedDailyAverages[day].TDS /= dailyCounts[day];
      }
    }

    // Update state for daily averages
    setDailyAverages(updatedDailyAverages);
  }, [sensorData]); // Make sure to include sensorData as dependency

  if (!fontsLoaded && !fontError) {
    return null;
  }

  // Sample data for the LineChart
  const phData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [
          dailyAverages.Mon.pH,
          dailyAverages.Tue.pH,
          dailyAverages.Wed.pH,
          dailyAverages.Thu.pH,
          dailyAverages.Fri.pH,
          dailyAverages.Sat.pH,
          dailyAverages.Sun.pH,
        ],
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 4,
      },
    ],
  };

  const TemperatureData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [
          dailyAverages.Mon.Temperature,
          dailyAverages.Tue.Temperature,
          dailyAverages.Wed.Temperature,
          dailyAverages.Thu.Temperature,
          dailyAverages.Fri.Temperature,
          dailyAverages.Sat.Temperature,
          dailyAverages.Sun.Temperature,
        ],
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 4,
      },
    ],
  };

  const TurbidityData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [
          dailyAverages.Mon.Turbidity,
          dailyAverages.Tue.Turbidity,
          dailyAverages.Wed.Turbidity,
          dailyAverages.Thu.Turbidity,
          dailyAverages.Fri.Turbidity,
          dailyAverages.Sat.Turbidity,
          dailyAverages.Sun.Turbidity,
        ],
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 4,
      },
    ],
  };

  const TDSData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [
          dailyAverages.Mon.TDS,
          dailyAverages.Tue.TDS,
          dailyAverages.Wed.TDS,
          dailyAverages.Thu.TDS,
          dailyAverages.Fri.TDS,
          dailyAverages.Sat.TDS,
          dailyAverages.Sun.TDS,
        ],
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
              // experimentalBlurMethod="dimezisBlurView"
              intensity={50}
              tint="default"
              style={styles.Box}
            >
              <View style={styles.Box1}>
                <Text style={styles.NameText}>Ph Value</Text>
                {/* <Text style={styles.AverageText}>
                  Average: {averageTemperature} °C
                </Text> */}
              </View>
              <View ref={chartRef}>
                <LineChart
                  data={phData}
                  width={360}
                  height={160}
                  chartConfig={chartConfig}
                  yAxisSuffix={""}
                />
              </View>
            </BlurView>

            <BlurView
              // experimentalBlurMethod="dimezisBlurView"
              intensity={50}
              tint="default"
              style={styles.Box}
            >
              <View style={styles.Box1}>
                <Text style={styles.NameText}>Temperature</Text>
                {/* <Text style={styles.AverageText}>
                  Average: {averageTemperature} °C
                </Text> */}
              </View>
              <View ref={chartRef}>
                <LineChart
                  data={TemperatureData}
                  width={360}
                  height={160}
                  chartConfig={chartConfig}
                  yAxisSuffix={" °C"}
                />
              </View>
            </BlurView>

            <BlurView
              // experimentalBlurMethod="dimezisBlurView"
              intensity={50}
              tint="default"
              style={styles.Box}
            >
              <View style={styles.Box1}>
                <Text style={styles.NameText}>Turbidity</Text>
                {/* <Text style={styles.AverageText}>
                  Average: {averageTemperature} °C
                </Text> */}
              </View>
              <View ref={chartRef}>
                <LineChart
                  data={TurbidityData}
                  width={360}
                  height={160}
                  chartConfig={chartConfig}
                  yAxisSuffix={" NTU"}
                />
              </View>
            </BlurView>

            <BlurView
              // experimentalBlurMethod="dimezisBlurView"
              intensity={50}
              tint="default"
              style={styles.Box}
            >
              <View style={styles.Box1}>
                <Text style={styles.NameText}>TDS Value</Text>
                {/* <Text style={styles.AverageText}>
                  Average: {averageTemperature} °C
                </Text> */}
              </View>
              <View ref={chartRef}>
                <LineChart
                  data={TDSData}
                  width={360}
                  height={160}
                  chartConfig={chartConfig}
                  yAxisSuffix={" NTU"}
                />
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
  AverageText: {
    color: "white",
    fontFamily: "Inter_400Regular",
    fontSize: "12@mvs",
  },
});
