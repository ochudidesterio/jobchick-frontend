import 'react-native-gesture-handler';
import {
  StyleSheet,
  Alert,
  View,
  useWindowDimensions,
  TouchableOpacity,
  ScrollView, RefreshControl
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
import {
  likeJob,
  setCompany,
  setMatchingIds,
  setUsers,
} from '../store/slices/authSlice';

import UserCard from '../cards/UserCard';

const HomeScreen = ({navigation}) => {
  const {width: screenWidth} = useWindowDimensions();
  const user = useSelector(state => state.auth.user);
  const ids = useSelector(state => state.auth.matchingIds);
  const company = useSelector(state => state.auth.company);
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const[currentUserIndex,setCurrentUserIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(currentIndex + 1);
  const [nextUserIndex,setNextUserIndex]=useState(currentUserIndex + 1)
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  let currentJob;
  let nextJob;
  let currentUser;
  let nextUser;
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
      const activeUsers = response.data.filter(user => user.showProfile === false);

      console.log("Active ",activeUsers)

      setUsers(activeUsers);
      setIsDataLoaded(true)
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

  currentJob = jobs[currentIndex];
  nextJob = jobs[nextIndex];

  if(users.length > 0){
    currentUser = users[currentUserIndex]
    nextUser = users[nextUserIndex]
  }

  const doMatching = () => {
    if (currentJob) {
      const match = ids.find(
        job => job.userId === user.id && job.jobId === currentJob.id,
      );
      if (match && match.likedBack) {
        Alert.alert(
          'Congratulations!',
          "It's a match!",
          [
            {
              text: 'Start Chat',
              onPress: () => {
                // Add code to handle the 'Start Chat' button press
                console.log('Start Chat');
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
    if(user.role === "USER"){
      console.log('JobLeft::', currentJob.title);
    }
  };
  const onSwipeRight = () => {
    if(user.role === "USER"){
      console.log('JobRight::', currentJob.title);
    }
  };

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

      if (event.velocityX > 0) {
        // Swipe Right
        translateX.value = withSpring(hiddenTranslate);
        runOnJS(onSwipeRight)(onSwipeRight);
      } else {
        // Swipe Left
        translateX.value = withSpring(-hiddenTranslate);
        runOnJS(onSwipeLeft)();
      }

      if(user.role === "USER"){
        if (currentIndex < jobs.length) {
          runOnJS(setCurrentIndex)(currentIndex + 1);
        }
      }else{
        if(currentUserIndex < users.length){
          runOnJS(setCurrentUserIndex)(currentUserIndex + 1)
        }
      }
    },
  });
  useEffect(() => {
    translateX.value = 0;
    if(user.role === "USER"){
      if (currentIndex < jobs.length) {
        setNextIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0);
        setNextIndex(currentIndex + 1);
      }
    }else{
      if(currentUserIndex < users.length){
        setNextUserIndex(currentUserIndex + 1)
      }else{
        setCurrentUserIndex(0)
        setNextUserIndex(currentUserIndex + 1)
      }
    }
  
  }, [currentIndex, translateX,currentUserIndex]);

  const likeJobData = {
    jobId: '',
    userId: '',
    companyId: '',
  };
  const chat = () =>{
    let id;
    let name;
    if(user.role === "USER"){
       id = currentJob.company.adminId
       name = currentJob.company.name
    }else{
      id = currentUser.id
      name = currentUser.firstName+" "+currentUser.lastName
    }
    navigation.navigate("chats",{user:user,id:id,name:name})

  }
  const like = async () => {
    if (user.role === 'USER') {
      dispatch(likeJob(currentJob));
      try {
        likeJobData.jobId = currentJob.id;
        likeJobData.userId = user.id;
        likeJobData.companyId = currentJob.company.id;
        await api.post('/job/like', likeJobData);
        const res = await api.get(`/likes/user/${user.id}`);
        dispatch(setMatchingIds(res.data));
        if (currentIndex < jobs.length) {
          translateX.value = withSpring(-hiddenTranslate);
          runOnJS(onSwipeLeft)();
          runOnJS(setCurrentIndex)(currentIndex + 1);
        }
      } catch (error) {
        console.log('LikeJobError', error);
      }
    } else {
      
      const response = await api.post(
        `/companylikes/create/${company.id}/${currentUser.id}`
      );
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
      if (currentUserIndex< users.length) {
        translateX.value = withSpring(-hiddenTranslate);
        runOnJS(onSwipeLeft)();
        runOnJS(setCurrentUserIndex)(currentUserIndex + 1);
      }
    }
  };
  const back = () => {
    if (user.role === 'USER') {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        translateX.value = withSpring(hiddenTranslate);
      }
    } else {
      if (currentUserIndex > 0) {
        setCurrentUserIndex(currentUserIndex - 1);
        translateX.value = withSpring(hiddenTranslate);
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
<GestureHandlerRootView style={styles.container}>
      {user && user.role === 'USER' ? (
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
        
        <>
         <View style={styles.stackContainer}>
          {nextUser && (
            <View style={styles.nextCard}>
              <Animated.View style={[styles.animatedCard, nextCardStyle]}>
                {isDataLoaded && <UserCard user={nextUser} />}
              </Animated.View>
            </View>
          )}
          {currentUser &&  (
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
        </>
      )}
      <View style={styles.icons}>
        <TouchableOpacity
          onPress={back}
          style={[
            styles.button,
            {backgroundColor: GlobalStyles.colors.orange},
          ]}>
          <View style={styles.holder}>
            <Font
              name="mail-reply"
              size={25}
              color={GlobalStyles.colors.white}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={nope}
          style={[styles.button, {backgroundColor: GlobalStyles.colors.red}]}>
          <View style={[styles.holder, {width: 35, height: 35}]}>
            <Ent name="cross" size={30} color={GlobalStyles.colors.white} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={like}
          style={[styles.button, {backgroundColor: GlobalStyles.colors.green}]}>
          <View style={[styles.holder, {width: 35, height: 35}]}>
            <Icon name="heart" size={30} color={GlobalStyles.colors.white} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
        onPress={chat}
          style={[
            styles.button,
            {backgroundColor: GlobalStyles.colors.colorPrimaryLight},
          ]}>
          <View style={styles.holder}>
            <Icon
              name="chatbubble-ellipses"
              size={25}
              color={GlobalStyles.colors.white}
            />
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
    backgroundColor: GlobalStyles.colors.white,
    paddingTop: 8,
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
    paddingBottom: 16,
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
