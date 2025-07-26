import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Buttonn from "../Buttonn";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { scheduleNotification } from "../../ExpoNotifications/ConfigNotifications";
import { useNotificationStore } from "../../GlobalStates/NotificationsStore";
import { useTaskStore } from "../../GlobalStates/TaskStore";
import { useDateStore } from "../../GlobalStates/DateStore";
import { salvarTudo } from "../../firebase/firestore/saveAllZustandData";
import { getAuth } from "firebase/auth";

const { height } = Dimensions.get("window");

export default function InStyles({ Abrir, setVisible, visible, fechar }) {
  const [task, setTask] = useState("");
  const router = useRouter();

  const addTask = useTaskStore((state) => state.addTask);
  const nextId = useTaskStore((state) => state.nextId); // pega o id que será usado na próxima task

  const setNotification1 = useNotificationStore(
    (state) => state.setNotification1
  );
  const setNotification2 = useNotificationStore(
    (state) => state.setNotification2
  );

  const sendTask = async () => {
    if (!task.trim()) return;

    addTask(task, finalDateTime);

    const tasks = useTaskStore.getState().tasks;
    const latestTask = tasks[tasks.length - 1];
    const finalDateTime = useDateStore.getState().finalDateTime;

    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      await salvarTudo(user.uid);
    } else {
      console.warn("Usuário não autenticado, salvamento ignorado");
    }

    if (!finalDateTime) {
      console.warn("finalDateTime não definido");
      return;
    }

    try {
      await scheduleNotification(latestTask); // 🔔 agendamento restaurado aqui
      console.log("✅ Notificação agendada para:", finalDateTime.toString());
    } catch (error) {
      console.error("❌ Erro ao agendar notificação:", error);
    }

    setNotification1("");
    setNotification2("");
    setVisible(false);
    setTask("");
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      {visible && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.InputContainer}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
              <TextInput
                style={styles.inputText}
                autoFocus={true}
                value={task}
                onChangeText={setTask}
                placeholder="Digite aqui"
                textAlignVertical="top"
                multiline={true}
              />
              <View style={styles.iconc}>
                <MaterialIcons
                  name="notifications"
                  size={35}
                  color={"#50c878"}
                  onPress={() => router.push("NotificacoesWrite")}
                />

                <MaterialIcons
                  name="schedule"
                  size={35}
                  color={"#50c878"}
                  onPress={() => router.push("notificacoes")}
                />
                <MaterialIcons
                  name="schedule"
                  size={35}
                  color={"#50c878"}
                  onPress={() => router.push("auth/login")}
                />
                <MaterialIcons
                  name="timelapse"
                  size={35}
                  color={"#50c878"}
                  onPress={() =>
                    router.push({
                      pathname: "TimeConfig",
                      params: { taskId: nextId.toString() },
                    })
                  }
                />
                <MaterialIcons
                  name="check"
                  size={35}
                  color={"#50c878"}
                  onPress={sendTask}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      )}
      <Buttonn onPress={Abrir} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  InputContainer: {
    height: Platform.OS === "ios" ? height * 0.3 : height * 0.4,
    width: "100%",
    backgroundColor: "#f1f1f1",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 102,
  },
  inputText: {
    padding: 15,
    margin: 12,
    flex: 1,
    textAlignVertical: "top",
  },
  iconc: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    height: Platform.OS === "ios" ? height * 0.06 : height * 0.09, //ajeitar e testar em celulares grandesss
    left: 0,
    bottom: 0,
    paddingRight: 10,
  },
});
