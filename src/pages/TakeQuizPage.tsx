import React, { useState, useEffect } from 'react';
import { useQuiz } from '../context/QuizContext';
import { useAuth } from '../context/AuthContext';
import QuizQuestion from '../components/quiz/QuizQuestion';
import Button from '../components/ui/Button';
import { QuizAnswer, QuizResult } from '../types';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

type TakeQuizPageProps = {
  quizId: string;
  onNavigate: (path: string) => void;
};

const TakeQuizPage: React.FC<TakeQuizPageProps> = ({ quizId, onNavigate }) => {
  const { getQuiz, submitQuizAnswers } = useQuiz();
  const { user, isAuthenticated } = useAuth();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<QuizAnswer[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  
  const quiz = getQuiz(quizId);
  
  useEffect(() => {
    if (!quiz) {
      onNavigate('/quizzes');
    }
  }, [quiz, onNavigate]);
  
  if (!quiz) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <div className="bg-yellow-50 p-4 rounded-lg flex items-center justify-center mb-4">
          <AlertTriangle className="text-yellow-500 mr-2" />
          <p className="text-yellow-700">Quiz not found</p>
        </div>
        <Button variant="primary" onClick={() => onNavigate('/quizzes')}>
          Back to Quizzes
        </Button>
      </div>
    );
  }
  
  const handleAnswerQuestion = (answer: QuizAnswer) => {
    const updatedAnswers = [...userAnswers];
    const existingAnswerIndex = updatedAnswers.findIndex(
      a => a.questionId === answer.questionId
    );
    
    if (existingAnswerIndex !== -1) {
      updatedAnswers[existingAnswerIndex] = answer;
    } else {
      updatedAnswers.push(answer);
    }
    
    setUserAnswers(updatedAnswers);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      if (isAuthenticated && user) {
        const quizResult = submitQuizAnswers(quizId, userAnswers);
        setResult(quizResult);
      } else {
        // For unauthenticated users, calculate the score locally
        let score = 0;
        userAnswers.forEach(answer => {
          const question = quiz.questions.find(q => q.id === answer.questionId);
          if (question && question.correctOptionId === answer.selectedOptionId) {
            score++;
          }
        });
        
        const localResult = {
          id: 'local',
          quizId,
          userId: 'anonymous',
          score,
          totalQuestions: quiz.questions.length,
          answers: userAnswers,
          completedAt: new Date()
        };
        
        setResult(localResult);
      }
      
      setShowResults(true);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };
  
  const handleReviewQuiz = () => {
    setReviewMode(true);
    setCurrentQuestionIndex(0);
    setShowResults(false);
  };
  
  const handleFinishReview = () => {
    setReviewMode(false);
    setShowResults(true);
  };
  
  const getUserAnswer = (questionId: string): string | undefined => {
    const answer = userAnswers.find(a => a.questionId === questionId);
    return answer?.selectedOptionId;
  };
  
  if (showResults && result) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
            <p className="text-blue-100 text-sm">{quiz.questions.length} questions</p>
          </div>
          
          <div className="p-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-4">
                <span className="text-3xl font-bold text-blue-600">
                  {result.score}/{result.totalQuestions}
                </span>
              </div>
              <h2 className="text-xl font-bold mb-2 text-gray-800">
                {result.score === result.totalQuestions
                  ? 'Perfect Score!'
                  : result.score / result.totalQuestions >= 0.7
                  ? 'Great Job!'
                  : 'Quiz Completed!'}
              </h2>
              <p className="text-gray-600">
                You scored {Math.round((result.score / result.totalQuestions) * 100)}%
              </p>
            </div>
            
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-gray-800">Performance Summary</h3>
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span>Correct Answers:</span>
                  <span className="font-medium">{result.score}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Incorrect Answers:</span>
                  <span className="font-medium">{result.totalQuestions - result.score}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Accuracy:</span>
                  <span className="font-medium">
                    {Math.round((result.score / result.totalQuestions) * 100)}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => onNavigate('/quizzes')}
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to Quizzes
              </Button>
              <Button
                variant="primary"
                onClick={handleReviewQuiz}
              >
                Review Answers
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!quiz.questions.length) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <div className="bg-yellow-50 p-4 rounded-lg flex items-center justify-center mb-4">
          <AlertTriangle className="text-yellow-500 mr-2" />
          <p className="text-yellow-700">This quiz has no questions</p>
        </div>
        <Button variant="primary" onClick={() => onNavigate('/quizzes')}>
          Back to Quizzes
        </Button>
      </div>
    );
  }
  
  const currentQuestion = quiz.questions[currentQuestionIndex];
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('/quizzes')}
          className="mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Quizzes
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">{quiz.title}</h1>
        <p className="text-gray-600">{quiz.description}</p>
      </div>
      
      <QuizQuestion
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={quiz.questions.length}
        userAnswer={getUserAnswer(currentQuestion.id)}
        showAnswer={reviewMode}
        onAnswer={handleAnswerQuestion}
        onNextQuestion={reviewMode && currentQuestionIndex === quiz.questions.length - 1 ? handleFinishReview : handleNextQuestion}
        onPrevQuestion={handlePrevQuestion}
      />
      
      {reviewMode && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            onClick={handleFinishReview}
          >
            Finish Review
          </Button>
        </div>
      )}
    </div>
  );
};

export default TakeQuizPage;