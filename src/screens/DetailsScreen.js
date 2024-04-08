import {Image, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {GlobalStyles} from '../colors';
import calculateTimeElapsed from '../util/timeUtils';
import api from '../api/api';
import JobRolesList from '../components/JobRolesList';
import QualificationList from '../components/QualificationList';
import DetailScreenActions from '../components/DetailScreenActions';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector,useDispatch} from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import getLanguageObject from '../util/LanguageUtil';
import { likeJob, setMatchingIds } from '../store/slices/authSlice';

const DetailsScreen = ({route}) => {
  const [roles, setRoles] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const {data,param} = route.params;
  const language = useSelector(state=>state.auth.language)
  const util=getLanguageObject(language)
  const user = useSelector(state=>state.auth.user)
  const dispatch = useDispatch()
  const navigation = useNavigation()


  const likeJobData = {
    jobId: '',
    userId: '',
    companyId: '',
  };

  useEffect(() => {
    fetchRoles(data.id);
  }, [data.id]);
  useEffect(() => {
    fetchQualifications(data.id);
  }, [data.id]);

  const fetchRoles = async id => {
    try {
      const response = await api.get(`/job/roles/${id}`);
      setRoles(response.data);
    } catch (error) {
      console.log('FetchRolesError', error);
    }
  };
  const fetchQualifications = async id => {
    try {
      const response = await api.get(`/job/qualifications/${id}`);
      setQualifications(response.data);
    } catch (error) {
      console.log('FetchQualificationError', error);
    }
  };

  const viewLikedJobs = async ()=>{
    try {
    
      if(param !== undefined){
        let userParam = param
        navigation.navigate("likedJobs",{userParam})

      }
    } catch (error) {
      
    }
  }
  const like = async () => {
   try {
     if(user.role === "USER"){
      dispatch(likeJob(data));
      likeJobData.jobId = data.id;
      likeJobData.userId = user.id;
      likeJobData.companyId = data.company.id;
      await api.post('/job/like', likeJobData);
      const res =await api.get(`/likes/user/${user.id}`)
      dispatch(setMatchingIds(res.data))
     }else{
      if(param !== undefined){
        let userParam = param
        navigation.navigate("likedJobs",{userParam})

      }
     }

     
     
   } catch (error) {
     console.log('Error', error);
   }
 };

 const chat = () => {
  let id;
  let name;
    id = data.company.adminId;
    name = data.company.name;
  
    if(id !== null){
      navigation.navigate('chats', {user: user, id: id, name: name});
    }else{
      ToastAndroid.show("Company admin not available",ToastAndroid.SHORT)
    }
  
};
  const back = async ()=>{
    navigation.navigate('Home')
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.jobContainer}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Image
              source={
                data.company.logoUrl !== null
                  ? {uri: data.company.logoUrl}
                  : require('../images/google.png')
              }
              style={styles.headAvatar}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.company}>({data.company.name})</Text>
          <Text style={styles.type}>
            {data.level} | {data.type} | {data.region}
          </Text>
          <Text style={styles.salary}>{data.salary}₪</Text>
        </View>

        <View style={styles.jdContainer}>
        <Text style={styles.jd}>{util.jobDesc}</Text>
          <Text style={styles.time}>
            {util.posted} {calculateTimeElapsed(data.timestamp,util.hr,util.min,util.sec,util.s,util.ago,util.day)}
          </Text>
         
        </View>
        <Text style={styles.description}>{data.description}</Text>
        <JobRolesList roles={roles} />
        <QualificationList qualifications={qualifications} />
        {/* <View style={styles.applyContainer}>
          <DetailScreenActions  like={like} nope={back} jobs={viewLikedJobs}  />
        </View> */}
        
      </ScrollView>
      <TouchableOpacity onPress={chat} style={styles.fabContainer}>
          <Icon name="chatbubble-ellipses"  color={GlobalStyles.colors.white} size={45} />
        </TouchableOpacity>
    </View>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:GlobalStyles.colors.white
  },
  jobContainer: {
    paddingHorizontal: 26,
    paddingBottom: 20,
  },
  avatar: {
    width: "100%",
    height: 130,
    // borderRadius: 130 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom:20
  },
  headAvatar: {
    width: '100%',
    height: '100%',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  applyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    color: GlobalStyles.colors.txtColor,
    fontFamily: 'SemiBold',
    textAlign: 'justify',
    fontSize: 15,
  },
  title: {
    color: GlobalStyles.colors.txtColor,
    fontFamily: 'ExtraBold',
    fontSize: 20,
    textAlign: 'center',
  },
  type: {
    fontFamily: 'SemiBold',
    color: GlobalStyles.colors.txtColor,
  },
  company: {
    fontFamily: 'SemiBold',
    color: GlobalStyles.colors.colorPrimaryDark,
  },
  salary: {
    fontFamily: 'Medium',
    color: GlobalStyles.colors.txtColor,
    fontSize: 15,
  },
  time: {
    color: GlobalStyles.colors.green,
    fontFamily: 'Medium',
    textAlign: 'right',
  },
  jd: {
    color: GlobalStyles.colors.txtColor,
    fontFamily: 'Bold',
    fontSize: 16,
  },
  jdContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  fabContainer: {
    backgroundColor: GlobalStyles.colors.green,
    borderRadius: 50,
    position:"absolute",
    justifyContent:"center",
    alignItems:"center",
    right:15,
    bottom:30,
    height:60,
    width:60,
    },
});
