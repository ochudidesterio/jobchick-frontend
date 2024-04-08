import 'react-native-gesture-handler';
import {
  StyleSheet,
  Alert,
  View,
  useWindowDimensions,
  TouchableOpacity,
  RefreshControl,
  Text,
  Modal,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
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
import Geolocation from '@react-native-community/geolocation';
import AndroidOpenSettings from 'react-native-android-open-settings';

import {
  likeJob,
  setCompany,
  setLoadedJobs,
  setMatchingIds,
  setUsers,
} from '../store/slices/authSlice';

import UserCard from '../cards/UserCard';
import {
  areArraysEqual,
  calculateDistance,
  filterJobsByCategory,
  filterUsersByAgeRange,
} from '../util/util';
import {useFocusEffect} from '@react-navigation/native';
import RefreshModal from '../components/RefreshModal';
import getLanguageObject from '../util/LanguageUtil';

const HomeScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const language = useSelector(state => state.auth.language);
  const util = getLanguageObject(language);
  const {width: screenWidth} = useWindowDimensions();
  const user = useSelector(state => state.auth.user);
  const ids = useSelector(state => state.auth.matchingIds);
  const company = useSelector(state => state.auth.company);
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(currentIndex + 1);
  const [nextUserIndex, setNextUserIndex] = useState(currentUserIndex + 1);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [userSetting, setUserSettings] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  let currentJob;
  let nextJob;
  let currentUser;
  let nextUser;
  const checkPermissionAndRequest = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        // Use latitude and longitude to do whatever you need

        if (
          latitude !== currentLocation.latitude ||
          longitude !== currentLocation.longitude
        ) {
          setCurrentLocation({latitude, longitude});
        }
        console.log('CurrentLocation', currentLocation);
      },
      error => {
        Alert.alert(
          util.locationPermission,
          util.enableGPS,
          [
            {
              text: util.cancel,
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: util.turnOnGPS,
              onPress: () => {
                // Open the device settings to enable GPS
                AndroidOpenSettings.locationSourceSettings();
              },
            },
          ],
          {cancelable: false},
        );
      },
    );
  };
  useEffect(() => {
    checkPermissionAndRequest();
  });

  const getUserSettings = async () => {
    try {
      const response = await api.get(`/setting/get/${user.id}`);
      setUserSettings(response.data);
    } catch (error) {}
  };

  const getJobs = async () => {
    try {
      const response = await api.get('/job/all/active');

      setJobs(response.data);
      setIsDataLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };
  const getUsers = async () => {
    try {
      const response = await api.get(`/user/company/${user.companyId}`);
      const activeUsers = response.data.filter(
        user => user.showProfile === false,
      );

      console.log('Active ', activeUsers);

      setUsers(activeUsers);
      setIsDataLoaded(true);
    } catch (e) {
      console.log(e);
    }
  };
  const getMatchingIds = async id => {
    let response;
    try {
      if (user.role === 'USER') {
        response = await api.get(`/likes/user/${id}`);
      } else {
        response = await api.get(`/likes/company/${user.companyId}`);
      }

      dispatch(setMatchingIds(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserSettings();
  }, []);
  useEffect(() => {
    if (user.role === 'USER') {
      getJobs();
    }
  }, []);
  useEffect(() => {
    if (user.role === 'ADMIN') {
      getUsers();
    }
  }, [user.companyId]);
  useEffect(() => {
    getMatchingIds(user.id);
  }, []);

  useEffect(() => {
    if (
      userSetting !== null &&
      jobs.length > 0 &&
      userSetting.userId !== null &&
      userSetting.jobTypes !== null &&
      userSetting.categories !== null &&
      currentLocation.latitude !== null &&
      currentLocation.longitude !== null
    ) {
      console.log('Setting', userSetting);
      let filteredJobsByCategory = [];
      let filteredJobsWithCategoriesMatchingTypes = [];

      // Calculate distance and filter jobs within userSetting.distance
      const filteredJobs = jobs.filter(job => {
        const jobDistance = calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          job.latitude,
          job.longitude,
        );
        return jobDistance <= userSetting.distance;
      });

      if (userSetting.categories.length > 0 && filteredJobs.length > 0) {
        filteredJobsByCategory = filterJobsByCategory(
          filteredJobs,
          userSetting.categories,
        );
      }
      if (userSetting.categories.length === 0) {
        filteredJobsByCategory = filteredJobs;
      }

      console.log('FilteredJobsByCategory1', filteredJobsByCategory);

      if (
        userSetting.jobTypes.length > 0 &&
        filteredJobsByCategory.length > 0
      ) {
        // Extract job type names from userSetting.jobTypes
        const jobTypeNames = userSetting.jobTypes.map(jobType => jobType.name);
        console.log('TypeNames', jobTypeNames);
        // Filter the filteredJobs array based on job type names
        filteredJobsWithCategoriesMatchingTypes = filteredJobsByCategory.filter(
          job => jobTypeNames.includes(job.type),
        );
        console.log('FinalFilter', filteredJobsWithCategoriesMatchingTypes);
        if (!areArraysEqual(jobs, filteredJobsWithCategoriesMatchingTypes)) {
          setJobs(filteredJobsWithCategoriesMatchingTypes);
        }
      } else {
        // Update the jobs array with filteredJobs
        //setJobs(filteredJobs);
        if (!areArraysEqual(jobs, filteredJobsByCategory)) {
          setJobs(filteredJobsByCategory);
        }
      }
    }
  }, [userSetting, jobs, currentLocation]);

  useEffect(() => {
    if (userSetting !== null && users.length > 0 && userSetting.age > 0) {
      const filteredUsers = filterUsersByAgeRange(users, userSetting.age);
      console.log('FilteredUsers', filteredUsers.length);
      //update users array with filtered users
      if (!areArraysEqual(users, filteredUsers)) {
        setUsers(filteredUsers);
      }
    }
  }, [userSetting, users]);

  currentJob = jobs[currentIndex];
  nextJob = jobs[nextIndex];

  if (users.length > 0) {
    currentUser = users[currentUserIndex];
    nextUser = users[nextUserIndex];
  }

  const doMatching = () => {
    if (currentJob) {
      const match = ids.find(
        job => job.userId === user.id && job.jobId === currentJob.id,
      );
      if (match && match.likedBack) {
        Alert.alert(
          util.congratulations,
          util.itsAmatch,
          [
            {
              text: util.startChat,
              onPress: () => {
                // Add code to handle the 'Start Chat' button press
                console.log('Start Chat');

                let id;
                let name;
                if (user.role === 'USER') {
                  id = currentJob.company.adminId;
                  name = currentJob.company.name;
                  navigation.navigate('chats', {user: user, id: id, name: name});

                }
              },
            },
          ],
          {cancelable: true},
        );
      }
    }
  };

  useEffect(() => {
    doMatching();
  }, [currentJob]);

  const onSwipeLeft = () => {
    if (user.role === 'USER') {
      console.log('JobLeft::', currentJob.title);
    }
  };
  const onSwipeRight = () => {
    if (user.role === 'USER') {
      console.log('JobRight::', currentJob.title);
    }
  };

  const ROTATION = 60;
  const SWIPE_VELOCITY = 800;
  const translateY = useSharedValue(0);
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

  const handleRefresh = async () => {
    console.log('Refreshing');
    if (user.role === 'USER') {
      await getUserSettings();
      await getJobs();
    }
    setIsRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      setIsRefreshing(true);
      handleRefresh();
    }, []),
  );

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
      translateY.value = event.translationY;
    },
    onEnd: event => {
      if (translateY.value > 100) {
        console.log('Refreshed', event);
        runOnJS(setIsRefreshing)(true);
        runOnJS(handleRefresh)();
      }

      if (Math.abs(event.velocityX) < SWIPE_VELOCITY) {
        translateX.value = withSpring(0);
        return;
      }

      if (event.velocityX > 0) {
        // Swipe Right
        translateX.value = withSpring(hiddenTranslate);
        runOnJS(onSwipeRight)(onSwipeRight);
      } else {
        // Swipe Left
        translateX.value = withSpring(-hiddenTranslate);
        runOnJS(onSwipeLeft)();
      }

      if (user.role === 'USER') {
        if (currentIndex < jobs.length) {
          runOnJS(setCurrentIndex)(currentIndex + 1);
        }
      } else {
        if (currentUserIndex < users.length) {
          runOnJS(setCurrentUserIndex)(currentUserIndex + 1);
        }
      }
    },
  });

  useEffect(() => {
    translateX.value = 0;
    if (user.role === 'USER') {
      if (currentIndex < jobs.length) {
        setNextIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0);
        setNextIndex(currentIndex + 1);
      }
    } else {
      if (currentUserIndex < users.length) {
        setNextUserIndex(currentUserIndex + 1);
      } else {
        setCurrentUserIndex(0);
        setNextUserIndex(currentUserIndex + 1);
      }
    }
  }, [currentIndex, translateX, currentUserIndex]);

  const likeJobData = {
    jobId: '',
    userId: '',
    companyId: '',
  };
  const chat = () => {
    let id;
    let name;
    if (user.role === 'USER') {
      id = currentJob.company.adminId;
      name = currentJob.company.name;
    } else {
      id = currentUser.id;
      name = currentUser.firstName + ' ' + currentUser.lastName;
    }
    navigation.navigate('chats', {user: user, id: id, name: name});
  };
  const like = async () => {
    if (user.role === 'USER') {
      dispatch(likeJob(currentJob));
      try {
        likeJobData.jobId = currentJob.id;
        likeJobData.userId = user.id;
        likeJobData.companyId = currentJob.company.id;
        if (currentIndex < jobs.length) {
          translateX.value = withSpring(hiddenTranslate);
          // runOnJS(onSwipeLeft)();
          runOnJS(setCurrentIndex)(currentIndex + 1);
        }
        await api.post('/job/like', likeJobData);
        const res = await api.get(`/likes/user/${user.id}`);
        dispatch(setMatchingIds(res.data));
      } catch (error) {
        console.log('LikeJobError', error);
      }
    } else {
      if (currentUserIndex < users.length) {
        translateX.value = withSpring(hiddenTranslate);
        // runOnJS(onSwipeLeft)();
        runOnJS(setCurrentUserIndex)(currentUserIndex + 1);
      }
      await api.post(`/companylikes/create/${company.id}/${currentUser.id}`);
    }
  };
  const nope = () => {
    if (user.role === 'USER') {
      if (currentIndex < jobs.length) {
        translateX.value = withSpring(-hiddenTranslate);
        runOnJS(onSwipeLeft)();
        runOnJS(setCurrentIndex)(currentIndex + 1);
      }
    } else {
      if (currentUserIndex < users.length) {
        translateX.value = withSpring(-hiddenTranslate);
        runOnJS(onSwipeLeft)();
        runOnJS(setCurrentUserIndex)(currentUserIndex + 1);
      }
    }
  };
  const back = () => {
    if (user.role === 'USER') {
      if (currentIndex > 0) {
        translateX.value = withSpring(hiddenTranslate);
        setCurrentIndex(currentIndex - 1);
      }
    } else {
      if (currentUserIndex > 0) {
        translateX.value = withSpring(hiddenTranslate);
        setCurrentUserIndex(currentUserIndex - 1);
      }
    }
  };

  //fetch company case logged user is admin
  const fetchCompanyUsers = useCallback(async () => {
    try {
      const res = await api.get(`/company/admin/${user.id}`);
      if (res.status === 200) {
        dispatch(setCompany(res.data));
      }
    } catch (error) {}
  }, [dispatch, user]);

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      fetchCompanyUsers();
    }
  }, [fetchCompanyUsers, user]);

  //fetchLikes for admin use
  const fetchLikeIds = async () => {
    try {
      const response = await api.get(`/likes/company/${company.id}`);
      console.log('IDS', response.data);
      dispatch(setMatchingIds(response.data));
    } catch (error) {}
  };
  useEffect(() => {
    if (user.role === 'ADMIN') {
      fetchLikeIds();
    }
  }, []);
  
 

  return (
    <View style={styles.outerView}>
      <GestureHandlerRootView style={styles.container}>
        {user && user.role === 'USER' ? (
          <>
            {jobs.length > 0 ? (
              <View style={styles.stackContainer}>
                {nextJob && (
                  
                  <View style={styles.nextCard}>

                    <Animated.View style={[styles.animatedCard, nextCardStyle]}>
                      {isDataLoaded && <JobCard data={nextJob} />}
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
                          <JobCard data={currentJob} />
                        </>
                      )}
                    </Animated.View>
                  </PanGestureHandler>
                )}
              </View>
            ) : (
              <PanGestureHandler onGestureEvent={gestureHandler}>
                <Animated.View style={styles.stackContainer}>
                  <Text style={styles.adminCardText}>{util.noJobsAvailable}</Text>
                </Animated.View>
              </PanGestureHandler>
            )}
          </>
        ) : (
          <>
            {users.length > 0 ? (
              <View style={styles.stackContainer}>
                {nextUser && (
                  <View style={styles.nextCard}>
                    <Animated.View style={[styles.animatedCard, nextCardStyle]}>
                      {isDataLoaded && <UserCard user={nextUser}  />}
                    </Animated.View>
                  </View>
                )}
                {currentUser && (
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
                          <UserCard user={currentUser} />
                        </>
                      )}
                    </Animated.View>
                  </PanGestureHandler>
                )}
              </View>
            ) : (
              <PanGestureHandler onGestureEvent={gestureHandler}>
                <Animated.View style={styles.stackContainer}>
                  <Text style={styles.adminCardText}>No Users available!</Text>
                </Animated.View>
              </PanGestureHandler>
            )}
          </>
        )}
        <View style={styles.icons}>
          <TouchableOpacity
            onPress={back}
            style={[
              styles.button,
              {backgroundColor: GlobalStyles.colors.orange},
            ]}>
            <View style={[styles.holder, {width: 45, height: 45}]}>
              <Font
                name="mail-reply"
                size={40}
                color={GlobalStyles.colors.white}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={nope}
            style={[styles.button, {backgroundColor: GlobalStyles.colors.red}]}>
            <View style={[styles.holder, {width: 45, height: 45}]}>
              <Ent name="cross" size={40} color={GlobalStyles.colors.white} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={like}
            style={[
              styles.button,
              {backgroundColor: GlobalStyles.colors.green},
            ]}>
            <View style={[styles.holder, {width: 45, height: 45}]}>
              <Icon name="heart" size={40} color={GlobalStyles.colors.white} />
            </View>
          </TouchableOpacity>
          
        </View>
        {isRefreshing && <RefreshModal isRefreshing={isRefreshing} />}
      </GestureHandlerRootView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.white,
    paddingTop: 8,
  },
  outerView: {
    height: '100%',
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
  emptyCard: {
    backgroundColor: GlobalStyles.colors.red,
  },

  like: {
    width: 100,
    height: 100,
    position: 'absolute',
    top: 10,
    zIndex: 1,
  },
  icons: {
    justifyContent: 'space-around',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 50,
  },
  button: {
    backgroundColor: GlobalStyles.colors.white,
    borderRadius: 50,
    padding: 7,
    elevation: 10,
  },
  holder: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tap: {
    width: '100%',
    height: '100%',
  },

  //admin

  adminContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swiperContainer: {
    width: '100%',
  },
  adminCard: {
    backgroundColor: GlobalStyles.colors.white,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    flex: 1,
  },
  adminCardText: {
    fontSize: 24,
    fontFamily: 'Medium',
    color: GlobalStyles.colors.txtColor,
  },
});
