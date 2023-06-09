import 'react-native-gesture-handler';
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {GlobalStyles} from '../colors';
import {useDispatch, useSelector} from 'react-redux';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  useDerivedValue,
  interpolate,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';

import api from '../api/api';
import JobCard from '../cards/JobCard';
import Like from '../images/LIKE.png';
import Nope from '../images/nope.png';
import Icon from 'react-native-vector-icons/Ionicons';
import Font from 'react-native-vector-icons/FontAwesome';
import Ent from 'react-native-vector-icons/Entypo';

const HomeScreen = ({navigation}) => {
  const {width: screenWidth} = useWindowDimensions();
  const user = useSelector(state => state.auth.user);
  const [jobs, setJobs] = useState([]);
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(currentIndex + 1);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  let currentJob;
  let nextJob;
  const getJobs = async () => {
    try {
      const response = await api.get('/job/getall');
      setJobs(response.data);
      setIsDataLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  currentJob = jobs[currentIndex];
  nextJob = jobs[nextIndex];

  console.log('Current Job', jobs.length);
  console.log('Current Index', currentIndex);
  console.log('Current Next', nextIndex);
  useEffect(() => {
    getJobs();
  }, []);

  const ROTATION = 60;
  const SWIPE_VELOCITY = 800;
  const hiddenTranslate = 2 * screenWidth;
  const translateX = useSharedValue(1);
  const rotate = useDerivedValue(
    () =>
      interpolate(translateX.value, [0, hiddenTranslate], [0, ROTATION]) +
      'deg',
  );
  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
      {
        rotate: rotate.value,
      },
    ],
  }));
  const nextCardStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          translateX.value,
          [-hiddenTranslate, 0, hiddenTranslate],
          [1, 0.8, 1],
        ),
      },
    ],
    opacity: interpolate(
      translateX.value,
      [-hiddenTranslate, 0, hiddenTranslate],
      [1, 0.6, 1],
    ),
  }));
  const likeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, hiddenTranslate / 6], [0, 1]),
  }));
  const nopeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, -hiddenTranslate / 6], [0, 1]),
  }));
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
    },
    onEnd: event => {
      if (Math.abs(event.velocityX) < SWIPE_VELOCITY) {
        translateX.value = withSpring(0);
        return;
      }
      translateX.value = withSpring(
        event.velocityX > 0 ? hiddenTranslate : -hiddenTranslate,
        {},
        () => {},
      );

      if (currentIndex < jobs.length) {
        runOnJS(setCurrentIndex)(currentIndex + 1);
      }
    },
  });
  useEffect(() => {
    translateX.value = 0;

    if (currentIndex < jobs.length) {
      setNextIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
      setNextIndex(currentIndex + 1);
    }
  }, [currentIndex, translateX]);

  return (
    <GestureHandlerRootView style={styles.container}>
      
      <View style={styles.stackContainer}>
        {nextJob && (
          <View style={styles.nextCard}>
            <Animated.View style={[styles.animatedCard, nextCardStyle]}>
              {isDataLoaded && (
                <JobCard
                  title="Software Engineer"
                  description="Test Desription"
                  data={nextJob}
                />
              )}
            </Animated.View>
          </View>
        )}
        {currentJob && (
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={[styles.animatedCard, cardStyle]}>
              {isDataLoaded && (
                <>
                  <Animated.Image
                    source={Like}
                    style={[styles.like, {left: 10}, likeStyle]}
                    resizeMode="contain"
                  />
                  <Animated.Image
                    source={Nope}
                    style={[styles.like, {right: 10}, nopeStyle]}
                    resizeMode="contain"
                  />
                  <JobCard
                    title="Software Engineer"
                    description="Test Desription"
                    data={currentJob}
                  />
                </>
              )}
            </Animated.View>
          </PanGestureHandler>
        )}
      </View>
      <View style={styles.icons}>
      <TouchableOpacity style={[styles.button,{backgroundColor:GlobalStyles.colors.orange}]}>
        <View style={styles.holder}>
          <Font
            name="mail-reply"
            size={30}
            color={GlobalStyles.colors.white}
          />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button,{backgroundColor:GlobalStyles.colors.green}]}>
        <View style={[styles.holder,{width:45,height:45}]}>
          <Ent name="cross" size={40} color={GlobalStyles.colors.white} />
          </View>
        </TouchableOpacity>
        
        
        <TouchableOpacity style={[styles.button,{backgroundColor:GlobalStyles.colors.red}]}>
        <View style={[styles.holder,{width:45,height:45}]}>
          <Icon
            name="heart"
            size={40}
            color={GlobalStyles.colors.white}
          />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <View style={styles.holder}>
          <Ent name="home" size={30} color={GlobalStyles.colors.green} />
          </View>
        </TouchableOpacity>
        
      </View>
    </GestureHandlerRootView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  animatedCard: {
    width: '90%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  nextCard: {
    //  width: '100%',
    // height: '100%',
    justifyContent: 'center',
    // alignItems: 'center',
    // flex: 1,
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject,
  },
  text: {
    marginStart: 20,
    padding: 20,
    fontSize: 24,
    color: GlobalStyles.colors.colorPrimaryDark,
  },
  like: {
    width: 100,
    height: 100,
    position: 'absolute',
    top: 10,
    zIndex: 1,
  },
  icons: {
    justifyContent: "space-around",
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 10,
  },
  button: {
    backgroundColor: GlobalStyles.colors.white,
    borderRadius: 50,
    padding: 7,
    elevation: 10,

  },
  holder:{
    width:35,
    height:35,
    justifyContent:'center',
    alignItems:'center'
  },
  tap:{
    width:'100%',
    height:'100%'
  }
});
