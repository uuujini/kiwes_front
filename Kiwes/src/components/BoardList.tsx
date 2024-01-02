import React, {useCallback, useState} from 'react';
import {View,FlatList, Image, StyleSheet, Text, TouchableOpacity, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RESTAPIBuilder } from '../utils/restapiBuilder';
import { apiServer } from '../utils/metaData';
import { useFocusEffect } from '@react-navigation/native';
import { BoardPost } from '../utils/commonInterface';
import { languageMap } from '../utils/languageMap';


const BoardList = ({navigation}: any) => {
  const url =`${apiServer}/api/v1/heart/club_list`;
  const screenHeight = Dimensions.get('window').height;
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const fetchData = async () => {
    try {
      const response = await new RESTAPIBuilder(url, 'GET')
        .setNeedToken(true)
        .build()
        .run();
      setPosts(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  useFocusEffect(
    useCallback(() => {
        fetchData();
      return () => {
        fetchData();
      };
    }, []) 
  );


  const toggleLike = async (id: String) => {
    const post = posts.find(post => post.clubId === id);
    if (!post) return;
  
    // Update state
    const updatedPosts = posts.map(post =>
      post.clubId === id ? {...post, heart: !post.heart} : post,
    );
    setPosts(updatedPosts);
    try {
    // Determine which API to call based on the new heart state
    const updatedPost = updatedPosts.find(post => post.clubId === id);
    const apiUrl = `${apiServer}/api/v1/heart/${id}`;   
      const response = await new RESTAPIBuilder(apiUrl, updatedPost.heart ? 'PUT' : 'DELETE')
        .setNeedToken(true)
        .build()
        .run();
  
      // Check response status and handle accordingly
      if (response.status !== (updatedPost.heart ? 20201:20202)) {
        throw new Error('Failed to update heart status');
      }
  
    } catch (err) {
      console.error(err);
      // If API call fails, revert state
      setPosts(
        posts.map(post =>
          post.clubId === id ? {...post, heart: post.heart} : post,
        ),
      );
    }
  };
 
  return (
    <FlatList
      data={posts}
      keyExtractor={item => item.clubId}

      onScroll={(event) => {
        // 스크롤 위치를 얻습니다.
        let scrollPosition = event.nativeEvent.contentOffset.y;
        if (scrollPosition < 0) scrollPosition = 0;
        const scrollRatio = Math.round(scrollPosition / screenHeight*10);
      }}
      renderItem={({item}) => (
      <TouchableOpacity style={styles.clubContainer}  onPress={() =>{navigation.navigate('ClubPage', {clubId: item.clubId});}}>
        <Image source={{uri: item.thumbnailImage}} style={styles.imageContainer} />

        <View style={styles.textContainer}>
          <View>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.date}</Text>
            <Text>{item.locationsKeyword}</Text>
            <Text>{item.languages.map(code => languageMap[code] || code).join(', ')}</Text>
          </View>
         
        </View>
        <TouchableOpacity style={styles.heartContainer} onPress={() => toggleLike(item.clubId)}>
            <Icon name={item.heart ? 'heart' : 'heart-o'} size={25} color="#58C047" />
        </TouchableOpacity>
      </TouchableOpacity>
    )}
  />
  );
};
const styles = StyleSheet.create({
  clubContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)', 
    marginLeft: 10, 
    marginRight: 10,
  },
  imageContainer: {
    width: 120,
    height: 100,
    borderRadius: 30,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  heartContainer: {
    alignSelf: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight :'bold',
  },
});
export default BoardList;