import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_300Light,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { BlurView } from "expo-blur";
import { ScaledSheet } from "react-native-size-matters";
import ProgressBar from "react-native-progress/Bar";
import { ref, onValue, set } from "firebase/database";
import { db } from "../config";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Feeder() {
  const [status, setStatus] = useState(true);
  const [turnontime, setturnontime] = useState(true);
  const [Food, setFood] = useState(true);
  const [counter, setcounter] = useState(true);

  const [text, setText] = useState("");
  const [text2, setText2] = useState("");
  const [buttonPressed, setButtonPressed] = useState(false);

  useEffect(() => {
    const statusRef = ref(db, "delays");
    const turnontimeRef = ref(db, "delays");
    const FoodRef = ref(db, "Food");
    const counterRef = ref(db, "count");

    onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      if (data && typeof data === "object" && "status" in data) {
        setStatus(data.status);
      }
    });

    onValue(turnontimeRef, (snapshot) => {
      const data = snapshot.val();
      if (data && typeof data === "object" && "turnontime" in data) {
        setturnontime(data.turnontime);
      }
    });

    onValue(counterRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setcounter(data);
      }
    });

    onValue(FoodRef, (snapshot) => {
      const data = snapshot.val();
      if (data && typeof data === "object" && "Level" in data) {
        setFood(data.Level);
      }
    });
  }, []);

  const handlePressIn = () => {
    // Set buttonPressed to true when pressed
    setButtonPressed(true);
    // Update the database with the pressed value
    set(ref(db, "delays/button"), 1);
    set(ref(db, "delays/status"), 1);
    set(ref(db, "delays/timer"), 0);
    set(ref(db, "count"), 0);
    set(ref(db, "delays/turnontime"), 0);
    setText("");
    setText2("");
    setcounter("0");
  };

  const handlePressOut = () => {
    setButtonPressed(false);
    set(ref(db, "delays/button"), 0);
    set(ref(db, "delays/status"), 0);
  };

  const handleTextChange = (value) => {
    const numericValue = parseFloat(value);

    if (!isNaN(numericValue)) {
      setText(value);

      set(ref(db, "delays/timer"), numericValue);
      // set(ref(db, "delays/status"), 1);
    } else {
      setText("");

      set(ref(db, "delays/timer"), 0);
      // set(ref(db, "delays/status"), 0);
    }
  };

  const handleTextChange2 = (value) => {
    const numericValue = parseFloat(value);

    if (!isNaN(numericValue)) {
      setText2(value);

      set(ref(db, "delays/turnontime"), numericValue);
    } else {
      setText2("");

      set(ref(db, "delays/turnontime"), 0);
    }
  };

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
          <Text style={styles.HeaderText}>Fish Feeder</Text>
        </View>
        <View style={styles.Middle}>
          <BlurView
            experimentalBlurMethod="dimezisBlurView"
            intensity={50}
            tint="default"
            style={styles.Box}
          >
            <View style={styles.Box2}>
              <Text style={styles.NameTextMiddle}>Fish Feeder Status</Text>
              <Text style={styles.ValueTextMiddle}>
                {status ? "ON" : "OFF"}
              </Text>
            </View>
          </BlurView>
        </View>
        <View style={styles.Bottom}>
          <View style={styles.BottomLeft}>
            <BlurView
              experimentalBlurMethod="dimezisBlurView"
              intensity={50}
              tint="default"
              style={styles.BoxBottom}
            >
              <View style={styles.Box1}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name="camera-timer"
                    size={20}
                    color="#fff"
                  />
                  <Text style={[styles.NameText, { marginLeft: 10 }]}>
                    {counter}
                  </Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Timer"
                  color="#fff"
                  placeholderTextColor="#fff"
                  onChangeText={handleTextChange}
                  value={text}
                  keyboardType="numeric"
                />
              </View>
            </BlurView>

            <BlurView
              experimentalBlurMethod="dimezisBlurView"
              intensity={50}
              tint="default"
              style={styles.BoxBottom}
            >
              <View style={styles.Box1}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name="timer-settings-outline"
                    size={24}
                    color="#fff"
                  />
                  <Text style={[styles.NameText, { marginLeft: 10 }]}>
                    {turnontime}
                  </Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter On time"
                  color="#fff"
                  placeholderTextColor="#fff"
                  onChangeText={handleTextChange2}
                  value={text2}
                  keyboardType="numeric"
                />
              </View>
            </BlurView>

            <BlurView
              experimentalBlurMethod="dimezisBlurView"
              intensity={50}
              tint="default"
              style={styles.BoxBottom2}
            >
              <TouchableOpacity
                style={{
                  height: 100,
                  width: 200,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPressIn={handlePressIn} // Called when pressed
                onPressOut={handlePressOut} // Called when released
              >
                <View style={styles.Box1}>
                  <Text style={styles.NameText}>Feeder On</Text>
                </View>
              </TouchableOpacity>
            </BlurView>
          </View>
          <View style={styles.BottomRight}>
            <BlurView
              experimentalBlurMethod="dimezisBlurView"
              intensity={50}
              tint="default"
              style={styles.BoxBottomFood}
            >
              <View style={styles.Box1}>
                <View style={styles.progressBar}>
                  <ProgressBar
                    progress={1 - Food / 15} // Subtract progress value from
                    width={380}
                    height={30}
                    color={"#fff"}
                  />
                </View>
                <Text style={styles.NameText}>Food</Text>
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
    flex: 0.2,

    justifyContent: "center",
    alignItems: "center",
  },

  Box: {
    width: "80%",
    height: "50%",
    overflow: "hidden",
    borderRadius: 10,
    borderColor: "#fff",
    borderWidth: 1,
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

  Box1: {
    alignItems: "center",
    alignContent: "center",
  },

  NameTextMiddle: {
    color: "white",
    fontFamily: "Inter_400Regular",
    fontSize: "20@mvs",
  },
  ValueTextMiddle: {
    color: "white",
    fontFamily: "Inter_500Medium",
    fontSize: "20@mvs",
  },

  Bottom: {
    flex: 1,
    flexDirection: "row",
  },

  BottomLeft: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  BottomRight: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  BoxBottom: {
    width: "70%",
    height: "20%",
    overflow: "hidden",
    borderRadius: 10,
    borderColor: "#fff",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  BoxBottom2: {
    width: "70%",
    height: "10%",
    overflow: "hidden",
    borderRadius: 10,
    borderColor: "#fff",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  NameText: {
    color: "white",
    fontFamily: "Inter_400Regular",
    fontSize: "20@mvs",
  },
  ValueText: {
    color: "white",
    fontFamily: "Inter_500Medium",
    fontSize: "20@mvs",
  },
  input: {
    height: 30,
    width: "100%",
    borderColor: "transparent",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginTop: 10,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 10,
  },

  BoxBottomFood: {
    width: "50%",
    height: "80%",
    overflow: "hidden",
    borderRadius: 10,
    borderColor: "#fff",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  progressBar: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "270deg" }], // Rotate the container by 90 degrees
    height: "90%", // Adjust container height to fit the rotated progress bar
    width: 20, // Adjust container width to fit the rotated progress bar
  },
});
