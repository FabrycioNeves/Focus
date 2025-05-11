import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";
import ModalCalendarPicker from "./modalCalendar";

export default function NotiTime() {
  const [repeticoes, setRepeticoes] = useState("none");
  const [repeticoesModalVisible, setRepeticoesModalVisible] = useState(false);

  const [selectedDate, setSelectedDate] = useState("");
  const [dateModalVisible, setDateModalVisible] = useState(false);

  const handlePickerChange = (itemValue) => {
    setRepeticoes(itemValue);
    setRepeticoesModalVisible(false); // fecha o modal depois de escolher
  };

  // ✅ Função reutilizável para exibir o texto da repetição no ios
  const getRepeticaoLabel = (valor) => {
    switch (valor) {
      case "daily":
        return "Diariamente";
      case "weekly":
        return "Semanalmente";
      case "monthly":
        return "Mensalmente";
      case "none":
      default:
        return "Selecionar";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.ContForm}>
        <Text style={styles.questText}>Definir data:</Text>

        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => setDateModalVisible(true)}
        >
          <Text style={styles.placeholderText}>
            {selectedDate ? selectedDate : "Selecione a data"}
          </Text>
          <MaterialIcons name="calendar-today" size={24} color="#a1a1a1" />
        </TouchableOpacity>

        <Text style={styles.questText}>Definir hora:</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.placeholderText}>Selecione a hora</Text>
          <MaterialIcons name="access-time" size={24} color="#a1a1a1" />
        </View>

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
                  >
                    <Picker.Item label="Não repetir" value="none" />
                    <Picker.Item label="Diariamente" value="daily" />
                    <Picker.Item label="Semanalmente" value="weekly" />
                    <Picker.Item label="Mensalmente" value="monthly" />
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
              onValueChange={setRepeticoes}
              dropdownIconColor="#000"
            >
              <Picker.Item label="Não repetir" value="none" />
              <Picker.Item label="Diariamente" value="daily" />
              <Picker.Item label="Semanalmente" value="weekly" />
              <Picker.Item label="Mensalmente" value="monthly" />
            </Picker>
          </View>
        )}
      </View>

      {/* MODAL DE CALENDÁRIO */}
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
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  ContForm: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 5,
  },
  questText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: "#a1a1a1",
  },
  pickerContainer: {
    backgroundColor: "#f3f3f3",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
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
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
