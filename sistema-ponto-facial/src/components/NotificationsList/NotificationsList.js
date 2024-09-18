import { View, StyleSheet, Image, Text, ScrollView  } from 'react-native'
import Notification from '../Notification/Notification'
import { width } from '../../constants/measures'

export default function NotificationsList({ notifications }) {

  return (
    <View style={styles.notificationsList}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Notificações</Text>
        <Text style={styles.option}>Ver Todas</Text>
      </View>
      <ScrollView 
        horizontal={true}
        contentContainerStyle={styles.container}
        showsHorizontalScrollIndicator={true}
      >
        {
          notifications.map((notification) => (
            <Notification key={notification.id} id={notification.id} title={notification.title} description={notification.description} />
          ))
        }
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginLeft: "5%",
    paddingRight: "10%",
  },
  notificationsList: {
    paddingTop: 32,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "5%",
    marginBottom: 8,
  },
  sectionTitle: {
    color: "rgba(34, 34, 34, 1)",
    fontWeight: "500",
    fontSize: 18,
  },
  option: {
    fontSize: 14,
    color: "rgba(34, 34, 34, 0.7)",
  }
})