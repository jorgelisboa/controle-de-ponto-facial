import React from 'react';
import { View, Dimensions, Text, ScrollView, StyleSheet } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

export default function Dashboard() {
    const screenWidth = Dimensions.get("window").width;

    // Dados para o gráfico de linha
    const lineData = {
        labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"],
        datasets: [
            {
                data: [20, 45, 28, 80, 99, 43],
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Cor da linha em branco
                strokeWidth: 2 // Largura da linha
            }
        ],
        legend: ["Vendas Mensais"] // Legenda do gráfico
    };

    // Dados para o gráfico de barras
    const barData = {
        labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"],
        datasets: [
            {
                data: [20, 45, 28, 80, 99, 43] // Dados das barras
            }
        ]
    };

    // Dados para o gráfico de pizza
    const pieData = [
        {
            name: "Grupo A",
            population: 21500000,
            color: "rgba(255, 255, 255, 1)", // Cor em branco
            legendFontColor: "#FFFFFF", // Cor da legenda em branco
            legendFontSize: 15
        },
        {
            name: "Grupo B",
            population: 2800000,
            color: "#7F7F7F", // Cor cinza
            legendFontColor: "#FFFFFF", // Cor da legenda em branco
            legendFontSize: 15
        },
        {
            name: "Grupo C",
            population: 527612,
            color: "#D3D3D3", // Cor cinza claro
            legendFontColor: "#FFFFFF", // Cor da legenda em branco
            legendFontSize: 15
        }
    ];

    return (
        <ScrollView contentContainerStyle={styles.scrollView}> {/* Usando contentContainerStyle para permitir rolagem */}
            <View style={styles.container}>
                <Text style={styles.title}>Gráfico de Linha</Text>
                <LineChart
                    data={lineData}
                    width={screenWidth}
                    height={220}
                    chartConfig={{
                        backgroundColor: "#000000", // Fundo preto
                        backgroundGradientFrom: "#000000",
                        backgroundGradientTo: "#000000",
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Cor do texto em branco
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Cor do rótulo em branco
                        style: {
                            borderRadius: 16
                        }
                    }}
                    bezier
                    style={styles.chart}
                />

                <Text style={styles.title}>Gráfico de Barras</Text>
                <BarChart
                    data={barData}
                    width={screenWidth}
                    height={220}
                    chartConfig={{
                        backgroundColor: "#000000", // Fundo preto
                        backgroundGradientFrom: "#000000",
                        backgroundGradientTo: "#000000",
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Cor do texto em branco
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Cor do rótulo em branco
                        style: {
                            borderRadius: 16
                        }
                    }}
                    style={styles.chart}
                />

                <Text style={styles.title}>Gráfico de Pizza</Text>
                <PieChart
                    data={pieData}
                    width={screenWidth}
                    height={220}
                    chartConfig={{
                        backgroundColor: "#000000", // Fundo preto
                        backgroundGradientFrom: "#000000",
                        backgroundGradientTo: "#000000",
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Cor do texto em branco
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Cor do rótulo em branco
                        style: {
                            borderRadius: 16
                        }
                    }}
                    accessor={"population"}
                    backgroundColor={"transparent"}
                    paddingLeft={"15"}
                    center={[10, 50]}
                    absolute
                />
            </View>
        </ScrollView>
    );
}

// Estilos para o componente
const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1, // Permite que o ScrollView cresça
        padding: 16, // Adiciona um pouco de espaço ao redor
    },
    container: {
        paddingBottom: 16, // Adiciona espaço na parte inferior
        backgroundColor: '#000000', // Fundo preto
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#FFFFFF', // Cor do título em branco
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
});