import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

import ModalCalendarPicker from "../utils/ModalCalendar";
import { useDateStore } from "../GlobalStates/DateStore";
import { useRepetitionStore } from "../GlobalStates/RepetionsStore";
import { Platform } from "react-native";

export default function NotiTime() {
  const setFinalDateTime = useDateStore((state) => state.setFinalDateTime);
  const setRepetition = useRepetitionStore((state) => state.setRepetition);

  const [repeticoes, setRepeticoes] = useState("none");
  const [repeticoesModalVisible, setRepeticoesModalVisible] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [dateModalVisible, setDateModalVisible] = useState(false);

  const [selectedTime, setSelectedTime] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handlePickerChange = (itemValue) => {
    setRepeticoes(itemValue);
    setRepetition(itemValue);
    console.log(itemValue); // Salva no Zustand global
    setRepeticoesModalVisible(false);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    if (!date) return "Selecione a data";
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getRepeticaoLabel = (valor) => {
    switch (valor) {
      case "daily":
        return "Diariamente";
      case "weekly":
        return "Semanalmente";
      case "none":
      default:
        return "Selecionar";
    }
  };

  const combineDateAndTime = (date, time) => {
    if (!date || !time) return null;
    const combined = new Date(date);
    combined.setHours(time.getHours());
    combined.setMinutes(time.getMinutes());
    combined.setSeconds(0);
    combined.setMilliseconds(0);
    return combined;
  };

  const onTimeChange = (event, time) => {
    if (time) setSelectedTime(time);
    if (Platform.OS === "android") {
      setShowTimePicker(false);
    }
  };

  const handleScheduleNotification = () => {
    const finalDateTime = combineDateAndTime(selectedDate, selectedTime);
    if (!finalDateTime || finalDateTime <= new Date()) {
      Alert.alert("Atenção", "Selecione uma data e hora válidas no futuro.");
      return;
    }
    setFinalDateTime(finalDateTime);
    Alert.alert("Sucesso", "Notificação agendada com sucesso!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.ContForm}>
        <Text style={styles.questText}>Definir data:</Text>
        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => setDateModalVisible(true)}
        >
          <Text style={styles.placeholderText}>{formatDate(selectedDate)}</Text>
          <MaterialIcons name="calendar-today" size={24} color="#a1a1a1" />
        </TouchableOpacity>

        <Text style={styles.questText}>Definir hora:</Text>
        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.placeholderText}>
            {selectedTime ? formatTime(selectedTime) : "Selecione a hora"}
          </Text>
          <MaterialIcons name="access-time" size={24} color="#a1a1a1" />
        </TouchableOpacity>

        {showTimePicker && Platform.OS === "android" && (
          <DateTimePicker
            value={selectedTime || new Date()}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onTimeChange}
          />
        )}

        <Modal
          visible={showTimePicker && Platform.OS === "ios"}
          transparent
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <DateTimePicker
                value={selectedTime || new Date()}
                mode="time"
                is24Hour={true}
                display="spinner"
                onChange={(event, time) => time && setSelectedTime(time)}
                themeVariant="light"
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowTimePicker(false)}
              >
                <Text style={styles.closeButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Text style={styles.questText}>Definir repetições:</Text>

        {Platform.OS === "ios" ? (
          <>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => setRepeticoesModalVisible(true)}
            >
              <Text style={styles.placeholderText}>
                {getRepeticaoLabel(repeticoes)}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="#a1a1a1" />
            </TouchableOpacity>

            <Modal
              visible={repeticoesModalVisible}
              transparent
              animationType="slide"
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Picker
                    selectedValue={repeticoes}
                    onValueChange={handlePickerChange}
                    themeVariant="light"
                  >
                    <Picker.Item label="Não repetir" value="none" />
                    <Picker.Item label="Diariamente" value="daily" />
                    <Picker.Item label="Semanalmente" value="weekly" />
                  </Picker>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setRepeticoesModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>Fechar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </>
        ) : (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={repeticoes}
              onValueChange={(itemValue) => {
                setRepeticoes(itemValue);
                setRepetition(itemValue); // Android também atualiza global
              }}
              dropdownIconColor="#000"
            >
              <Picker.Item label="Não repetir" value="none" />
              <Picker.Item label="Diariamente" value="daily" />
              <Picker.Item label="Semanalmente" value="weekly" />
            </Picker>
          </View>
        )}

        <TouchableOpacity
          style={[styles.closeButton, { marginTop: 10 }]}
          onPress={handleScheduleNotification}
        >
          <Text style={styles.closeButtonText}>Agendar Notificação</Text>
        </TouchableOpacity>
      </View>

      <ModalCalendarPicker
        visible={dateModalVisible}
        onClose={() => setDateModalVisible(false)}
        selectedDate={selectedDate}
        setSelectDate={setSelectedDate}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 20 },
  ContForm: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    marginTop: 10,
  },
  questText: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f3f3f3",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
    alignItems: "center",
  },
  placeholderText: { fontSize: 16, color: "#a1a1a1" },
  pickerContainer: {
    backgroundColor: "#f3f3f3",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "80%",
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: { color: "#fff", fontSize: 16 },
});
