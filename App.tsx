import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Collection from './components/Collection';
import Explore from './components/Explore';
import Settings from './components/Settings';
import Question from './components/QuestionPage';
import Login from './components/Login';
import { auth } from './firebase';


const HomeStack = createStackNavigator();
const ExploreStack = createStackNavigator();
const SettingsStack = createStackNavigator();

const defaultHeaderStyle = {
  backgroundColor: 'rgb(30, 41, 59)',
};

const defaultHeaderTitleStyle = {
  color: 'white',
};

const HomeStackScreen = () => (
  <HomeStack.Navigator
    screenOptions={{
      headerStyle: defaultHeaderStyle,
      headerTitleStyle: defaultHeaderTitleStyle,
      headerBackTitleStyle: defaultHeaderTitleStyle,
    }}
  >
    <HomeStack.Screen name="Home" component={Home} />
    <HomeStack.Screen name="Collection" component={Collection} />
    <HomeStack.Screen name="Question" component={Question}/>
  </HomeStack.Navigator>
);

const ExploreStackScreen = () => (
  <ExploreStack.Navigator
    screenOptions={{
      headerStyle: defaultHeaderStyle,
      headerTitleStyle: defaultHeaderTitleStyle,
      headerBackTitleStyle: defaultHeaderTitleStyle, 
    }}
  >
    <ExploreStack.Screen name="Explore" component={Explore} />
  </ExploreStack.Navigator>
);

const SettingsStackScreen = () => (
  <SettingsStack.Navigator
    screenOptions={{
      headerStyle: defaultHeaderStyle,
      headerTitleStyle: defaultHeaderTitleStyle,
      headerBackTitleStyle: defaultHeaderTitleStyle, 
    }}
  >
    <SettingsStack.Screen name="Settings" component={Settings} />
  </SettingsStack.Navigator>
);

export default function App() {
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('home');
  const handleScreenChange = (screen: string) => {
    setCurrentScreen(screen);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log(user)
      setUser(user);
    });

    return unsubscribe;
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeStackScreen />;
      case 'explore':
        return <ExploreStackScreen />;
      case 'settings':
        return <SettingsStackScreen />;
      default:
        return null;
    }
  };

  return (
    <NavigationContainer>
      {user ? (
      <View className='flex-1'>
        <View className='flex-1'>
          {renderScreen()}
        </View>
        <View className="flex-row justify-around items-center h-[85px] absolute bottom-0 left-0 right-0">
          <Navbar onScreenChange={handleScreenChange}/>
        </View>
      </View>
      ) : (
        <Login/>
      )}
    </NavigationContainer> 
  );
}
