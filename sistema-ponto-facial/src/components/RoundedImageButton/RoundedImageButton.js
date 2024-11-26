import { View, StyleSheet, Image, Text, Pressable } from 'react-native'
export default function RoudedeImageButton({ children, onPress }) {
  
  return (
    <Pressable 
      style={({pressed}) => {
        styles.button,
        {backgroundColor: pressed ? 'rgba(34, 34, 34, 0.4)' : "#FFF"}
      } 
      } onPress={onPress}>
      <View style={styles.container}>
        { children }
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: 44,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(34, 34, 34, 0.4)", 
    borderRadius: 50,
    padding: 8,
    marginLeft: 12,
    cursor: "pointer",
  },
  button: {
    backgroundColor: "transparent",
  }
})