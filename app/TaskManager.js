import React, { useState } from "react";
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
import SideDrawer from "../components/SideDrawer/SideDrawer";

import { auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";

export default function Taskmanager() {
  const [visible, setVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const router = useRouter(); // redirecionamento

  function Abrir() {
    setVisible(true);
  }

  function fechar() {
    setVisible(false);
    Keyboard.dismiss();
  }

  function abrirDrawer() {
    setDrawerVisible(true);
  }

  function fecharDrawer() {
    setDrawerVisible(false);
  }

  async function encerrarSessao() {
    try {
      await signOut(auth);
      console.log("✅ Usuário deslogado com sucesso.");
      fecharDrawer();
      router.push("auth/login"); // redireciona para a tela de login
    } catch (error) {
      console.error("❌ Erro ao fazer logout:", error);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <SettingsUser onPress={abrirDrawer} />

          {/* Overlay atrás do drawer: fecha ao tocar fora */}
          {drawerVisible && (
            <TouchableWithoutFeedback onPress={fecharDrawer}>
              <View style={styles.drawerOverlay} />
            </TouchableWithoutFeedback>
          )}

          {/* Drawer visível */}
          <SideDrawer
            visible={drawerVisible}
            onClose={fecharDrawer}
            onLogout={encerrarSessao}
          />

          {/* Overlay do modal/input */}
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
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 10,
  },
  drawerOverlay: {
    position: "absolute",
    top: 0,
    left: "70%",
    width: "30%",
    height: "100%",
    zIndex: 14,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
});
