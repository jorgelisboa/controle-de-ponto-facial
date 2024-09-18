import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function Notification({ id, title, description }) {

  return (
    <View style={styles.container}>
        <View key={id} style={styles.notificationBox}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.description} numberOfLines={2} ellipsizeMode="middle">{description}</Text>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    width: 360,
  },
  notificationBox: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgba(34, 34, 34, 0.8)',
    marginBottom: 5,
    flexWrap: 'wrap',
  },
  description: {
    fontSize: 14,
    color: 'rgba(34, 34, 34, 0.6)',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
});
