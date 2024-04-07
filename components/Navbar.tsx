import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';


interface BottomNavigationProps {
  onScreenChange: (screen: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ onScreenChange }) => {
  const [selectedScreen, setSelectedScreen] = useState('home'); // Default selected screen is 'home'

  const handleChange = (page) => {
    onScreenChange(page);
    setSelectedScreen(page);
  };

  return (
    <View className="flex flex-row w-full h-full mb-2 justify-around items-center">
      <TouchableOpacity className={`bg-white w-1/3 h-full items-center justify-center ${selectedScreen === 'home' ? 'bg-gray-200' : ''}`} onPress={() => handleChange('home')}>
        <Ionicons name="home" size={36} color={selectedScreen === 'home' ? '#665' : 'gray'} />
      </TouchableOpacity>
      <TouchableOpacity className={`bg-white w-1/3 h-full items-center justify-center ${selectedScreen === 'explore' ? 'bg-gray-200' : ''}`} onPress={() => handleChange('explore')}>
        <Ionicons name="person" size={36} color={selectedScreen === 'explore' ? '#665' : 'gray'} />
      </TouchableOpacity>
      <TouchableOpacity className={`bg-white w-1/3 h-full items-center justify-center ${selectedScreen === 'settings' ? 'bg-gray-200' : ''}`} onPress={() => handleChange('settings')}>
        <Ionicons name="settings" size={36} color={selectedScreen === 'settings' ? '#665' : 'gray'} />
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavigation;
