import { View, Text, TouchableOpacity } from "react-native";

import styles from "./Notification.styles";

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

