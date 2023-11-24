import { StyleSheet, Text, View,Modal,ActivityIndicator } from 'react-native'
import React from 'react'
import { GlobalStyles } from '../colors'

const RefreshModal = ({isRefreshing}) => {
  return (
    <Modal
        transparent={true}
        animationType="fade"
        visible={isRefreshing}
        >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={GlobalStyles.colors.colorPrimaryDark} />
        </View>
      </Modal>
  )
}

export default RefreshModal

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
      },
})