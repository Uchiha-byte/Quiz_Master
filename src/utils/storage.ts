import { AppState, Quiz, QuizResult, User } from '../types';

// Initial app state
const initialState: AppState = {
  currentUser: null,
  quizzes: [],
  results: []
};

// Load app state from localStorage
export const loadState = (): AppState => {
  try {
    const serializedState = localStorage.getItem('quizMakerState');
    if (!serializedState) return initialState;
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state:', err);
    return initialState;
  }
};

// Save app state to localStorage
export const saveState = (state: AppState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('quizMakerState', serializedState);
  } catch (err) {
    console.error('Error saving state:', err);
  }
};

// Helper functions for managing users
export const saveUser = (user: User): void => {
  const state = loadState();
  state.currentUser = user;
  saveState(state);
};

export const clearUser = (): void => {
  const state = loadState();
  state.currentUser = null;
  saveState(state);
};

// Helper functions for quizzes
export const getQuizzes = (): Quiz[] => {
  return loadState().quizzes;
};

export const getPublicQuizzes = (): Quiz[] => {
  return loadState().quizzes.filter(quiz => quiz.isPublic);
};

export const getQuizById = (quizId: string): Quiz | undefined => {
  return loadState().quizzes.find(quiz => quiz.id === quizId);
};

export const getUserQuizzes = (userId: string): Quiz[] => {
  return loadState().quizzes.filter(quiz => quiz.creatorId === userId);
};

export const saveQuiz = (quiz: Quiz): void => {
  const state = loadState();
  const index = state.quizzes.findIndex(q => q.id === quiz.id);
  
  if (index !== -1) {
    state.quizzes[index] = quiz;
  } else {
    state.quizzes.push(quiz);
  }
  
  saveState(state);
};

export const deleteQuiz = (quizId: string): void => {
  const state = loadState();
  state.quizzes = state.quizzes.filter(quiz => quiz.id !== quizId);
  saveState(state);
};

// Helper functions for quiz results
export const saveResult = (result: QuizResult): void => {
  const state = loadState();
  state.results.push(result);
  saveState(state);
};

export const getUserResults = (userId: string): QuizResult[] => {
  return loadState().results.filter(result => result.userId === userId);
};

export const getQuizResult = (quizId: string, userId: string): QuizResult | undefined => {
  return loadState().results.find(
    result => result.quizId === quizId && result.userId === userId
  );
};

// Generate a unique ID (simple implementation)
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};