import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { UserContext } from '../../context/UserContext';
import { getColab } from '../../http/api/colabs';

export default function Dashboard() {
  const [data, setData] = useState({ labels: [], datasets: [{ data: [] }] });
  const { getToken } = useContext(UserContext);

  useEffect(() => {
    async function fetchCollaborators() {
      try {
        const token = await getToken();
        const response = await getColab(token);

        if (response && response.message === "success") {
          const roleData = {};

          response.collaborators.forEach(collaborator => {
            const { role, hourly_value, estimated_journey } = collaborator;
            const value = hourly_value * estimated_journey;

            if (roleData[role]) {
              roleData[role] += value;
            } else {
              roleData[role] = value;
            }
          });

          const labels = Object.keys(roleData);
          const values = Object.values(roleData);

          setData({
            labels,
            datasets: [{ data: values }],
          });
        }
      } catch (error) {
        console.error("Erro ao buscar colaboradores:", error);
      }
    }

    fetchCollaborators();
  }, [getToken]);

  const screenWidth = Dimensions.get("window").width;

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: 0.5,
    decimalPlaces: 0,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.chartTitle}>Gastos esperados por setor/mês</Text>
      <View style={styles.chartContainer}>
        <Text style={styles.yAxisLabel}>VALOR</Text>
        <BarChart
          data={data}
          width={screenWidth - 60}
          height={220}
          chartConfig={chartConfig}
          verticalLabelRotation={30}
          style={styles.chart}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yAxisLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
    transform: [{ rotate: '270deg' }],
  },
  chart: {
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});