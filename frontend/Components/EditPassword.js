import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import react, { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";

const EditPassword = ({ navigation }) => {
  const [password, setPassword] = useState("");

  const editAction = async () => {
    try {
      const emailLocal = await AsyncStorage.getItem("email");
      const token = await AsyncStorage.getItem("token");
      const email40 = emailLocal.replace(/@/g, "%40");

      const response = await axios.put(
        `http://10.0.2.2:5085/api/User/editPassword?email=${email40}&password=${password}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Debugging resigerAction mssg: ", response.data);
      navigation.navigate("Options");
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
      <Text>Ingrese su nueva Contraseña</Text>
      <TextInput
        placeholder="contraseña nueva"
        onChangeText={(text) => {
          setPassword(text);
        }}
      ></TextInput>
      <Button title="Aplicar cambios" onPress={() => editAction()}></Button>
    </View>
  );
};

export default EditPassword;
