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
  const [sensorData, setSensorData] = useState([]);
  const [sensorDataCount, setSensorDataCount] = useState(0);
  const [sensorDataa, setSensorDataa] = useState(null);
  const [sumTemperaturee, setsumTemperaturee] = useState(null);
  // console.log(sumTemperaturee);
  // console.log("Count", sensorDataCount);

  const [clickedDataPoint, setClickedDataPoint] = useState(null);
  const chartRef = useRef(null);

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_300Light,
    Inter_700Bold,
  });

  useEffect(() => {
    let sumTemperature = 0;
    let temperatureCount = 0;

    const fetchData = () => {
      const sensorsRef = ref(db, "SensorData");

      const handleChildAdded = (snapshot) => {
        const newData = snapshot.val();
        setSensorData((prevData) => [...prevData, newData]);

        // Update sumTemperature and temperatureCount
        if (newData && newData.Temperature !== undefined) {
          sumTemperature += newData.Temperature;
          temperatureCount++;
        }

        // Update sensorDataCount
        setSensorDataCount((prevCount) => prevCount + 1);
      };

      const handleChildChanged = (snapshot) => {
        const newData = snapshot.val();
        setSensorDataa(newData);

        // If temperature changed, update sumTemperature and temperatureCount
        if (newData && newData.Temperature !== undefined) {
          sumTemperature += newData.Temperature - sensorDataa?.Temperature || 0;
          temperatureCount++;
          setsumTemperaturee(sumTemperature);
        }
      };

      onChildAdded(sensorsRef, handleChildAdded);
      onChildChanged(sensorsRef, handleChildChanged);

      return () => {
        off(sensorsRef, "child_added", handleChildAdded);
        off(sensorsRef, "child_changed", handleChildChanged);
      };
    };

    fetchData();

    return () => {
      off(ref(db, "SensorData"));
    };
  }, []);

  let temperature, pH, turbidity, tds, datee;

  if (sensorDataa) {
    temperature = sensorDataa.Temperature
      ? sensorDataa.Temperature.toFixed(1)
      : "0.0";
    pH = sensorDataa.pH ? sensorDataa.pH.toFixed(1) : "0.0";
    turbidity = sensorDataa.Turbidity
      ? sensorDataa.Turbidity.toFixed(1)
      : "0.0";
    tds = sensorDataa.TDS ? sensorDataa.TDS.toFixed(1) : "0.0";
    datee = sensorDataa.Date;
  }
  console.log("Date:", datee);
  // console.log(sumTemperaturee / sensorDataCount);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const calculateWeeklyTemperature = () => {
    const weeklyTemperature = [0, 0, 0, 0, 0, 0, 0];

    const currentDate = new Date();
    const oneWeekAgo = new Date(
      currentDate.getTime() - 7 * 24 * 60 * 60 * 1000
    ); // Get date from one week ago

    // Filter sensor data for the last week
    const lastWeekData = sensorData.filter(
      (data) => new Date(data.Date) >= oneWeekAgo
    );

    lastWeekData.forEach((data) => {
      const date = new Date(data.Date);
      const dayIndex = date.getDay();
      if (!isNaN(data.Temperature)) {
        weeklyTemperature[dayIndex] += data.Temperature;
      }
    });

    for (let i = 0; i < weeklyTemperature.length; i++) {
      const dayData = lastWeekData.filter(
        (data) => new Date(data.Date).getDay() === i && !isNaN(data.Temperature)
      );
      const dayTemperatureSum = dayData.reduce(
        (sum, data) => sum + data.Temperature,
        0
      );
      const dayTemperatureCount = dayData.length;
      weeklyTemperature[i] = dayTemperatureCount
        ? dayTemperatureSum / dayTemperatureCount
        : 0;
    }

    return weeklyTemperature;
  };

  console.log(calculateWeeklyTemperature());

  // Sample data for the LineChart
  const data = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        data: calculateWeeklyTemperature(), // Assign the calculated value to the first element
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

  // Render custom labels for data points
  const renderCustomLabels = ({ x, y, value }) => {
    return (
      <Text
        key={value}
        style={{
          position: "absolute",
          top: y - 20,
          left: x - 20,
          color: "white",
          fontFamily: "Inter_700Bold",
          fontSize: 14,
          zIndex: 10, // Ensure it's above the chart
        }}
      >
        {value}
      </Text>
    );
  };

  // Handle data point click event
  const handleDataPointClick = (dataPoint, datasetIndex) => {
    setClickedDataPoint({ dataPoint, datasetIndex });
  };

  // DataPointCard component to render small card near clicked data point
  const DataPointCard = ({ x, y, value }) => {
    if (!x || !y) return null;

    return (
      <View
        style={{
          position: "absolute",
          left: x + 8,
          top: y + 110, // Adjust the position as needed
          backgroundColor: "white",
          padding: 8,
          borderRadius: 8,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Text>{value}</Text>
      </View>
    );
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
                {/* <Text style={styles.AverageText}>
                  Average: {averageTemperature} °C
                </Text> */}
              </View>
              <View ref={chartRef}>
                <LineChart
                  data={data}
                  width={360}
                  height={160}
                  chartConfig={chartConfig}
                  yAxisSuffix={" °C"}
                  renderCustomLabels={renderCustomLabels}
                  onDataPointClick={handleDataPointClick}
                />
              </View>
            </BlurView>
          </ScrollView>
        </View>
      </View>
      {clickedDataPoint && (
        <DataPointCard
          x={clickedDataPoint.dataPoint.x}
          y={clickedDataPoint.dataPoint.y}
          value={clickedDataPoint.dataPoint.value}
        />
      )}
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
