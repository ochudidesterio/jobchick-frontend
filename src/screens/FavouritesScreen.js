import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import api from '../api/api';
import {setLikeJob, unlikeJob} from '../store/slices/authSlice';
import LikeJobItem from '../components/LikeJobItem';
import {GlobalStyles} from '../colors';
import {SwipeListView} from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Animated,{SlideInLeft,SlideOutRight} from 'react-native-reanimated';
import { async } from '@firebase/util';

const FavouritesScreen = () => {
  const jobs = useSelector(state => state.auth.likeJob);
  const user = useSelector(state => state.auth.user);

  const dispatch = useDispatch();
  const navigation = useNavigation()
  const [likeJobs, setLikedJobs] = useState([]);

  let data;
  useEffect(() => {
    getLikedJobs(user.id);
  }, [user.id]);

  const getLikedJobs = async id => {
    try {
      const response = await api.get(`/job/liked/${id}`);
      console.log('StateJobs', response.data);
       dispatch(setLikeJob(response.data));
      // setLikedJobs(response.data)
    } catch (error) {}
  };

  const handleRemove = async item => {
    try{
      const response =await api.delete(`/job/unlike/${user.id}/${item.id}`)
      if(response.data === "Unliked"){
        dispatch(unlikeJob(item))
      }
      console.log('Removing job:', response);
      console.log('Removing job:', item);
    }catch(error){

    }
  };
  const handleView = item => {
    data = item
     navigation.navigate('HomeStack', {screen: 'Details',params:{data}});
  };

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <LikeJobItem item={item} />
    </View>
  );

  const renderHiddenItem = ({item}) => (
    <View style={styles.hiddenItem}>
      <View style={styles.hiddenLeft}>
        <TouchableOpacity onPress={() => handleRemove(item)}>
          <Icon name="trash" size={35} color={GlobalStyles.colors.red} />
        </TouchableOpacity>
      </View>

      <View style={styles.huddenRight}>
        <TouchableOpacity onPress={() => handleView(item)}>
          <Icon name="eye" size={35} color={GlobalStyles.colors.green} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View  style={styles.container}>
      <SwipeListView
        style={styles.listConatiner}
        data={jobs}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        leftOpenValue={75} // Width of the hidden item view
        rightOpenValue={-75}
      />
      
    </View>
  );
};

export default FavouritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.white,
  },
  listConatiner: {
    backgroundColor: GlobalStyles.colors.white,
    flex: 1,
    marginTop:20
  },
  itemContainer: {
    padding: 5,
    backgroundColor: GlobalStyles.colors.white,
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 15,
  },

  hiddenItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 15,
    backgroundColor: GlobalStyles.colors.white,
  },
  hiddenLeft: {
    padding:5,
    backgroundColor: GlobalStyles.colors.white,
    borderRadius:5
  },
  huddenRight: {
    padding:5,
    backgroundColor: GlobalStyles.colors.white,
    borderRadius:5

  },
});
