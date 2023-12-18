import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";

const Commits = (props) => {
  const repoName = props.route.params.repo;

  const [commitsRepo, setCommitsRepo] = useState([]);
  const urlGetCommits = `http://10.0.2.2:5085/api/GithubAPI/commits?repo=${repoName}`;

  useEffect(() => {
    getCommitsFromRepoAction();
  }, []);

  const getCommitsFromRepoAction = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await axios.get(urlGetCommits, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCommitsRepo(response.data);

      const sortedRepos = response.data.sort((a, b) => {
        const dateA = new Date(a.updated_at);
        const dateB = new Date(b.updated_at);

        return dateB - dateA;
      });

      setCommitsRepo(sortedRepos);
    } catch (error) {
      console.error("Error", error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <View>
      <ScrollView>
        <Text>Commits del repositorio: {repoName}</Text>
        {commitsRepo.map((c) => (
          <View>
            <Text>Autor: {c.commit.author.name}</Text>
            <Text>Mensaje: {c.commit.message}</Text>
            <Text>Fecha: {formatDate(c.commit.author.date)}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Commits;
