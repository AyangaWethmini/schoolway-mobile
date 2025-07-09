import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function Map() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Map View</Text>
      <Text>Your route map will appear here</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FAF8F8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2B3674',
  }
})