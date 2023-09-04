import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  RefreshControl
} from 'react-native';
import Slider from '@react-native-community/slider';
import React, {useEffect, useState} from 'react';
import {CommonActions} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {logout} from '../store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SwitchButton from '../components/SwitchButton';
import {useSelector} from 'react-redux';
import getLanguageObject from '../util/LanguageUtil';
import PremiumView from '../components/PremiumView';
import {GlobalStyles} from '../colors';
import TouchableSettingItem from '../components/TouchableSettingItem';
import SettingButton from '../components/SettingButton';
import HideProfileSwitch from '../components/HideProfileSwitch';
import api from '../api/api';

const SettingsScreen = ({navigation}) => {
  const language = useSelector(state => state.auth.language);
  const user = useSelector(state => state.auth.user);
  const util = getLanguageObject(language);
  const dispatch = useDispatch();

  const [jobTypes, setJobTypes] = useState([]);
  const [checkedJobTypes, setCheckedJobTypes] = useState([]);
  const [distance, setDistanceValue] = useState(0);
  const [age, setAgeValue] = useState(0);
  const [premium,setPremium] = useState([])
  const [refreshing, setRefreshing] = useState(false);


  const handleRefresh = () => {
    setRefreshing(true);
    // Fetch your data here
    getPremium(); // For example, fetching premium data
    setRefreshing(false); // After fetching data, turn off refreshing
  };


  useEffect(() => {
    api
      .get('/type/all')
      .then(res => {
        if (Array.isArray(res.data)) {
          setJobTypes(res.data);
        } else {
          console.error('API returned invalid job types data:', data);
        }
      })
      .catch(error => console.error('Error fetching job types:', error));
  }, []);

  // Function to toggle the job type checkbox state
  const toggleJobType = id => {
    const index = checkedJobTypes.indexOf(id);
    if (index === -1) {
      setCheckedJobTypes([...checkedJobTypes, id]);
    } else {
      const updatedJobTypes = [...checkedJobTypes];
      updatedJobTypes.splice(index, 1);
      setCheckedJobTypes(updatedJobTypes);
    }
  };
  const handleSave = () => {
    console.log('Checked Job Types IDs:', checkedJobTypes);
    console.log('Distance', distance);
    console.log('Age', age);
  };

  const renderJobTypeItem = jobType => {
    const isChecked = checkedJobTypes.includes(jobType.id);
    return (
      <TouchableOpacity
        key={jobType.id}
        style={styles.jobTypeItem}
        onPress={() => toggleJobType(jobType.id)}>
        <View style={[styles.checkbox, isChecked && styles.checkedBox]} />
        <Text style={styles.jobTypeName}>{jobType.name}</Text>
        {/* Apply the styles.checkedBox when the checkbox is checked */}
      </TouchableOpacity>
    );
  };

  const handleLogout = () => {
    dispatch(logout());
    AsyncStorage.clear();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'SplashScreen'}],
      }),
    );
  };

    const getPremium = async()=>{
        try {
           const res = await api.get("/premium/get/all")
           setPremium(res.data)
        } catch (error) {
            
        }
    }
    useEffect(()=>{
        getPremium()
    },[])


  return (
    <ScrollView contentContainerStyle={styles.container}
    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh}/>} 
    >
      <View style={styles.language}>
        <SwitchButton />
      </View>
      <View style={styles.distance}>
        <Text style={styles.distanceHeader}>Distance Range</Text>
      </View>
      <View style={styles.valueView}>
        <Text style={styles.sliderValue}>{0}</Text>
        <Text style={styles.sliderValue}>{distance} km</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={distance}
        onValueChange={value => setDistanceValue(value)}
        minimumTrackTintColor={GlobalStyles.colors.colorPrimaryDark}
        maximumTrackTintColor={GlobalStyles.colors.green}
        thumbTintColor={GlobalStyles.colors.colorPrimaryDark}
      />
      {user && user.role === 'ADMIN' && (
        <>
          <View style={styles.distance}>
            <Text style={styles.distanceHeader}>Age Range</Text>
          </View>
          <View style={styles.valueView}>
            <Text style={styles.sliderValue}>{0}</Text>
            <Text style={styles.sliderValue}>{age} years</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={age}
            onValueChange={value => setAgeValue(value)}
            minimumTrackTintColor={GlobalStyles.colors.colorPrimaryDark}
            maximumTrackTintColor={GlobalStyles.colors.green}
            thumbTintColor={GlobalStyles.colors.colorPrimaryDark}
          />
        </>
      )}
      {user && user.role === 'USER' && (
        <View style={styles.jobTypes}>
          {jobTypes.map(jobType => renderJobTypeItem(jobType))}
        </View>
      )}
      <View style={styles.save}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>SAVE</Text>
        </TouchableOpacity>
      </View>
      <PremiumView premium={premium}
        color={
          user.role === 'USER'
            ? GlobalStyles.colors.premium
            : GlobalStyles.colors.adminPrem
        }
      />
      {user && user.role === 'USER' && (
        <>
          <View style={styles.showProfile}>
            <HideProfileSwitch id={user.id} />
          </View>
          <View style={styles.line} />
        </>
      )}

      <TouchableSettingItem text="TERMS OF SERVICE" />
      <View style={styles.line} />

      <TouchableSettingItem text="PRIVACY POLICY" />
      <View style={styles.line} />
      <View style={styles.actions}>
        <SettingButton txt="DELETE ACCOUNT" color={GlobalStyles.colors.red} />

        <SettingButton
          txt={util.logout}
          onPress={handleLogout}
          color={GlobalStyles.colors.txtColor}
        />
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  language: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
  line: {
    height: 1,
    marginVertical: 8,
    backgroundColor: GlobalStyles.colors.edit,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 20,
  },
  showProfile: {
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 15,
  },
  jobTypes: {
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 20,
  },
  jobTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  jobTypeName: {
    color: GlobalStyles.colors.txtColor,
    fontFamily: 'Medium',
  },
  distanceHeader: {
    color: GlobalStyles.colors.txtColor,
    fontFamily: 'Bold',
    fontSize: 16,
    textAlign:"left"

  },
  distance: {
    marginHorizontal: 20,
    marginVertical: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: GlobalStyles.colors.colorPrimaryDark,
    borderRadius: 2,
    marginRight: 10,
  },
  checkedBox: {
    backgroundColor: GlobalStyles.colors.colorPrimaryDark,
  },
  saveButton: {
    backgroundColor: GlobalStyles.colors.green,
    paddingVertical: 10,
    borderRadius: 50,
    paddingHorizontal: 30,
    marginBottom: 20,
    width: 100,
  },
  saveButtonText: {
    color: GlobalStyles.colors.white,
    fontFamily: 'Medium',
    fontSize: 16,
  },
  save: {
    flex: 1,
    alignItems: 'flex-end',
    marginHorizontal: 20,
    marginTop:10
  },

  slider: {
    flex: 1,
    width: '100%',
  },
  sliderValue: {
    fontFamily: 'Medium',
    fontSize: 12,
    color: GlobalStyles.colors.txtColor,
  },
  valueView: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
  },
});
