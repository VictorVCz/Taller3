import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import react, { useEffect, useState } from "react";
import { View, Text, ScrollView, Button } from "react-native";

const Home = ({ navigation }) => {
  const [repos, setRepos] = useState([]);
  const [repo, setRepo] = useState("");
  const urlGetRepos = "http://10.0.2.2:5085/api/GithubAPI/repos";

  useEffect(() => {
    getRepos();
  }, []);

  // metodo GET para obtener los datos y permitir desplegarlos
  const getRepos = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await axios.get(urlGetRepos, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Ordenar repositorios por fecha de modificación (updated_at) de forma descendente
      const sortedRepos = response.data.sort((a, b) => {
        const dateA = new Date(a.updated_at);
        const dateB = new Date(b.updated_at);

        return dateB - dateA;
      });
      // Almacenar los repositorios ordenados en el estado
      setRepos(sortedRepos);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const seeCommitsAction = (repoName) => {
    setRepo(repoName);
    navigation.navigate("Commits", { repo: repoName });
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <View>
      <ScrollView>
        <Text>Repositorios disponibles:</Text>
        {repos.map((repo) => (
          <View key={repo.id}>
            <Text>Name: {repo.name}</Text>
            <Text>Description: {repo.description}</Text>
            <Text>Última modificación: {formatDate(repo.updated_at)}</Text>

            <Button
              title="Ver commits"
              onPress={() => {
                seeCommitsAction(repo.name);
              }}
            ></Button>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Home;
