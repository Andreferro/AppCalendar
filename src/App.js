import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Calendar, Header } from './components';

const App = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <View style={styles.container}>
      <Header />

      <ImageBackground
        source={require('../assets/ilustration_lifestyle.png')}
        resizeMode="cover"
        style={styles.banner}
      >
        <Text style={styles.title}>Lifestyle</Text>
        <Text style={styles.text}>Get a holistic view of your activities to enhance your wellbeing and benefit from even more accurate recommendations.</Text>
      </ImageBackground>

      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setActiveTab(0)} style={[styles.tab, activeTab === 0 && styles.tabActive]}>
          <Text style={styles.tabTitle}>Timestamp Feed</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab(1)} style={[styles.tab, activeTab === 1 && styles.tabActive]}>
          <Text style={styles.tabTitle}>Activity Feed</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}></View>
      <Calendar />

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1
  },
  image: {
    width: '100%'
  },
  banner: {
    padding: 30
  },
  content: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.05)'
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    color: 'white',
    fontFamily: 'Roboto-Bold'
  },
  text: {
    width: '50%',
    fontSize: 15,
    color: 'white',
    fontFamily: 'Roboto-Regular'
  },
  tabs: {
    flexDirection: 'row',
  },
  tab: {
    width: '50%'
  },
  tabTitle: {
    color: 'black',
    textAlign: 'center',
    padding: 10,
    fontFamily: 'Roboto-Regular'
  },
  tabActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  }
})

export default App;