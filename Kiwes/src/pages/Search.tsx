import React, {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchHeader from '../components/search/SearchHeader';
import {apiServer} from '../utils/metaData';
import {RESTAPIBuilder} from '../utils/restapiBuilder';
import {SafeAreaView} from 'react-native-safe-area-context';
import BoardList from '../components/BoardList';
import InitSearch from '../components/search/initSerch';
import {Image, Keyboard, Pressable, StyleSheet, View} from 'react-native';
import {height} from '../global';
import ListComponent from '@components/atoms/ListComponent';
import Text from '@components/atoms/Text';
import {useFocusEffect} from '@react-navigation/native';

export default function Search({navigation}: any) {
  const [init, setInit] = useState(true);
  const [searchKeyward, SetSearchKeyward] = useState();
  const [recommand, setRecommand] = useState([]);
  let url = `${apiServer}/api/v1/search?keyword=${searchKeyward}&cursor=`;
  const doSearch = async (search: String) => {
    SetSearchKeyward(search);
    setInit(false);
    let temp = await AsyncStorage.getItem('search');
    const keywords = temp ? JSON.parse(temp) : [];

    if (keywords.length > 0) {
      const first = keywords.shift();
      keywords.unshift(first);

      if (first == search) {
        return;
      }
    }

    if (keywords.length > 2) {
      keywords.pop();
    }

    await AsyncStorage.setItem('search', JSON.stringify([search, ...keywords]));
  };
  const getRecommand = async () => {
    const url = `${apiServer}/api/v1/club/popular`;
    const {data} = await new RESTAPIBuilder(url, 'GET')
      .setNeedToken(true)
      .build()
      .run()
      .catch(err => {
        console.log('err4 : ', err);
      });
    setRecommand(data.slice(2));
  };
  const navigateToClub = (clubId: any) => {
    navigation.navigate('ClubDetail', {clubId: clubId});
  };
  useFocusEffect(
    useCallback(() => {
      getRecommand();
      return () => {};
    }, []),
  );
  // eslint-disable-next-line react/no-unstable-nested-components
  const Nothing = () => {
    return (
      <View style={styles.container}>
        <View>
          <Image
            source={{
              uri: 'https://kiwes2-bucket.s3.ap-northeast-2.amazonaws.com/main/noSearch.png',
            }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={styles.recommandContainer}>
          <Text style={styles.title}>추천 모임</Text>
          {recommand.map((r, i) => (
            <ListComponent
              key={`recommand_${i}`}
              item={r}
              navigateToClub={navigateToClub}
              posts={recommand}
              setPosts={setRecommand}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <Pressable
      style={{flex: 1}}
      onPress={() => {
        Keyboard.dismiss();
      }}>
      <SearchHeader navigation={navigation} doSearch={doSearch} />
      {init ? (
        <InitSearch doSearch={doSearch} navigateToClub={navigateToClub} />
      ) : (
        <SafeAreaView style={{flex: 1}}>
          <BoardList
            url={url}
            navigateToClub={navigateToClub}
            Nothing={Nothing}
          />
        </SafeAreaView>
      )}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    aspectRatio: 1,
    width: '60%',
    marginTop: 10,
    marginBottom: 30,
    marginRight: 5,
  },
  recommandContainer: {
    marginLeft: 15,
    alignSelf: 'stretch',
  },
  title: {
    color: '#000000',
    fontSize: height * 16,
    fontWeight: '600',
  },
});
