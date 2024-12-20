import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Modal,
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
  FontAwesome5,
} from "@expo/vector-icons";
import { ScaledSheet } from "react-native-size-matters";
import {
  ref,
  onValue,
  off,
  onChildAdded,
  onChildChanged,
} from "firebase/database";
import { db } from "../config";

export default function Home() {
  const [sensorData, setSensorData] = useState(null);
  const [Light, setLight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      const sensorsRef = ref(db, "SensorData");
      const LightRef = ref(db, "Light");

      onChildChanged(sensorsRef, (snapshot) => {
        const newData = snapshot.val();
        setSensorData(newData);
      });

      onValue(LightRef, (snapshot) => {
        const data = snapshot.val();
        if (data && typeof data === "object" && "Level" in data) {
          setLight(data.Level);
        }
        setLoading(false);
      });
    };

    fetchData();

    return () => {
      off(ref(db, "SensorData"));
      off(ref(db, "Light"));
    };
  }, []);

  let temperature, pH, turbidity, tds;

  if (sensorData) {
    temperature =
      sensorData.Temperature !== undefined
        ? sensorData.Temperature.toFixed(1)
        : "0.0";
    pH = sensorData.pH !== undefined ? sensorData.pH.toFixed(1) : "0.0";
    turbidity =
      sensorData.Turbidity !== undefined
        ? sensorData.Turbidity.toFixed(1)
        : "0.0";
    tds = sensorData.TDS !== undefined ? sensorData.TDS.toFixed(1) : "0.0";

    // Check if temperature is greater than 35
  }

  useEffect(() => {
    // Check if temperature is greater than 35
    if (parseFloat(temperature) > 40) {
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  }, [temperature]); // Only re-run this effect if temperature changes

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
                {loading ? (
                  <ActivityIndicator size="medium" color="#fff" />
                ) : (
                  <>
                    <Text style={styles.ValueText}>{temperature}°C</Text>
                  </>
                )}
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
                <Text style={styles.NameText}>Darkness</Text>
                {loading ? (
                  <ActivityIndicator size="medium" color="#fff" />
                ) : (
                  <>
                    <Text style={styles.ValueText}>{Light}%</Text>
                  </>
                )}
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
                  {loading ? (
                    <ActivityIndicator size="medium" color="#fff" />
                  ) : (
                    <>
                      <Text style={styles.ValueText}>{pH}</Text>
                    </>
                  )}
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
                  {loading ? (
                    <ActivityIndicator size="medium" color="#fff" />
                  ) : (
                    <>
                      <Text style={styles.ValueText}>{turbidity} NTU</Text>
                    </>
                  )}
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
                <Text style={styles.NameTextBottom}>TDS</Text>
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Text style={styles.ValueTextBottom}>{tds} ppm</Text>
                  </>
                )}
              </View>
            </BlurView>
          </View>
        </View>
      </View>

      {/* Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={styles.centeredView}
          onTouchEnd={() => setModalVisible(!modalVisible)}
        >
          <View style={styles.modalView}>
            {/* <FontAwesome5 name="car-crash" size={30} color="#ff5866" /> */}
            <FontAwesome5 name="temperature-high" size={24} color="#ff5866" />
            <Text style={styles.Text}>Temperature is High</Text>
          </View>
        </View>
      </Modal>
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
    marginTop: 10,
    color: "white",
    fontFamily: "Inter_500Medium",
    fontSize: "25@mvs",
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalView: {
    flexDirection: "row",
    height: "10%",
    width: "80%",
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "space-evenly",
  },

  Text: {
    fontSize: "25@mvs",
    fontFamily: "Inter_500Medium",
    color: "#595959",
  },
});
