import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function SettingsUser({ onPress }) {
  return (
    <TouchableOpacity style={styles.SettingsContainer} onPress={onPress}>
      <MaterialIcons name="settings" size={40} color="#808080" />
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  SettingsContainer: {
    position: "absolute",
    top: 20, // distância do topo
    left: 20, // distância da esquerda
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 200,
  },
});
