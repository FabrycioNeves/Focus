import React from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const Lista = React.memo(function Lista({ tasks }) {
  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={tasks}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{ paddingTop: 30 }}
        renderItem={({ item }) => {
          console.log("Item atual:", item); // Debug para ver se está renderizando corretamente
          return (
            <View style={styles.Tas}>
              <Text
                style={styles.taskText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.text}
              </Text>
              <MaterialIcons name="play-arrow" size={35} color={"#50c878"} />
            </View>
          );
        }}
      />
    </View>
  );
});

export default Lista;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  Tas: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#eee",
    padding: 20,
    marginVertical: 5,
    borderRadius: 10,
    marginTop: 30,
    width: 300,
  },
  taskText: {
    flex: 1,
    marginRight: 10,
    fontSize: 16,
  },
});
