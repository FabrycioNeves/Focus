import React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTaskStore } from "../GlobalStates/TaskStore";
import { useNotificationStore } from "../GlobalStates/NotificationsStore";

export default function Notificações() {
  const { tasks } = useTaskStore();
  // Obtém o valor atual de notification1 do Zustand
  const notification1 = useNotificationStore((state) => state.notification1);
  const setNotification1 = useNotificationStore(
    // Função para atualizar notification1 no Zustand
    (state) => state.setNotification1
  );
  // Obtém o valor atual de notification2 do Zustand
  const notification2 = useNotificationStore((state) => state.notification2);
  const setNotification2 = useNotificationStore(
    // Função para atualizar notification2 no Zustand
    (state) => state.setNotification2
  );
  // Função que será chamada ao clicar no botão "Enviar Notificações"
  const handleSendNotifications = () => {
    // Apenas loga no console os valores atuais de notification1 e notification2
    console.log("Notificação 1:", notification1);
    console.log("Notificação 2:", notification2);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Título */}
      <Text style={styles.overlayText}>Notificações personalizadas</Text>

      {/* Inputs personalizados */}
      <View style={styles.holders}>
        <Text style={styles.textoNoti}>Notificação 1:</Text>
        <View style={styles.contInput}>
          <TextInput
            style={styles.inputText}
            placeholder="Crie sua notificação"
            placeholderTextColor="#999"
            value={notification1}
            onChangeText={setNotification1}
          />
        </View>

        <Text style={styles.textoNoti}>Notificação 2:</Text>
        <View style={styles.contInput}>
          <TextInput
            style={styles.inputText}
            placeholder="Crie sua notificação"
            placeholderTextColor="#999"
            value={notification2}
            onChangeText={setNotification2}
          />
        </View>
      </View>

      {/* Botão estilizado */}
      <TouchableOpacity style={styles.button} onPress={handleSendNotifications}>
        <Text style={styles.buttonText}>Enviar Notificações</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },

  overlayText: {
    fontSize: 16,
    marginTop: 25,
    alignSelf: "flex-start",
    marginLeft: "10%",
  },

  holders: {
    marginTop: 15,
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
    ...shadow,
  },

  textoNoti: {
    alignSelf: "flex-start",
    fontSize: 16,
    marginLeft: 10,
    marginTop: 10,
  },

  contInput: {
    marginTop: 10,
    width: "100%",
    height: 50,
    backgroundColor: "#f7f7f7",
    borderRadius: 20,
    justifyContent: "center",
    paddingHorizontal: 15,
  },

  inputText: {
    flex: 1,
    fontSize: 16,
    color: "black",
    paddingVertical: 0,
  },

  button: {
    marginTop: 30,
    backgroundColor: "#50c878",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    ...shadow,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

const shadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 5,
};
