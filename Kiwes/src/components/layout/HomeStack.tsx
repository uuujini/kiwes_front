import React, {useEffect} from 'react';
import {Dimensions, Image, TouchableOpacity, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatRoom from '../../pages/ChatRoom';
import Home from '../../pages/Home';
import ClubDetail from '../../pages/ClubDetail';
import ClubCategory from '../../pages/ClubCategory';
import ClubLanguage from '../../pages/ClubLanguage';
import ReviewPage from '../../pages/ReviewPage';
import Event from '../../pages/Event';
import Icon from 'react-native-vector-icons/Ionicons';
import {height, width} from '@/global';
import {useSelector} from 'react-redux';
import {RootState} from '@/slice/RootReducer';
import {LANGUAGE} from '@/utils/utils';

const HomeStack = ({navigation}) => {
  const language = useSelector((state: RootState) => state.language);

  useEffect(() => {
    checkLoginState();
  }, []);
  const checkLoginState = async () => {
    const userData = await AsyncStorage.getItem('userdata');
    console.log(userData);
  };

  const Stack = createStackNavigator();

  const CustomHeader = () => (
    <Image
      source={require('../../../assets/images/kiwesLogo.png')}
      style={{width: 130, height: 60, top: 2}}
    />
  );

  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: true,
          headerTitle: props => <CustomHeader {...props} />,
          headerRight: () => (
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={{marginRight: 17, marginTop: height * 5}}
                onPress={() => navigation.navigate('Search')}>
                <Icon
                  name="search-outline"
                  size={30}
                  style={{color: 'black'}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginRight: 17, marginTop: height * 5}}
                onPress={() => navigation.navigate('AlarmPage')}>
                <Icon
                  name="notifications-outline"
                  size={30}
                  style={{color: 'black'}}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="ClubDetail"
        component={ClubDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ClubCategory"
        component={ClubCategory}
        options={{
          headerShown: true,
          headerTitle:
            language.language == LANGUAGE.KO ? '카테고리별 모임' : 'Category',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="ClubLanguage"
        component={ClubLanguage}
        options={{
          headerShown: true,
          headerTitle:
            language.language == LANGUAGE.KO ? '언어별 모임' : 'Language',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="ReviewPage"
        component={ReviewPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoom}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Event"
        component={Event}
        options={{
          headerShown: true,
          headerTitle: language.language == LANGUAGE.KO ? '이벤트' : 'Event',
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
