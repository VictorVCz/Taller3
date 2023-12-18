import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Image, Text, View } from "react-native";

const HomeOptions = ({ navigation }) => {
  const cerrarSesion = async () => {
    try {
      // Eliminar el token almacenado
      await AsyncStorage.removeItem("token");
      // Navegar a la pantalla de inicio de sesión u otra pantalla deseada
      navigation.navigate("FirstPage");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <View>
      <Image
        source={require("../assets/logo.png")}
        style={{ width: 300, height: 200 }}
      />
      <Text>Bienvenido a Mobile Hub!</Text>
      <Text>Opciones: </Text>

      <View>
        <Button
          title="Ver repositorios"
          onPress={() => {
            navigation.navigate("Home");
          }}
        ></Button>
        <Button
          title="Editar información"
          onPress={() => {
            navigation.navigate("Edit");
          }}
        ></Button>
        <Button
          title="Cambiar contraseña"
          onPress={() => {
            navigation.navigate("Editpassword");
          }}
        ></Button>
        <Button
          title="Cerrar sesión"
          onPress={() => {
            cerrarSesion();
          }}
        ></Button>
      </View>
    </View>
  );
};

export default HomeOptions;
