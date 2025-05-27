import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Switch,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTaskGlobalStore } from "../../settingsNotifications/GlobalSatesNoti/TaskStore";
import { useWriteonStore } from "../../settingsNotifications/GlobalSatesNoti/NotificationStore";

export default function Notificações() {
  const [notiPadrao, setnotiPadrao] = useState(false);
  const [notificacao1, setNotificacao1] = useState("");
  const [notificacao2, setNotificacao2] = useState("");
  const [alarmeAtivado, setalarmeAtivado] = useState(false);

  const { taskGlobal } = useTaskGlobalStore.getState();
  const setWriteNoti = useWriteonStore((state) => state.setWriteNoti);

  return (
    <SafeAreaView style={styles.container}>
      {/* Notificação padrão */}
      <View style={styles.padrao}>
        <Text style={styles.text}>Notificação padrão: {taskGlobal}</Text>
        <Switch
          style={styles.swt}
          value={notiPadrao}
          onValueChange={setnotiPadrao}
          trackColor={{ false: "#121212", true: "#00ff00" }}
        />
      </View>

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
            value={notificacao1}
            onChangeText={setNotificacao1}
          />
        </View>

        <Text style={styles.textoNoti}>Notificação 2:</Text>
        <View style={styles.contInput}>
          <TextInput
            style={styles.inputText}
            placeholder="Crie sua notificação"
            placeholderTextColor="#999"
            value={notificacao2}
            onChangeText={setNotificacao2}
          />
        </View>
      </View>

      {/* Alarme */}
      <View style={styles.alarme}>
        <Text style={styles.text}>Ativar alarme</Text>
        <Switch
          style={styles.swt}
          value={alarmeAtivado}
          onValueChange={setalarmeAtivado}
          trackColor={{ false: "#121212", true: "#00ff00" }}
        />
        <Button
          onPress={() => {
            setWriteNoti(notificacao1);
          }}
          title="enviar"
        />
      </View>
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

  padrao: {
    backgroundColor: "#fff",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    height: 50,
    width: "80%",
    borderRadius: 10,
    paddingHorizontal: 10,
    ...shadow,
  },

  text: {
    fontSize: 16,
  },

  swt: {
    marginLeft: 10,
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

  alarme: {
    marginTop: 20,
    width: "60%",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: 50,
    borderRadius: 10,
    ...shadow,
  },
});

const shadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
};
