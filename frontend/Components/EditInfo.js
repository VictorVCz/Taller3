import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const EditInfo = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const rut = "";

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthDate;
    setShowDatePicker(Platform.OS === "ios");
    setBirthDate(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const editAction = async () => {
    try {
      const emailLocal = await AsyncStorage.getItem("email");
      const token = await AsyncStorage.getItem("token");
      const email40 = emailLocal.replace(/@/g, "%40");

      const response = await axios.put(
        `http://10.0.2.2:5085/api/User/edit?email=${email40}`,
        {
          fullName,
          email,
          rut,
          BirthDate: birthDate.toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await AsyncStorage.setItem("email", email);
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
      <Text>Registrese en Mobile Hub!</Text>

      <Text> Nombre Completo</Text>
      <TextInput
        placeholder="Edite su nombre completo"
        onChangeText={(text) => setFullName(text)}
      ></TextInput>

      <Text> Correo electrónico</Text>
      <TextInput
        placeholder="Edite su correo electrónico"
        onChangeText={(text) => setEmail(text)}
      ></TextInput>

      <Button title="Edite fecha de nacimiento" onPress={showDatepicker} />

      {showDatePicker && (
        <DateTimePicker
          value={birthDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <Button title="Aplicar cambios" onPress={() => editAction()}></Button>
    </View>
  );
};

export default EditInfo;
