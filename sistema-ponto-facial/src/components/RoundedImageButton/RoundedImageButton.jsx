import { View, Image, Text, Pressable } from 'react-native'

import styles from './RoundedImageButton.styles'
export default function RoudedeImageButton({ children, callback }) {
  
  return (
    <Pressable 
      style={({pressed}) => {
        styles.button,
        {backgroundColor: pressed ? 'rgba(34, 34, 34, 0.4)' : "#FFF"}
      } 
      } onPress={() => callback}>
      <View style={styles.container}>
        { children }
      </View>
    </Pressable>
  )
}