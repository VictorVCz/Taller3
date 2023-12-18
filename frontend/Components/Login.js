import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import react, { useState } from "react";
import { TextInput, View, Text, Button, Alert } from "react-native";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginAction = async () => {
    try {
      const response = await axios.post(
        `http://10.0.2.2:5085/api/Auth/login?email=${email}&password=${password}`
      );
      console.log("Debugging resigerAction mssg: ", response.data.token);
      const token = response.data.token;

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("email", email);
      navigation.navigate("Options");
      //guardar el token
    } catch (error) {
      if (error.response) {
        // Obtener la lista de errores del backend
        console.log(error.response.data.Error[0]);

        const errors = error.response.data.Error;

        // Mostrar mensajes de error al usuario
        Alert.alert("Error de registro", Object.values(errors).join("\n"));
      } else {
        // Manejar otros errores que no sean de validación
        console.error("Error al registrarse ", error.message);
      }
    }
  };

  return (
    <View>
      <Text>Iniciar sesión</Text>

      <Text> Correo electrónico</Text>
      <TextInput
        placeholder="Ingrese su correo"
        onChangeText={(Text) => {
          setEmail(Text);
        }}
      ></TextInput>
      <Text> Contraseña</Text>
      <TextInput
        placeholder="Ingrese su contraseña"
        onChangeText={(psswd) => {
          setPassword(psswd);
        }}
      ></TextInput>

      <Button title="Iniciar sesión" onPress={() => loginAction()}></Button>
    </View>
  );
};

export default Login;
