import { View, StyleSheet, Text } from 'react-native';

export default function PointOption() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Seu texto aqui</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff', // Defina a cor de fundo como desejar
    },
    text: {
        fontSize: 18,
        color: '#000', // Defina a cor do texto como desejar
    },
});
