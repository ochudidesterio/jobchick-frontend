import {StyleSheet, Text, View,ToastAndroid} from 'react-native';
import React, {useState, useEffect} from 'react';
import InterestItem from '../components/InterestItem';
import {useSelector} from 'react-redux';
import api from '../api/api';
import {GlobalStyles} from '../colors';

const InterestScreen = () => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [interests, setInterests] = useState([]);
    const [userInterests, setUserInterests] = useState([]);
    const user = useSelector(state => state.auth.user);
    const [selectedItemCount, setSelectedItemCount] = useState(selectedItems.length);


    const handleInterestClick = itemId => {
      if (selectedItems.includes(itemId)) {
        setSelectedItems(selectedItems.filter(item => item !== itemId));
        removeInterest(itemId);
      } else {
        if (selectedItemCount === 5) {
            // Show toast message when count is already 5
            ToastAndroid.show('You have already selected 5 interests!', ToastAndroid.SHORT);
            return;
          }
          setSelectedItems([...selectedItems, itemId]);
          addInterest(itemId);
        
      }
    };
  
    useEffect(() => {
        // Update the selected item count whenever selectedItems changes
        setSelectedItemCount(selectedItems.length);
      }, [selectedItems]);
    useEffect(() => {
      const fetchUserInterests = async () => {
        try {
          const response = await api.get(`/interests/find/${user.id}`);
          setUserInterests(response.data);
        } catch (error) {
          console.log(error);
        }
      };
  
      const fetchCategories = async () => {
        try {
          const response = await api.get('/category/get/all'); 
          if (response.status === 200) {
            setInterests(response.data);
          }
        } catch (error) {
          console.log(error);
        }
      };
  
      fetchUserInterests();
      fetchCategories();
    }, []);
  
    useEffect(() => {
      const userInterestIds = userInterests.map(interest => interest.categoryId);
      const filteredInterests = interests.filter(interest =>
        userInterestIds.includes(interest.id)
      );
      const selectedIds = filteredInterests.map(interest => interest.id);
      setSelectedItems(selectedIds);
    }, [interests, userInterests]); // Add dependencies for useEffect
  
    const addInterest = async id => {
      try {
        await api.post(`/interests/save/${user.id}/${id}`); 
      } catch (error) {
        console.log(error);
      }
    };
  
    const removeInterest = async id => {
      try {
        await api.delete(`/interests/delete/${user.id}/${id}`);
      } catch (error) {
        console.log(error);
      }
    };
  
    return (
      <View style={styles.container}>
        <View style={styles.desc}>
          <Text style={styles.txt}>
            Interests make it easier to match a job. Select at least 5 interests below.
          </Text>
          <View style={styles.countView}>
            <Text style={styles.passion}>PASSIONS</Text>
            <Text style={styles.passion}>({`${selectedItemCount}/5`})</Text>
          </View>
        </View>
        <View style={styles.interestContainer}>
          {interests.length !== 0 &&
            interests.map(interest => (
              <InterestItem
                key={interest.id}
                name={interest.name}
                onPress={() => handleInterestClick(interest.id)}
                isSelected={selectedItems.includes(interest.id)}
              />
            ))}
        </View>
      </View>
    );
  };
  
  export default InterestScreen;
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:GlobalStyles.colors.white
  },
  desc: {
    paddingHorizontal:15,
    paddingVertical:20,
    backgroundColor:GlobalStyles.colors.whiteSmoke
  },
  countView:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems: 'center',
    marginTop:15,

  },
  interestContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 15,
    flexWrap: 'wrap',
  },
  txt: {
    color: GlobalStyles.colors.txtColor,
    fontFamily: 'Bold',
    fontSize: 15,
  },
  passion: {
    color: GlobalStyles.colors.txtColor,
    fontFamily: 'Medium',
    fontSize: 13,
  },
});
