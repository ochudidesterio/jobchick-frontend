import {StyleSheet, TouchableOpacity, View, RefreshControl} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import api from '../api/api';
import {setLikeJob, setMatchingIds, unlikeJob} from '../store/slices/authSlice';
import LikeJobItem from '../components/LikeJobItem';
import {GlobalStyles} from '../colors';
import {SwipeListView} from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/Ionicons';
import Font from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import LikeUserItem from '../components/LikeUserItem';

const FavouritesScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const jobs = useSelector(state => state.auth.likeJob);
  const user = useSelector(state => state.auth.user);
  const ids = useSelector(state => state.auth.matchingIds);
  const company = useSelector(state => state.auth.company);
  const[users,setUsers] = useState([])

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const getLikedJobs = async id => {
    try {
      const response = await api.get(`/job/liked/${id}`);
      dispatch(setLikeJob(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  const getMatchingIds = async id => {
    try {
      const response = await api.get(`/likes/user/${id}`);
      dispatch(setMatchingIds(response.data));
    } catch (error) {
      console.log(error);
    }
  };
  //fetchLikes for admin use
  const fetchLikeIds = async () => {
    try {
      const response = await api.get(`/likes/company/${company.id}`);
      console.log('IDS', response.data);
      dispatch(setMatchingIds(response.data));
    } catch (error) {}
  };
  //getUsers who liked company jobs (admin)
  const getCompanyUsers = async ()=>{
    try {
      const response = await api.get(`/user/company/${company.id}`)
      console.log("Users",response.data)
      setUsers(response.data)
    } catch (error) {
      
    }
  }

  const handleRefresh = () => {
    setRefreshing(true);
    if (user.role === 'USER') {
      getLikedJobs(user.id);
      getMatchingIds(user.id);
    } else {
      fetchLikeIds();
      getCompanyUsers()
    }
    setRefreshing(false);
  };

  useEffect(() => {
    if (user.role === 'USER') {
      getLikedJobs(user.id);
      getMatchingIds(user.id);
    } else {
      fetchLikeIds();
      getCompanyUsers()
    }
  }, []);

  const handleRemove = async item => {
    try {
      const response = await api.delete(`/job/unlike/${user.id}/${item.id}`);
      if (response.data === 'Unliked') {
        dispatch(unlikeJob(item));
      }

    } catch (error) {
      console.log(error);
    }
  };

  const handleView = item => {
    data = item;
    navigation.navigate('HomeStack', {screen: 'Details', params: {data}});
  };
  const handleUnLike =item=>{

  }
  const handleViewUser = item =>{
    let user;
    user = item;
    navigation.navigate('HomeStack', {screen: 'UserDetails', params: {user}});

  }
  const adminUnlikeUser = async (item)=>{
    try {
      const response  = await api.post(`/likes/admin/unlike/${item.id}/${company.id}`)
      console.log("Res",response.data)
    } catch (error) {
      
    }
  }

  // const renderItem = ({ item }) => {
  //   const likedJob = ids.find(job => job.userId === user.id && job.jobId === item.id);

  //   return (
  //     <View style={styles.itemContainer}>
  //       <LikeJobItem item={item} isGrey={!likedJob || !likedJob.likedBack} />
  //     </View>
  //   );
  // };

  const renderItem = ({item}) => {
    const likedJob = ids.find(
      job => job.userId === user.id && job.jobId === item.id,
    );

    const isLikedBack = likedJob && likedJob.likedBack;

    return (
      <View style={styles.itemContainer}>
        <LikeJobItem item={item} isGrey={!isLikedBack} />
      </View>
    );
  };

  // Sort jobs based on whether they have been liked back or not
  const sortedJobs = [...jobs].sort((a, b) => {
    const aLikedJob = ids.find(
      job => job.userId === user.id && job.jobId === a.id,
    );
    const bLikedJob = ids.find(
      job => job.userId === user.id && job.jobId === b.id,
    );

    const aIsLikedBack = aLikedJob && aLikedJob.likedBack;
    const bIsLikedBack = bLikedJob && bLikedJob.likedBack;

    if (aIsLikedBack && !bIsLikedBack) {
      return -1; // a comes first
    } else if (!aIsLikedBack && bIsLikedBack) {
      return 1; // b comes first
    } else {
      return 0; // order remains the same
    }
  });

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

  const renderUserItem = ({item}) => {

    const hasLikedBack = ids.some(
      (job) => job.userId === item.id && job.companyId === company.id && job.likedBack
    );

    return (
      <View style={styles.itemContainer}>
        <LikeUserItem item={item}isGrey={!hasLikedBack}/>
      </View>
    );
  };

  const renderHiddenUserItem = ({item}) =>{

    const hasLikedBack = ids.some(
      (job) => job.userId === item.id && job.companyId === company.id && job.likedBack
    );
    
    return(

    
    <View style={styles.hiddenItem}>
      <View style={styles.hiddenLeft}>
        <TouchableOpacity onPress={hasLikedBack ? () => adminUnlikeUser(item) : ()=>{}}>
          <Font name={hasLikedBack ? "heart" : "heart-o"} size={35} color={hasLikedBack ? GlobalStyles.colors.red : GlobalStyles.colors.txtColor} />
        </TouchableOpacity>
      </View>

      <View style={styles.huddenRight}>
        <TouchableOpacity onPress={() => handleViewUser(item)}>
          <Icon name="eye" size={35} color={GlobalStyles.colors.green} />
        </TouchableOpacity>
      </View>
    </View>
  )};

  return (
    <View style={styles.container}>
      {user && user.role === 'USER' && sortedJobs ? (
        <SwipeListView
          style={styles.listContainer}
          data={sortedJobs}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          leftOpenValue={75} // Width of the hidden item view
          rightOpenValue={-75}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      ) : (
        <>
        {users && <SwipeListView
          style={styles.listContainer}
          data={users}
          keyExtractor={item => item.id.toString()}
          renderItem={renderUserItem}
          renderHiddenItem={renderHiddenUserItem}
          leftOpenValue={75} // Width of the hidden item view
          rightOpenValue={-75}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />}
        </>
      )}
    </View>
  );
};

export default FavouritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.white,
  },
  listContainer: {
    backgroundColor: GlobalStyles.colors.white,
    flex: 1,
    marginTop: 20,
  },
  itemContainer: {
    padding: 5,
    backgroundColor: GlobalStyles.colors.white,
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 1,
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
    padding: 5,
    backgroundColor: GlobalStyles.colors.white,
    borderRadius: 5,
  },
  huddenRight: {
    padding: 5,
    backgroundColor: GlobalStyles.colors.white,
    borderRadius: 5,
  },
});
