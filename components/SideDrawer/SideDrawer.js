import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Animated, { SlideInLeft, SlideOutLeft } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function SideDrawer({ visible, onClose, onLogout }) {
  if (!visible) return null;

  return (
    <Animated.View
      entering={SlideInLeft}
      exiting={SlideOutLeft}
      style={styles.drawerContainer}
    >
      <View style={styles.drawer}>
        <Text style={styles.title}>Configurações</Text>

        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutText}>Encerrar Sessão</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width * 0.7,
    height: "100%",
    backgroundColor: "#fff",
    zIndex: 50,
    elevation: 5,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  drawer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginTop: 10,
  },
  logoutBtn: {
    marginTop: 30,
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 6,
    marginBottom: 40,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
