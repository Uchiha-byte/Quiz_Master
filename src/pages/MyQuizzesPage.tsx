import React from 'react';
import { useQuiz } from '../context/QuizContext';
import { useAuth } from '../context/AuthContext';
import QuizCard from '../components/quiz/QuizCard';
import Button from '../components/ui/Button';
import { PlusCircle, ChevronRight } from 'lucide-react';

type MyQuizzesPageProps = {
  onNavigate: (path: string) => void;
};

const MyQuizzesPage: React.FC<MyQuizzesPageProps> = ({ onNavigate }) => {
  const { userQuizzes } = useQuiz();
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    onNavigate('/login');
    return null;
  }
  
  const handleTakeQuiz = (quizId: string) => {
    onNavigate(`/quiz/${quizId}`);
  };
  
  const handleEditQuiz = (quizId: string) => {
    onNavigate(`/edit-quiz/${quizId}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-800">My Quizzes</h1>
          <p className="text-gray-600">
            Manage the quizzes you've created
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => onNavigate('/create-quiz')}
        >
          <PlusCircle size={16} className="mr-1" />
          Create New Quiz
        </Button>
      </div>
      
      {userQuizzes.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <div className="bg-blue-100 p-3 rounded-full inline-flex mb-4">
            <PlusCircle size={24} className="text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes yet</h3>
          <p className="text-gray-500 mb-4">
            You haven't created any quizzes yet. Create your first quiz to share with others!
          </p>
          <Button
            variant="primary"
            onClick={() => onNavigate('/create-quiz')}
          >
            Create Your First Quiz
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {userQuizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              onTakeQuiz={handleTakeQuiz}
              onEditQuiz={handleEditQuiz}
              isCreator={true}
            />
          ))}
        </div>
      )}
      
      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Recent Results</h2>
          <button 
            onClick={() => onNavigate('/profile')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          >
            View all results
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            {userQuizzes.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No quiz results yet. Take a quiz to see your results here!
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                Quiz results will appear here once you take some quizzes.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyQuizzesPage;