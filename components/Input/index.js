import React, { useState, useEffect } from "react";
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
import { useTaskGlobalStore } from "../../settingsNotifications/GlobalSatesNoti/TaskStore";

const { height } = Dimensions.get("window");

export default function InStyles({
  handleAddTask,
  Abrir,
  setVisible,
  visible,
}) {
  const [task, setTask] = useState("");
  const router = useRouter();

  const setTaskGlobal = useTaskGlobalStore((state) => state.setTaskGlobal);

  const sendTask = () => {
    if (task.trim()) {
      handleAddTask(task);
      setTaskGlobal(task);
      setVisible(false);
      setTask("");
    }
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
                  onPress={() => router.push("notificacoesWrite")}
                />
                <MaterialIcons
                  name="schedule"
                  size={35}
                  color={"#50c878"}
                  onPress={() => router.push("notificacoes")}
                />
                <MaterialIcons name="timelapse" size={35} color={"#50c878"} />
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
    height: Platform.OS === "ios" ? height * 0.07 : height * 0.09,
    left: 0,
    bottom: 0,
    paddingRight: 10,
  },
});
