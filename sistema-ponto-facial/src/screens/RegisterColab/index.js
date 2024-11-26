import { Text, TextInput } from "react-native-paper";
import { StyleSheet, View } from "react-native";

export default function RegisterColab() {
  return (
    <View style={styles.container}>
      <Text>Nome</Text>
      <TextInput placeholder="Nome" />
      <Text>Email</Text>
      <TextInput placeholder="Email" />
      <Text>Senha</Text>
      <TextInput placeholder="Senha" />
      <Text>CPF</Text>
      <TextInput placeholder="CPF" />
      <Text>Função</Text>
      <TextInput placeholder="Função" />
      <Text>Valor por hora</Text>
      <TextInput placeholder="Valor por hora" />
      <Text>Jornada estimada</Text>
      <TextInput placeholder="Jornada estimada" />
      <Text>Foto de perfil</Text>
      <TextInput placeholder="Foto de perfil" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
