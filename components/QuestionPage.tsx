import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { updateChecked, updateSelected } from '../firestore';
import { auth } from '../firebase';

const Question = ({ navigation, route }) => {
  const { currentIndex, collIndex, selected, questions, checked  } = route.params;
  const data = questions[currentIndex]
  const [user, setUser] = useState(null);
  
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  const [selectedAnswers, setSelectedAnswers] = useState(selected);
  const [answersChecked, setAnswersChecked] = useState(checked);

  useEffect(() => {
    setSelectedAnswer(selectedAnswers[currentIndex]);
    setIsAnswerChecked(answersChecked[currentIndex]);
  }, [questions, currentIndex]);

  const handleAnswerSelection = (answerNumber) => {
    setSelectedAnswer(answerNumber);
    setSelectedAnswers(prevAnswers => {
      const currentUser = auth.currentUser.uid
      const newAnswers = [...prevAnswers];
      newAnswers[currentIndex] = answerNumber;
      console.log("here, ", newAnswers)
      updateSelected(currentUser, collIndex, newAnswers)
      return newAnswers;
    });
  };

  useEffect(() => {
    const currentUser = auth.currentUser
    setUser(currentUser.uid)
  }, []);

  const handleCheckAnswer = () => {
    if (!selectedAnswer) {
      return
    }
    const currentUser = auth.currentUser.uid
    setIsAnswerChecked(true);
    setAnswersChecked(prevChecked => {
      const newChecked = [...prevChecked];
      newChecked[currentIndex] = true;
      updateChecked(currentUser, collIndex, newChecked)
      return newChecked;
    });
    
  };

  const resetAnswers = () => {
    const currentUser = auth.currentUser.uid
    setIsAnswerChecked(false)
    setSelectedAnswer(null)
    setSelectedAnswers(prevAnswers => {
      const currentUser = auth.currentUser.uid
      const newAnswers = [...prevAnswers];
      newAnswers[currentIndex] = null;
      updateSelected(currentUser, collIndex, newAnswers)
      return newAnswers;
    });
    setAnswersChecked(prevChecked => {
      const newChecked = [...prevChecked];
      newChecked[currentIndex] = false;
      updateChecked(currentUser, collIndex, newChecked)
      return newChecked;
    });
  };

  const goToNextQuestion = () => {
    navigation.navigate('Question', {
      questions: questions,
      collIndex: collIndex,
      currentIndex: currentIndex + 1,
      key: 'Question_' + (currentIndex + 1) // Set a unique key
    });
  };
  
  const goToPreviousQuestion = () => {
    navigation.navigate('Question', {
      questions: questions,
      collIndex: collIndex,
      currentIndex: currentIndex - 1,
      key: 'Question_' + (currentIndex - 1) // Set a unique key
    });
  };

  return (
    <View className='flex-col h-full'>
      <View className='h-1/6 items-center justify-center'>
        <Text className='p-6 font-bold text-xl'>{data.question}</Text>
      </View>
      <View className='h-1/2'>
        <View className="flex-1 justify-between space-y-5 p-5 shadow-lg">
          <TouchableOpacity
            className={`flex-1 justify-center items-center rounded-2xl bg-white ${isAnswerChecked && data.correct === 1 ? 'bg-green-400' : selectedAnswer === 1 && !isAnswerChecked ? 'bg-gray-300' : selectedAnswer === 1 ? 'bg-red-400' : ''}`}
            onPress={() => handleAnswerSelection(1)}
            disabled={isAnswerChecked}
          >
            <Text>{data.answer1}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 justify-center items-center rounded-2xl bg-white ${isAnswerChecked && data.correct === 2 ? 'bg-green-400' : selectedAnswer === 2 && !isAnswerChecked ? 'bg-gray-300' : selectedAnswer === 2 ? 'bg-red-400' : ''}`}
            onPress={() => handleAnswerSelection(2)}
            disabled={isAnswerChecked}
          >
            <Text>{data.answer2}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 justify-center items-center rounded-2xl bg-white ${isAnswerChecked && data.correct === 3 ? 'bg-green-400' : selectedAnswer === 3 && !isAnswerChecked ? 'bg-gray-300' : selectedAnswer === 3 ? 'bg-red-400' : ''}`}
            onPress={() => handleAnswerSelection(3)}
            disabled={isAnswerChecked}
          >
            <Text>{data.answer3}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 justify-center items-center rounded-2xl bg-white ${isAnswerChecked && data.correct === 4 ? 'bg-green-400' : selectedAnswer === 4 && !isAnswerChecked ? 'bg-gray-300' : selectedAnswer === 4 ? 'bg-red-400' : ''}`}
            onPress={() => handleAnswerSelection(4)}
            disabled={isAnswerChecked}
          >
            <Text>{data.answer4}</Text>
          </TouchableOpacity>
        </View>
      </View>
      
        <View className='w-full items-center justify-center p-5 h-[70px]'>
        {!isAnswerChecked ? (
          <View className='bg-blue-500 flex items-center justify-center rounded-full w-1/2 shadow-xl h-[50px]'>
            <Button
              title="Check Answer"
              color="#ffffff"
              onPress={handleCheckAnswer}
            />
          </View>
        ) : (
          <View className='bg-red-400 flex items-center justify-center rounded-full w-1/2 shadow-xl h-[50px]'>
            <Button
              title="Reset"
              color="#ffffff"
              onPress={resetAnswers}
            />
          </View>
        )}
        </View>
      <View className='flex-row justify-between p-5'>
      <View>
        {currentIndex > 0 && (
          <TouchableOpacity onPress={goToPreviousQuestion}>
            <Ionicons name="arrow-back" size={32} color="#374151" />
          </TouchableOpacity>
        )}
      </View>
      <View>
        {currentIndex < questions.length - 1 && (
          <TouchableOpacity onPress={goToNextQuestion}>
            <Ionicons name="arrow-forward" size={34} color="#374151" />
          </TouchableOpacity>
        )}
      </View>
      </View>
    </View>
  );
};

export default Question;
