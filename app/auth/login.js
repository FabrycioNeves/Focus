import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from "firebase/auth";

import { db, auth } from "../../firebase/firebaseConfig";
import { useRouter } from "expo-router";
import { loadUserDataFromFirestore } from "../../firebase/firestore/restoreAndRescheduleAll";

export default function AuthScreen() {
  const [modo, setModo] = useState("login");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const router = useRouter();

  const handleAuth = async () => {
    setMensagem("");

    if (modo === "login") {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, senha);

        if (cred.user.emailVerified) {
          await loadUserDataFromFirestore(cred.user.uid); // <-- Agora realmente carrega os dados
          console.log("✅ Login realizado:", cred.user.email);
          setMensagem("✅ Login realizado com sucesso!");
          router.push("/");
        } else {
          await signOut(auth);
          console.log("⚠ Usuário não verificado:", cred.user.email);
          setMensagem("❌ Verifique seu email antes de entrar.");
        }
      } catch (err) {
        console.log("❌ Erro no login:", err.code, err.message);
        setMensagem("❌ Email ou senha incorretos.");
      }
    } else {
      try {
        // Cria o usuário
        const cred = await createUserWithEmailAndPassword(auth, email, senha);
        console.log("✅ Conta criada:", cred.user.email);

        // Envia email de verificação
        await sendEmailVerification(cred.user);
        console.log("📧 Email de verificação enviado para:", cred.user.email);
        setMensagem(
          "✅ Conta criada! Verifique seu email antes de fazer login."
        );
        setModo("login");
      } catch (error) {
        console.log("❌ Erro ao cadastrar:", error.code, error.message);

        // Mostra mensagens específicas
        if (error.code === "auth/email-already-in-use") {
          setMensagem("❌ Email já em uso.");
        } else if (error.code === "auth/weak-password") {
          setMensagem("❌ Senha deve ter 6 ou mais caracteres.");
        } else {
          setMensagem("❌ Erro ao cadastrar.");
        }

        // 🔴 Impede que o código continue após erro
        return;
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.toggleContainer}>
        <TouchableOpacity onPress={() => setModo("login")}>
          <Text style={[styles.toggle, modo === "login" && styles.active]}>
            Entrar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModo("cadastro")}>
          <Text style={[styles.toggle, modo === "cadastro" && styles.active]}>
            Criar Conta
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
        <Text style={styles.authButtonText}>
          {modo === "login" ? "Entrar" : "Cadastrar"}
        </Text>
      </TouchableOpacity>

      {modo === "login" && (
        <TouchableOpacity>
          <Text style={styles.link}>Esqueci a senha</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.ou}>Ou continue com</Text>

      <TouchableOpacity style={styles.googleButton}>
        <Image
          source={require("../../assets/google.png")}
          style={styles.googleIcon}
        />
        <Text style={styles.googleText}>Entrar com Google</Text>
      </TouchableOpacity>

      {mensagem ? <Text style={styles.mensagem}>{mensagem}</Text> : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  logo: {
    width: 150,
    height: 300,
    alignSelf: "center",
    marginBottom: 30,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  toggle: {
    marginHorizontal: 20,
    fontSize: 18,
    color: "#999",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  active: {
    color: "#000",
    borderBottomColor: "#4B4DED",
    fontWeight: "bold",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  authButton: {
    backgroundColor: "#4B4DED",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  authButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: "#4B4DED",
    textAlign: "center",
    marginTop: 15,
    textDecorationLine: "underline",
  },
  ou: {
    textAlign: "center",
    marginVertical: 15,
    color: "#888",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  mensagem: {
    textAlign: "center",
    color: "red",
    marginTop: 20,
  },
});
