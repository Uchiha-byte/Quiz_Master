import React, { createContext, useContext, useState, useEffect } from 'react';
import { Quiz, Question, QuizOption, QuizResult, QuizAnswer } from '../types';
import { loadState, saveQuiz, deleteQuiz, saveResult, generateId } from '../utils/storage';
import { useAuth } from './AuthContext';

type QuizContextType = {
  quizzes: Quiz[];
  userQuizzes: Quiz[];
  publicQuizzes: Quiz[];
  createQuiz: (quiz: Omit<Quiz, 'id' | 'creatorId' | 'createdAt'>) => string;
  updateQuiz: (quiz: Quiz) => void;
  removeQuiz: (quizId: string) => void;
  getQuiz: (quizId: string) => Quiz | undefined;
  submitQuizAnswers: (quizId: string, answers: QuizAnswer[]) => QuizResult;
  getUserResults: () => QuizResult[];
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);

  // Load quizzes from localStorage on initial render and when user changes
  useEffect(() => {
    const state = loadState();
    setQuizzes(state.quizzes);
    setResults(state.results);
  }, [user]);

  const publicQuizzes = quizzes.filter(quiz => quiz.isPublic);
  
  const userQuizzes = user 
    ? quizzes.filter(quiz => quiz.creatorId === user.id)
    : [];

  const createQuiz = (quizData: Omit<Quiz, 'id' | 'creatorId' | 'createdAt'>): string => {
    if (!user) throw new Error('User must be logged in to create a quiz');
    
    const newQuiz: Quiz = {
      ...quizData,
      id: generateId(),
      creatorId: user.id,
      createdAt: new Date()
    };
    
    setQuizzes(prevQuizzes => [...prevQuizzes, newQuiz]);
    saveQuiz(newQuiz);
    return newQuiz.id;
  };

  const updateQuiz = (updatedQuiz: Quiz) => {
    if (!user) throw new Error('User must be logged in to update a quiz');
    if (updatedQuiz.creatorId !== user.id) throw new Error('User can only update their own quizzes');
    
    setQuizzes(prevQuizzes => 
      prevQuizzes.map(quiz => quiz.id === updatedQuiz.id ? updatedQuiz : quiz)
    );
    saveQuiz(updatedQuiz);
  };

  const removeQuiz = (quizId: string) => {
    if (!user) throw new Error('User must be logged in to delete a quiz');
    
    const quizToDelete = quizzes.find(quiz => quiz.id === quizId);
    if (!quizToDelete) throw new Error('Quiz not found');
    if (quizToDelete.creatorId !== user.id) throw new Error('User can only delete their own quizzes');
    
    setQuizzes(prevQuizzes => prevQuizzes.filter(quiz => quiz.id !== quizId));
    deleteQuiz(quizId);
  };

  const getQuiz = (quizId: string): Quiz | undefined => {
    return quizzes.find(quiz => quiz.id === quizId);
  };

  const submitQuizAnswers = (quizId: string, answers: QuizAnswer[]): QuizResult => {
    if (!user) throw new Error('User must be logged in to submit quiz answers');
    
    const quiz = getQuiz(quizId);
    if (!quiz) throw new Error('Quiz not found');
    
    // Calculate score
    let score = 0;
    
    answers.forEach(answer => {
      const question = quiz.questions.find(q => q.id === answer.questionId);
      if (question && question.correctOptionId === answer.selectedOptionId) {
        score++;
      }
    });
    
    const result: QuizResult = {
      id: generateId(),
      quizId,
      userId: user.id,
      score,
      totalQuestions: quiz.questions.length,
      answers,
      completedAt: new Date()
    };
    
    setResults(prevResults => [...prevResults, result]);
    saveResult(result);
    
    return result;
  };

  const getUserResults = (): QuizResult[] => {
    if (!user) return [];
    return results.filter(result => result.userId === user.id);
  };

  return (
    <QuizContext.Provider 
      value={{ 
        quizzes, 
        userQuizzes, 
        publicQuizzes, 
        createQuiz, 
        updateQuiz, 
        removeQuiz, 
        getQuiz, 
        submitQuizAnswers, 
        getUserResults 
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = (): QuizContextType => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};