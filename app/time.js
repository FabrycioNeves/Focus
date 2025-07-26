import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useTaskStore } from "../GlobalStates/TaskStore";
import { useTimerConfigStore } from "../GlobalStates/PomodoroStore";
import { Asset } from "expo-asset";
import { useLocalSearchParams } from "expo-router";

export default function TimerScreen() {
  const { taskId } = useLocalSearchParams();
  const id = parseInt(taskId); // Para buscar a tarefa (TaskStore)
  const configKey = taskId.toString(); // Para acessar o store do Pomodoro

  const task = useTaskStore((s) => s.tasks.find((t) => t.id === id));
  const toggleTask = useTaskStore((s) => s.toggleTask);
  const config = useTimerConfigStore((s) => s.configs[configKey]);

  const timerMinutes = Number(config?.timerMinutes ?? 10);
  const breakMinutes = Number(config?.breakMinutes ?? 5);
  const repetitions = Number(config?.repetitions ?? 3);

  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(timerMinutes * 60);
  const [isBreak, setIsBreak] = useState(false);
  const [remainingReps, setRemainingReps] = useState(repetitions);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    Asset.loadAsync(require("../assets/ampulheta.png")).then(() =>
      setIsImageLoaded(true)
    );
  }, []);

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);

            if (!isBreak) {
              if (remainingReps > 1) {
                setRemainingReps((r) => r - 1);
                setIsBreak(true);
                setSecondsLeft(breakMinutes * 60);
              } else {
                handleComplete(); // terminou tudo
              }
            } else {
              setIsBreak(false);
              setSecondsLeft(timerMinutes * 60);
            }

            return 0;
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStartPause = () => setIsRunning((prev) => !prev);

  const handleComplete = () => {
    setIsRunning(false);
    setSecondsLeft(timerMinutes * 60);
    setRemainingReps(repetitions);
    setIsBreak(false);
    toggleTask(task.id); // Marca como concluída
  };

  const handleSkip = () => {
    if (!isBreak && remainingReps > 1) {
      setRemainingReps((prev) => prev - 1);
    }

    setIsBreak((prev) => !prev);
    setSecondsLeft(isBreak ? timerMinutes * 60 : breakMinutes * 60);
  };

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  if (!task)
    return (
      <View style={styles.container}>
        <Text>Tarefa não encontrada.</Text>
      </View>
    );

  if (!isImageLoaded)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );

  return (
    <View style={styles.container}>
      <Image source={require("../assets/ampulheta.png")} style={styles.image} />
      <Text style={styles.timer}>{formatTime(secondsLeft)}</Text>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        {isBreak ? "Pausa" : "Tarefa"} • Repetições restantes: {remainingReps}
      </Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            isRunning ? styles.buttonPause : styles.buttonStart,
          ]}
          onPress={handleStartPause}
        >
          <Text
            style={[
              styles.buttonText,
              isRunning ? styles.pauseText : styles.startText,
            ]}
          >
            {isRunning ? "Pausar" : "Iniciar"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.skipButton]}
          onPress={handleSkip}
        >
          <Text style={[styles.buttonText, { color: "#fff" }]}>Pular</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.completeButton]}
          onPress={handleComplete}
        >
          <Text style={[styles.buttonText, { color: "#fff" }]}>Finalizar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#fafafa",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: 260,
    height: 260,
    marginBottom: 30,
    opacity: 0.9,
  },
  timer: {
    fontSize: 60,
    fontWeight: "300",
    color: "#222",
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 14,
    marginTop: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 2,
  },
  buttonStart: {
    backgroundColor: "#14532d",
    borderColor: "#14532d",
  },
  buttonPause: {
    backgroundColor: "#fff",
    borderColor: "#14532d",
  },
  startText: {
    color: "#fff",
  },
  pauseText: {
    color: "#14532d",
  },
  completeButton: {
    backgroundColor: "#d97706",
    borderColor: "#d97706",
  },
  skipButton: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
