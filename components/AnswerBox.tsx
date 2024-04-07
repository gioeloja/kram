// Question.js

import React from 'react';
import { View, Text, Button } from 'react-native';

interface AnswerProps {
  answerText: string; // Define the type of questionText prop as string
}

const AnswerBox: React.FC<AnswerProps> = ({ answerText }) => {
  return (
    <View className='flex-col h-full bg-green-100'>

    </View>
  );
};

export default AnswerBox;
