import React from 'react';
import Button from '../components/ui/Button';
import { useQuiz } from '../context/QuizContext';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Edit3, Award, Users } from 'lucide-react';

type HomePageProps = {
  onNavigate: (path: string) => void;
};

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { publicQuizzes } = useQuiz();
  const { isAuthenticated } = useAuth();
  
  const recentQuizzes = publicQuizzes.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Create and Share Interactive Quizzes
          </h1>
          <p className="text-lg md:text-xl mb-8 text-blue-100">
            The ultimate platform for creating engaging quizzes, sharing knowledge, and testing skills.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isAuthenticated ? (
              <>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => onNavigate('/create-quiz')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Edit3 size={20} className="mr-2" />
                  Create a Quiz
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => onNavigate('/quizzes')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <BookOpen size={20} className="mr-2" />
                  Browse Quizzes
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => onNavigate('/register')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Get Started
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => onNavigate('/quizzes')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Browse Quizzes
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Features that make learning fun
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Edit3 size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Create Quizzes</h3>
              <p className="text-gray-600">
                Design custom quizzes with multiple-choice questions to challenge friends, students, or colleagues.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <BookOpen size={24} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Take Quizzes</h3>
              <p className="text-gray-600">
                Test your knowledge with quizzes created by others. Learn new things and challenge yourself.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="bg-teal-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Award size={24} className="text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Instant Results</h3>
              <p className="text-gray-600">
                Get immediate feedback on your performance with detailed results and correct answers.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent quizzes section */}
      {recentQuizzes.length > 0 && (
        <div className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Recent Quizzes</h2>
              <button 
                onClick={() => onNavigate('/quizzes')}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                View all
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {recentQuizzes.map((quiz) => (
                <div 
                  key={quiz.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={() => onNavigate(`/quiz/${quiz.id}`)}
                >
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">{quiz.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{quiz.description}</p>
                    <div className="flex text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users size={14} className="mr-1" />
                        <span>User</span>
                      </div>
                      <div className="mx-2">•</div>
                      <div>{quiz.questions.length} questions</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-3">
                    <button className="text-blue-600 font-medium text-sm">
                      Take this quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* CTA section */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-500 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to create your first quiz?</h2>
          <p className="text-lg mb-8 text-white/90">
            Join thousands of educators, students, and quiz enthusiasts today.
          </p>
          {isAuthenticated ? (
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigate('/create-quiz')}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              Create a Quiz Now
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigate('/register')}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              Sign Up Free
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;