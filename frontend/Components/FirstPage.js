import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const FirstPage = ({ navigation }) => {
  return (
    <SafeAreaProvider>
      <View style={FirstPageStyle.container}>
        <Image
          source={require("../assets/logo.png")}
          style={{ width: 200, height: 200 }}
        />
        <Text>Bienvenido a Mobile Hub!</Text>

        <View style={FirstPageStyle.viewButton}>
          <Button
            title="Iniciar sesión"
            style={FirstPageStyle.button}
            onPress={() => {
              navigation.navigate("Login");
            }}
          ></Button>
          <Button
            title="Registrarse"
            style={FirstPageStyle.button}
            onPress={() => {
              navigation.navigate("Register");
            }}
          ></Button>
        </View>
      </View>
    </SafeAreaProvider>
  );
};

const FirstPageStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  viewButton: {
    flexDirection: "row",
  },

  button: {
    padding: 20,
    margin: 20,
  },
});

export default FirstPage;
