import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  RefreshControl,
  SafeAreaView,
  Linking
} from 'react-native';
import Slider from '@react-native-community/slider';
import React, {useEffect, useState} from 'react';
import {CommonActions} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {logout, setSetting} from '../store/slices/authSlice';
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
import RefreshModal from '../components/RefreshModal';
import Animated, {StretchInY} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import {MultipleSelectList} from 'react-native-dropdown-select-list';


const SettingsScreen = ({navigation}) => {
  const language = useSelector(state => state.auth.language);
  const user = useSelector(state => state.auth.user);
  const util = getLanguageObject(language);
  const dispatch = useDispatch();

  const [jobTypes, setJobTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checkedJobTypes, setCheckedJobTypes] = useState([]);
  const [distance, setDistanceValue] = useState(0);
  const [age, setAgeValue] = useState(0);
  const [premium, setPremium] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [selectedCategoryValues,setSelectedCategoryValues]=useState([])


 
  const navigateToPrivacyPolicy = () => {
    navigation.navigate('privacyPolicy');
  };

  const navigateToTermsOfService = () => {
    navigation.navigate('termsOfService');
  };
  const initPayment =async()=>{
    console.log("Init Payment",premium[0].price)
    try{
      const response = await api.post(`/paypal/init?sum=${premium[0].price}`)
      console.log("Payment",response.data)
      if(response.data.status === "success"){
        let data = response.data
          navigation.navigate("payment",{data:data,userId:user.id,amount:premium[0].price})
      }
      }catch(error){
      
      }
  }

 

  const handleRefresh = () => {
    setRefreshing(true);
    // Fetch your data here
    getPremium(); // For example, fetching premium data
    getUserSettings();
    fetchCategories()
    setRefreshing(false); // After fetching data, turn off refreshing
  };

  const getUserSettings = async () => {
    try {
      const response = await api.get(`/setting/get/${user.id}`);
      if (
        response.data &&
        response.data.jobTypes !== null &&
        response.data.jobTypes.length > 0
      ) {
        // Collect the job type IDs and set them to checkedJobTypes
        const jobTypeIds = response.data.jobTypes.map(jobType => jobType.id);
        setCheckedJobTypes(jobTypeIds);
      }
      setDistanceValue(response.data.distance);
      setAgeValue(response.data.age);
      dispatch(setSetting(response.data));
    } catch (error) {
      console.log('Error fetching setting', error);
    }
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

  const fetchCategories = async () => {
    try {
      const response = await api.get('/category/get/all');

      if (response.status === 200) {
        setCategories(response.data);
        let categoriesArray = response.data.map((cat) => {
          return {key: cat.id, value: cat.name};
        });
        setCategoryData(categoriesArray)
      }
    } catch (error) {
      console.log('Error fetching categories', error);
    }
  };
  useEffect(() => {
    getUserSettings();
    fetchCategories();
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
  const handleSave = async () => {
    setIsLoading(true);

    const settingObject = {
      userId: user.id,
      distance: distance,
      age: age,
      jobTypeIds: checkedJobTypes,
      categoryIds: selectedCategoryValues
    };

    try {
      console.log("OBJ",settingObject)
     const response = await api.post('/setting/create', settingObject);
       if (response.status === 200) {
         setIsLoading(false);
        navigation.navigate('Home');
       }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
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

  const getPremium = async () => {
    try {
      const res = await api.get('/premium/get/all');
      setPremium(res.data);
    } catch (error) {}
  };
  useEffect(() => {
    getPremium();
  }, []);



  return (
    <SafeAreaView style={styles.safearea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        <Animated.View entering={StretchInY.duration(1000)}>
          <View style={styles.language}>
            <SwitchButton />
          </View>
          {user && user.role === 'USER' && (
            <>
              <View style={styles.distance}>
                <Text style={styles.distanceHeader}>{util.distanceRange}</Text>
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
            </>
          )}
          {user && user.role === 'ADMIN' && (
            <>
              <View style={styles.distance}>
                <Text style={styles.distanceHeader}>{util.ageRange}</Text>
              </View>
              <View style={styles.valueView}>
                <Text style={styles.sliderValue}>{0}</Text>
                <Text style={styles.sliderValue}>{age} {util.yrs}</Text>
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
            <>
              
             {categoryData.length > 0 &&  <View style={styles.categoryView}>
             <Text style={styles.category}>{util.jobCategories}</Text>

              <MultipleSelectList
            label={util.selectedCategories}
            labelStyles={{color: GlobalStyles.colors.txtColor}}
            setSelected={val => setSelectedCategoryValues(val)}
            placeholder={<Text style={styles.txt}>{util.selectCategories}</Text>}
            
           data={categoryData}
           
            dropdownTextStyles={{color: GlobalStyles.colors.txtColor}}
            boxStyles={{
              borderColor: GlobalStyles.colors.border,
              borderWidth: 0.5,
            }}
            arrowicon={
              <Icon
                name="chevron-down"
                color={GlobalStyles.colors.txtColor}
                size={20}
              />
            }
            maxHeight={250}
             save="key"
            fontFamily="Medium"
            inputStyles={{color: GlobalStyles.colors.green}}
            badgeStyles={{
              backgroundColor: GlobalStyles.colors.colorPrimaryDark,
            }}
            notFoundText="category not found"
          />
              </View>}
              <View style={styles.jobTypes}>
                <Text style={styles.distanceHeader}>{util.jobTypes}</Text>
                <View style={styles.typesContainer}>
                  {jobTypes.map(jobType => renderJobTypeItem(jobType))}
                </View>
              </View>
            </>
          )}
          <View style={styles.save}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>{util.updateProfile}</Text>
            </TouchableOpacity>
          </View>
          <PremiumView
            premium={premium}
            onPress={initPayment}
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

          <TouchableSettingItem onPress={navigateToTermsOfService} text={util.termsOfService} />
          <View style={styles.line} />

          <TouchableSettingItem onPress={navigateToPrivacyPolicy} text={util.privacyPolicy} />
          <View style={styles.line} />
          <View style={styles.actions}>
            <SettingButton
              txt={util.deletAccount}
              color={GlobalStyles.colors.red}
            />

            <SettingButton
              txt={util.logout}
              onPress={handleLogout}
              color={GlobalStyles.colors.txtColor}
            />
          </View>

          {isLoading && <RefreshModal isRefreshing={isLoading} />}
         
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  safearea: {
    backgroundColor: GlobalStyles.colors.white,
  },
  container: {
    flexGrow: 1,
    paddingBottom: 20,
    backgroundColor: GlobalStyles.colors.white,
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
  },
  typesContainer: {
    marginTop: 10,
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
    fontFamily: 'SemiBold',
    fontSize: 16,
    textAlign: 'left',
  },
  category: {
    color: GlobalStyles.colors.txtColor,
    fontFamily: 'SemiBold',
    fontSize: 16,
    textAlign: 'left',
    marginBottom:10,
  },
  distance: {
    marginHorizontal: 20,
    marginVertical: 2,
  },
  categoryView: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
  txt: {
    color: GlobalStyles.colors.txtColor,
    textAlign: 'left',
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
    marginTop: 10,
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
  dropdownContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  dropdownTrigger: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownItem: {
    borderWidth: 0.5,
    borderColor: GlobalStyles.colors.border,
    backgroundColor: GlobalStyles.colors.white,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end', // This positions the modal at the bottom
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '50%', // Adjust this value as needed
  },
});
