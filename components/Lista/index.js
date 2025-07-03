import React from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTaskStore } from "../../GlobalStates/TaskStore";
import { useRouter } from "expo-router";
import { Swipeable } from "react-native-gesture-handler";

// Memoiza o componente para evitar re-renders desnecessários
// Isso é útil porque o input (InStyles) muda com frequência,
// mas a lista de tarefas só precisa renderizar quando as tasks mudam.
const Lista = React.memo(function Lista() {
  const tasks = useTaskStore((state) => state.tasks);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const router = useRouter();

  // Cria o botão de "Excluir" que aparece ao deslizar a tarefa para o lado
  const renderRightActions = (progress, dragX, itemId) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <TouchableOpacity
        onPress={() => deleteTask(itemId)}
        style={styles.deleteButton}
      >
        <Animated.Text style={[styles.deleteText, { transform: [{ scale }] }]}>
          Excluir
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={[...tasks].reverse()}
        keyExtractor={(item) => item.id.toString()}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 50 }}
        renderItem={({ item }) => (
          // Adiciona gesto de deslizar para excluir usando Swipeable
          <Swipeable
            renderRightActions={(progress, dragX) =>
              renderRightActions(progress, dragX, item.id)
            }
          >
            <View style={styles.Tas}>
              <Text
                style={styles.taskText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.text}
              </Text>
              <MaterialIcons
                name="play-arrow"
                size={35}
                color={"#50c878"}
                onPress={() =>
                  // Ao clicar, navega para TimerScreen (route "/time") passando taskId como parâmetro
                  router.push({
                    pathname: "/time",
                    params: { taskId: item.id.toString() },
                  })
                }
              />
            </View>
          </Swipeable>
        )}
      />
    </View>
  );
});

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
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 15,
    borderRadius: 12,
    width: "90%",
  },
  taskText: {
    flex: 1,
    marginRight: 10,
    fontSize: 16,
    color: "#333",
  },
  deleteButton: {
    backgroundColor: "#ff4d4f",
    justifyContent: "center",
    alignItems: "flex-end",
    borderRadius: 12,
    marginVertical: 15,
    paddingHorizontal: 20,
    width: 100,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Lista;
