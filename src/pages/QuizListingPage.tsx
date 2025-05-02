import React, { useState, useEffect } from 'react';
import { useQuiz } from '../context/QuizContext';
import QuizCard from '../components/quiz/QuizCard';
import Input from '../components/ui/Input';
import { Search, Filter } from 'lucide-react';
import { Quiz } from '../types';

type QuizListingPageProps = {
  onNavigate: (path: string) => void;
};

const QuizListingPage: React.FC<QuizListingPageProps> = ({ onNavigate }) => {
  const { publicQuizzes } = useQuiz();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredQuizzes(publicQuizzes);
    } else {
      const lowerCaseSearch = searchTerm.toLowerCase();
      const filtered = publicQuizzes.filter(
        quiz => 
          quiz.title.toLowerCase().includes(lowerCaseSearch) ||
          quiz.description.toLowerCase().includes(lowerCaseSearch)
      );
      setFilteredQuizzes(filtered);
    }
  }, [searchTerm, publicQuizzes]);

  const handleTakeQuiz = (quizId: string) => {
    onNavigate(`/quiz/${quizId}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Browse Quizzes</h1>
        <p className="text-gray-600 mb-6">
          Discover and take quizzes created by users from around the world
        </p>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <Input
              id="search"
              placeholder="Search for quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="w-full md:w-48">
            <button className="w-full h-full flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Filter size={16} className="mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>
      
      {filteredQuizzes.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Search size={24} className="text-blue-600" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes found</h3>
          <p className="text-gray-500">
            {searchTerm
              ? `No quizzes match your search "${searchTerm}"`
              : "There are no quizzes available yet. Be the first to create one!"}
          </p>
          {!searchTerm && (
            <button
              onClick={() => onNavigate('/create-quiz')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Create a Quiz
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredQuizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              onTakeQuiz={handleTakeQuiz}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizListingPage;