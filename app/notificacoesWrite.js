import React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";

// Stores globais
import { useTaskStore } from "../GlobalStates/TaskStore";
import { useNotificationStore } from "../GlobalStates/NotificationsStore";

export default function NotificacoesWrite() {
  const { tasks } = useTaskStore();

  const notification1 = useNotificationStore((state) => state.notification1);
  const notification2 = useNotificationStore((state) => state.notification2);
  const setNotification1 = useNotificationStore(
    (state) => state.setNotification1
  );
  const setNotification2 = useNotificationStore(
    (state) => state.setNotification2
  );

  return (
    <View style={styles.container}>
      <Text style={styles.overlayText}>Notificações personalizadas</Text>

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

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          console.log("Notificação 1:", notification1);
          console.log("Notificação 2:", notification2);
          console.log("Tarefas atuais:", tasks);
        }}
      >
        <Text style={styles.buttonText}>Enviar Notificações</Text>
      </TouchableOpacity>
    </View>
  );
}

const shadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  android: {
    elevation: 5,
  },
});

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
    marginTop: 65,
    alignSelf: "flex-start",
    marginLeft: 5,
  },
  holders: {
    marginTop: 15,
    width: "100%",
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
    paddingVertical: Platform.OS === "ios" ? 10 : 5,
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
