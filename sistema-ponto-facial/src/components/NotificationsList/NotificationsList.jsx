import { View, Image, Text, ScrollView  } from 'react-native'
import Notification from '../Notification/Notification'
import { width } from '../../constants/measures'
import styles from './NotificationsList.styles'

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