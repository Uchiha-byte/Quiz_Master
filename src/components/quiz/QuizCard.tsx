import React from 'react';
import Card, { CardHeader, CardBody, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import { Quiz } from '../../types';
import { ClipboardList, User, Calendar } from 'lucide-react';

type QuizCardProps = {
  quiz: Quiz;
  onTakeQuiz: (quizId: string) => void;
  onEditQuiz?: (quizId: string) => void;
  isCreator?: boolean;
};

const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  onTakeQuiz,
  onEditQuiz,
  isCreator = false,
}) => {
  const formattedDate = new Date(quiz.createdAt).toLocaleDateString();

  return (
    <Card hoverable className="h-full flex flex-col">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500">
        <h3 className="text-lg font-semibold text-white truncate">{quiz.title}</h3>
      </CardHeader>
      
      <CardBody className="flex-grow">
        <p className="text-gray-600 mb-6 line-clamp-3">{quiz.description}</p>
        
        <div className="text-sm text-gray-500 space-y-3">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <ClipboardList size={16} className="text-blue-600" />
            </div>
            <span>{quiz.questions.length} Questions</span>
          </div>
          
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <User size={16} className="text-purple-600" />
            </div>
            <span>Created by {isCreator ? 'You' : 'User'}</span>
          </div>
          
          <div className="flex items-center">
            <div className="p-2 bg-teal-100 rounded-lg mr-3">
              <Calendar size={16} className="text-teal-600" />
            </div>
            <span>{formattedDate}</span>
          </div>
        </div>
      </CardBody>
      
      <CardFooter className="flex justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onTakeQuiz(quiz.id)}
          className="flex-1 mr-2"
        >
          Take Quiz
        </Button>
        
        {isCreator && onEditQuiz && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditQuiz(quiz.id)}
            className="flex-1"
          >
            Edit
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default QuizCard;