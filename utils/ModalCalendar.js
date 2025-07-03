import { Feather } from "@expo/vector-icons";
import React from "react";
import { View, Modal, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { ptBr } from "./LocaleCalendarConfig";

LocaleConfig.locales["pt-br"] = ptBr;
LocaleConfig.defaultLocale = "pt-br";

export default function ModalCalendarPicker({
  visible,
  onClose,
  selectedDate,
  setSelectDate,
}) {
  const handleDayPress = (day) => {
    const [year, month, dayNum] = day.dateString.split("-").map(Number); //Convertendo strings para numeros
    const selected = new Date(year, month - 1, dayNum); //passando em formato date
    setSelectDate(selected);
    console.log("dia selecionado:", selected);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Calendar
            renderArrow={(direction) => (
              <Feather
                size={24}
                color="#50c878"
                name={`chevron-${direction}`}
              />
            )}
            onDayPress={handleDayPress}
            markedDates={{
              [selectedDate?.toISOString().split("T")[0]]: {
                selected: true,
                selectedColor: "#50c878",
              },
            }}
            theme={{
              selectedDayBackgroundColor: "#50c878",
              todayTextColor: "#50c878",
              arrowColor: "#50c878",
              textDisabledColor: "#9e9e9e",
              arrowStyle: {
                padding: 0,
                margin: 0,
              },
            }}
          />

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#50c878",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
