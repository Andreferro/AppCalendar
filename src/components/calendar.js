import React, { useState } from 'react';
import {
  StyleSheet, View, Dimensions, Image, Text,
  Animated, TouchableWithoutFeedback, TouchableOpacity,
  ImageBackground,
  Platform
} from 'react-native';
import Interactable from 'react-native-interactable';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import dayjs from 'dayjs';

const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height - 75
}

const Calendar = () => {
  const [startDay, setStartDay] = useState(null);
  const [endDay, setEndDay] = useState(null);
  const [currentDate, setCurrentDate] = useState(dayjs().hour(0));
  const [deltaY, setDeltaY] = useState(new Animated.Value(Screen.height))

  /* 
   * This function will consider the number of days of each week
   * that are between the selected dates to calculate the width
   * and left position of the gradient background, so it can always
   * begin with the color #4a54df and end with  #15d4d8
   */
  const calculateBgPotion = (week) => {
    let firstDayOfRange = 0
    let lastDayOfRange = 6

    for (let i = 0; i < week.length; i++) {
      if (week[i] === startDay) {
        firstDayOfRange = i
      } else if (week[i] === endDay) {
        lastDayOfRange = i
      }
    }

    let numberOfDaysRange = lastDayOfRange - firstDayOfRange

    return {
      width: `${14.2 * (numberOfDaysRange + 0.8)}%`,
      left: `${(15 * firstDayOfRange) + 1.5}%`,
      height: 30,
      top: 10
    }
  }

  const renderDays = () => {
    // This matrix will have an array os weeks and array of days of each week
    let days = [[]]
    let firstDay = currentDate.date(1).get('day')
    let previousMonth = currentDate.clone()
    previousMonth.subtract(1, 'month')

    // Index of week array
    // Each week is a row
    let rows = 0

    // Add empty days from previous month
    if (firstDay !== 0) {
      for (let i = 0; i < currentDate.date(1).get('day'); i++) {
        days[rows].push(undefined)
      }
    }

    // Add days from current month
    for (let i = 1; i <= currentDate.daysInMonth(); i++) {
      if (days[rows].length === 7) {
        rows++;
        days.push([])
      }
      days[rows].push(i)
    }

    // Add empty days from next month
    if (days[rows].length < 7) {
      let size = (7 - days[rows].length)
      for (let i = 1; i <= size; i++) {
        days[rows].push(undefined)
      }
    }

    return days.map((week, index) => (
      <View key={index}>
        <ImageBackground
          source={require('../../assets/gradient-1.png')}
          resizeMode="stretch"
          imageStyle={[
            styles.backgroundStyle,
            calculateBgPotion(week)

          ]}
          style={styles.rangeBackground}
        >
          {
            week.map((day, i) => (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => day && selectDay(day)}
                style={[
                  styles.dayButton,
                  startDay <= day && endDay >= day && styles.range,
                ]}
                key={`${index}_${i}`}
              >
                <Text style={[styles.day, startDay === day && styles.startLabel]}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))
          }
        </ImageBackground>
      </View>
    ))
  }

  const selectDay = (day) => {
    // If the day is already selected, remove selection 
    if (startDay === day) {
      setStartDay(null)
      setEndDay(null)
    } else if (endDay === day) {
      setEndDay(null)
    }
    // If the day is not selected, check if it will be start or end
    else if (startDay) {
      if (endDay) {
        setStartDay(day)
        setEndDay(null)
      } else if (startDay < day) {
        setEndDay(day)
      } else {
        setStartDay(day)
        setEndDay(null)
      }
    } else {
      setStartDay(day)
      setEndDay(null)
    }
  }

  const changeMonth = (operation) => {
    setStartDay(null)
    setEndDay(null)
    if (operation === 'add')
      setCurrentDate(currentDate.add(1, 'month'))
    if (operation === 'subtract')
      setCurrentDate(currentDate.subtract(1, 'month'))
  }

  return (
    <View style={styles.draggable} pointerEvents={'box-none'}>

      <Animated.View
        pointerEvents={'box-none'}
        style={[styles.draggable, {
          backgroundColor: 'black',
          opacity: deltaY.interpolate({
            inputRange: [0, Screen.height],
            outputRange: [1, 0],
            extrapolateRight: 'clamp'
          })
        }]} />

      {/* 
        * Since React Native does not have a native component or style rule
        * to create a gradient, the fastest way was to create an image with
        * the colors I wanted and set it as background
        */}
      <Interactable.View
        verticalOnly={true}
        snapPoints={[{ y: Screen.height - 450 }, { y: Screen.height - 10 }]}
        boundaries={{ top: Screen.height - 550 }}
        initialPosition={{ y: Screen.height - 450 }}
        animatedValueX={new Animated.Value(0)}
        animatedValueY={deltaY}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Calendar</Text>

          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={() => changeMonth('subtract')} style={styles.arrowButton}>
              <Icon name="arrowleft" size={25} color="lightgray" />
            </TouchableOpacity>
            <Text style={styles.calendarMonth}>{currentDate.format('MMM')}</Text>
            <TouchableOpacity onPress={() => changeMonth('add')} style={styles.arrowButton}>
              <Icon name="arrowright" size={25} color="lightgray" />
            </TouchableOpacity>
          </View>

          <View style={styles.weekDays}>
            <Text style={styles.weekDayLetter}>S</Text>
            <Text style={styles.weekDayLetter}>M</Text>
            <Text style={styles.weekDayLetter}>T</Text>
            <Text style={styles.weekDayLetter}>W</Text>
            <Text style={styles.weekDayLetter}>T</Text>
            <Text style={styles.weekDayLetter}>F</Text>
            <Text style={styles.weekDayLetter}>S</Text>
          </View>

          <View style={styles.calendarGrid}>
            {renderDays()}
          </View>

          <TouchableWithoutFeedback style={styles.touchable}>
            <View style={styles.rounded}>
              <ImageBackground
                source={require('../../assets/gradient-2.png')}
                resizeMode="cover"
                style={styles.button}
              >
                <Text style={styles.buttonText}>Apply</Text>
              </ImageBackground>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Interactable.View>

    </View>
  );
}

const styles = StyleSheet.create({
  draggable: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  container: {
    height: Screen.height + 300,
    padding: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    shadowOpacity: 0.4
  },
  title: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'Roboto-Regular'
  },
  calendarHeader: {
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
    marginBottom: 1
  },
  calendarMonth: {
    color: 'gray',
    fontSize: 18,
    fontFamily: 'Roboto-Regular'
  },
  dayButton: {
    height: 50,
    width: Platform.OS === 'android' ? 52 : 50,
    justifyContent: 'center',
    backgroundColor: 'white',
    opacity: 1,
    marginBottom: -1,
  },
  day: {
    color: 'black',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Roboto-Regular'
  },
  weekDays: {
    flexDirection: 'row',
    height: 20,
    justifyContent: 'space-between',
    paddingLeft: Platform.OS === 'android' ? 25 : 10,
    paddingRight: Platform.OS === 'android' ? 25 : 10,
    marginTop: 10,
  },
  weekDayLetter: {
    color: 'black',
    fontSize: 12,
    fontFamily: 'Roboto-Bold'
  },
  calendarGrid: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  startLabel: {
    backgroundColor: '#15d4d8',
    borderRadius: 20,
    overflow: 'hidden',
    paddingTop: 10,
    alignSelf: 'center',
    height: 40,
    width: 40,
  },
  touchable: {
    width: Dimensions.get('screen').width - 100,
    alignSelf: 'center'
  },
  rounded: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  button: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    overflow: 'hidden'
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Roboto-Regular'
  },
  range: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderBottomWidth: 10,
    borderBottomColor: 'white',
    borderTopWidth: 10,
    marginBottom: -1,
    borderTopColor: 'white'
  },
  rangeBackground: {
    flexDirection: 'row',
    overflow: 'hidden',
    // opacity: 0.2
  },
  backgroundStyle: {
    borderRadius: Platform.OS === 'android' ? 30 : 70,
  },
  arrowButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
    width: 35
  }
});

export default Calendar;