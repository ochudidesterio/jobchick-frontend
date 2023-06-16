import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import api from '../api/api';
import {setLikeJob} from '../store/slices/authSlice';
import LikeJobItem from '../components/LikeJobItem';
import { GlobalStyles } from '../colors';

const FavouritesScreen = () => {
  const jobs = useSelector(state => state.auth.likeJob);
  const user = useSelector(state => state.auth.user);

  const dispatch = useDispatch();
  const [likeJobs, setLikedJobs] = useState([]);

  useEffect(() => {
    getLikedJobs(user.id);
  }, [user.id]);

  const getLikedJobs = async id => {
    try {
      const response = await api.get(`/job/liked/${id}`);
      console.log('StateJobs', response.data);
      dispatch(setLikeJob(response.data));
    } catch (error) {}
  };

  const handleItemClick = (item) => {
    console.log('Clicked job:', item);
    // Perform any other actions you want when a job item is clicked
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemClick(item)}>
      <View style={styles.itemContainer}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style ={styles.container}>
<FlatList
    
    data={jobs}
    keyExtractor={(item) => item.id.toString()}
    renderItem={renderItem}
  />
    </View>
    
  );
};

export default FavouritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal:16,
    backgroundColor:GlobalStyles.colors.white
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  title:{
    color:GlobalStyles.colors.txtColor,
    fontFamily:"SemiBold",
    textAlign:"right"
  },
});
