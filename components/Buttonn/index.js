import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function Buttonn({ onPress }) {
  return (
    <TouchableOpacity style={styles.ButtonContainer} onPress={onPress}>
      <MaterialIcons name="add" size={40} color="#fff" />
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  ButtonContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    bottom: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#50c878",
    zIndex: 1,
  },
});
