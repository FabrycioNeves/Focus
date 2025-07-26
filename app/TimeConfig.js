import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTimerConfigStore } from "../GlobalStates/PomodoroStore";

export default function TimeConfig() {
  const { taskId } = useLocalSearchParams();
  const id = taskId.toString();

  // Get current values
  const timer = useTimerConfigStore((s) => s.configs[id]?.timerMinutes || 0);
  const pause = useTimerConfigStore((s) => s.configs[id]?.breakMinutes || 0);
  const reps = useTimerConfigStore((s) => s.configs[id]?.repetitions || 0);

  // Get setter functions
  const setTimerMinutes = useTimerConfigStore((s) => s.setTimerMinutes);
  const setBreakMinutes = useTimerConfigStore((s) => s.setBreakMinutes);
  const setRepetitions = useTimerConfigStore((s) => s.setRepetitions);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const getOptionsForType = (type) => {
    if (type === "timer") {
      return Array.from({ length: 36 }, (_, i) => (i + 1) * 5); // 5 a 180
    } else if (type === "pause") {
      return Array.from({ length: 60 }, (_, i) => i + 1); // 1 a 60
    } else if (type === "reps") {
      return Array.from({ length: 20 }, (_, i) => i + 1); // 1 a 20
    }
    return [];
  };

  const openModal = (type) => {
    setSelectedType(type);
    setModalVisible(true);
  };

  const handleSelect = (value) => {
    if (selectedType === "timer") {
      setTimerMinutes(id, value);
    } else if (selectedType === "pause") {
      setBreakMinutes(id, value);
    } else if (selectedType === "reps") {
      setRepetitions(id, value);
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurar Timer</Text>

      <View style={styles.holder}>
        <TouchableOpacity
          onPress={() => openModal("timer")}
          style={styles.button}
        >
          <Text style={styles.text}>Tempo da tarefa: {timer} min</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => openModal("pause")}
          style={styles.button}
        >
          <Text style={styles.text}>Tempo de pausa: {pause} min</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => openModal("reps")}
          style={styles.button}
        >
          <Text style={styles.text}>Repetições: {reps}x</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={getOptionsForType(selectedType)}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  style={styles.option}
                >
                  <Text style={styles.optionText}>
                    {item} {selectedType === "reps" ? "x" : "minutos"}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    alignItems: "center",
    paddingTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    marginTop: 40,
  },
  holder: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    elevation: 4,
  },
  button: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  text: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "white",
    marginHorizontal: 40,
    borderRadius: 10,
    maxHeight: 300,
    paddingVertical: 10,
  },
  option: {
    paddingVertical: 12,
    alignItems: "center",
  },
  optionText: {
    fontSize: 18,
  },
});
