import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const LikeJobItem = ({item}) => {
  return (
    <View>
      <Text>{item.category}</Text>
    </View>
  )
}

export default LikeJobItem

const styles = StyleSheet.create({})