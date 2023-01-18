import axios from "axios";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import appStyles from "./styles/appStyles";

export default function App() {

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const logInAndGetSchedual = async () => {
    await axios.post('http://localhost:8001/userLogIn', { login, password })
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) { // если получили ошибку
        console.log(error);
      });
  };

  return (
    <View style={appStyles.container}>
      <StatusBar style="auto" />

      <View style={appStyles.inputView}>
        <TextInput
          style={appStyles.TextInput}
          placeholder="Логин "
          placeholderTextColor="#003f5c"
          onChangeText={(login) => setLogin(login)}
        />
      </View>

      <View style={appStyles.inputView}>
        <TextInput
          style={appStyles.TextInput}
          placeholder="Пароль"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View>

      <TouchableOpacity style={appStyles.loginBtn} onPress={logInAndGetSchedual}>
        <Text style={appStyles.loginText}>LOGIN</Text>
      </TouchableOpacity>

    </View>
  );
}
