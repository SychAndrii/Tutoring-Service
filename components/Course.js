import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

const Course = ({course}) => {
  return (
    <View>
        <Text>{course.name}</Text>
    </View>
  )
}

const stlyes = StyleSheet.create({

});

export default Course