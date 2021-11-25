import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Header = () => {
  return (
    <View style={styles.header}>
      <Image style={styles.avatar} source={require('../../assets/user.jpg')} />
      <Image style={styles.logo} source={require('../../assets/logo-black-big.png')} />
      <Image style={styles.chatIcon} source={require('../../assets/chat_icon.png')} />
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: 'white',
    padding: 15,
    justifyContent: 'space-between',
    marginTop: 10
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 25
  },
  chatIcon: {
    marginTop: 5,
    height: 30,
    width: 30,
  },
  logo: {
    marginTop: 10,
    height: 20,
    width: 150
  }
})

export default Header;