import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {GlobalStyles} from '../colors';
import calculateTimeElapsed from '../util/timeUtils';
import api from '../api/api';
import JobRolesList from '../components/JobRolesList';
import QualificationList from '../components/QualificationList';
import CustomOutLineButton from '../components/CustomOutlineButton';

const DetailsScreen = ({route}) => {
  const [roles, setRoles] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const {data} = route.params;

  useEffect(() => {
    fetchRoles(data.id);
  }, [data.id]);
  useEffect(()=>{
    fetchQualifications(data.id)
  },[data.id])

  const fetchRoles = async id => {
    try {
      const response = await api.get(`/job/roles/${id}`);
      setRoles(response.data);
    } catch (error) {
      console.log('FetchRolesError', error);
    }
  };
  const fetchQualifications =async (id)=>{
    try{
      const response = await api.get(`/job/qualifications/${id}`)
      setQualifications(response.data)
    }catch(error){
      console.log("FetchQualificationError",error)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.jobContainer}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Image
              source={require('../images/google.png')}
              style={styles.headAvatar}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.type}>
            {data.level} | {data.type} | {data.region}
          </Text>
          <Text style={styles.salary}>{data.salary} / Year</Text>
        </View>
        
        <View style={styles.jdContainer}>
          <Text style={styles.time}>
            Posted {calculateTimeElapsed(data.timestamp)}
          </Text>
          <Text style={styles.jd}>Job Description</Text>
        </View>
        <Text style={styles.description}>{data.description}</Text>
        <JobRolesList roles={roles} />
        <QualificationList qualifications={qualifications} />
        <View style={styles.applyContainer}>
        <CustomOutLineButton title="Procced to Application" />
        </View>
      </View>
    </ScrollView>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
  },
  jobContainer: {
    paddingHorizontal: 18,
    paddingBottom:30,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GlobalStyles.colors.cream,
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
  applyContainer:{
    justifyContent:"center",
    alignItems:"center"
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
});
