import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import FirstPage from "./Components/FirstPage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Home from "./Components/Home";
import Commits from "./Components/Commits";
import HomeOptions from "./Components/HomeOptions";
import EditInfo from "./Components/EditInfo";
import EditPassword from "./Components/EditPassword";

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="FirstPage"
          component={FirstPage}
          options={{ title: "Bienvenido a Mobile Hub!" }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: "Iniciar sesión en Mobile Hub!" }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ title: "Registrarse en Mobile Hub!" }}
        />

        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: "Repositorios: Dizkm8" }}
        />

        <Stack.Screen
          name="Commits"
          component={Commits}
          options={{ title: "Commits" }}
        />

        <Stack.Screen
          name="Options"
          component={HomeOptions}
          options={{ title: "Menú" }}
        />

        <Stack.Screen
          name="Edit"
          component={EditInfo}
          options={{ title: "Editar info" }}
        />

        <Stack.Screen
          name="Editpassword"
          component={EditPassword}
          options={{ title: "Cambiar contraseña" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
