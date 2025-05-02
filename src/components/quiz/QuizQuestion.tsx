import React, { useState } from 'react';
import { Question, QuizAnswer } from '../../types';
import Button from '../ui/Button';

type QuizQuestionProps = {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  userAnswer?: string;
  showAnswer?: boolean;
  onAnswer: (answer: QuizAnswer) => void;
  onNextQuestion: () => void;
  onPrevQuestion: () => void;
};

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
  userAnswer,
  showAnswer = false,
  onAnswer,
  onNextQuestion,
  onPrevQuestion,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(userAnswer || '');
  
  const handleOptionSelect = (optionId: string) => {
    if (!showAnswer) {
      setSelectedOptionId(optionId);
      onAnswer({ questionId: question.id, selectedOptionId: optionId });
    }
  };
  
  const getOptionClasses = (optionId: string) => {
    let baseClasses = 'block w-full p-3 mb-2 border rounded-lg cursor-pointer transition-colors duration-200';
    
    if (showAnswer) {
      if (optionId === question.correctOptionId) {
        return `${baseClasses} bg-green-100 border-green-300 text-green-800`;
      } else if (optionId === selectedOptionId) {
        return `${baseClasses} bg-red-100 border-red-300 text-red-800`;
      }
      return `${baseClasses} bg-white border-gray-300 text-gray-500`;
    }
    
    if (optionId === selectedOptionId) {
      return `${baseClasses} bg-blue-100 border-blue-300 text-blue-800`;
    }
    
    return `${baseClasses} bg-white border-gray-300 hover:bg-gray-50 text-gray-700`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-500">
          Question {questionNumber} of {totalQuestions}
        </h3>
        <div className="w-24 bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold mb-6 text-gray-800">{question.text}</h2>
      
      <div className="mb-6 space-y-2">
        {question.options.map((option) => (
          <div
            key={option.id}
            className={getOptionClasses(option.id)}
            onClick={() => handleOptionSelect(option.id)}
          >
            {option.text}
          </div>
        ))}
      </div>
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrevQuestion}
          disabled={questionNumber === 1}
        >
          Previous
        </Button>
        <Button
          variant="primary"
          onClick={onNextQuestion}
          disabled={!selectedOptionId}
        >
          {questionNumber === totalQuestions ? 'Finish' : 'Next'}
        </Button>
      </div>
      
      {showAnswer && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm">
          <p className="font-semibold text-blue-800">Explanation:</p>
          <p className="text-blue-700">
            The correct answer is highlighted in green.
            {selectedOptionId === question.correctOptionId
              ? ' You got this question correct!'
              : ' Your answer is highlighted in red.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;