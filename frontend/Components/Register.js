import react, { useState } from "react";
import { TextInput, View, Text, Button, Alert } from "react-native";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";

const Register = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [rut, setRut] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthDate;
    setShowDatePicker(Platform.OS === "ios");
    setBirthDate(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const registerAction = async () => {
    try {
      const response = await axios.post(
        "http://10.0.2.2:5085/api/Auth/register",
        {
          fullName,
          email,
          rut,
          BirthDate: birthDate.toISOString(),
        }
      );

      console.log("Debugging resigrAction mssg: ", response.data);
      navigation.navigate("FirstPage");
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
        placeholder="Ingrese su nombre completo"
        onChangeText={(text) => setFullName(text)}
      ></TextInput>

      <Text> Correo electrónico</Text>
      <TextInput
        placeholder="Ingrese su correo electrónico"
        onChangeText={(text) => setEmail(text)}
      ></TextInput>

      <Text> Rut</Text>
      <TextInput
        placeholder="Ingrese su Rut"
        onChangeText={(text) => setRut(text)}
      ></TextInput>

      <Button
        title="Seleccionar fecha de nacimiento"
        onPress={showDatepicker}
      />

      {showDatePicker && (
        <DateTimePicker
          value={birthDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <Button title="Registrarse" onPress={() => registerAction()}></Button>
    </View>
  );
};

export default Register;
