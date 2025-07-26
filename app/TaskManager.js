import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import InStyles from "../components/Input";
import Lista from "../components/Lista";
import SettingsUser from "../components/settings";
import { auth } from "../firebase/firebaseConfig";

export default function Taskmanager() {
  const [visible, setVisible] = useState(false);

  function Abrir() {
    setVisible(true);
  }

  function fechar() {
    setVisible(false);
    Keyboard.dismiss();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <SettingsUser onPress={() => console.log("Botão pressionado")} />
          {visible && (
            <TouchableWithoutFeedback onPress={fechar}>
              <View style={styles.overlay} />
            </TouchableWithoutFeedback>
          )}
          <Lista />
          <InStyles
            fechar={fechar}
            Abrir={Abrir}
            setVisible={setVisible}
            visible={visible}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 10,
  },
});
