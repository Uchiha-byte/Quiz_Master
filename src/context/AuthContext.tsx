import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { loadState, saveUser, clearUser, generateId } from '../utils/storage';

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Load user from localStorage on initial render
  useEffect(() => {
    const state = loadState();
    if (state.currentUser) {
      setUser(state.currentUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const state = loadState();
    
    // Find user with matching email (in a real app, this would be a server request)
    const users = state.quizzes
      .map(quiz => quiz.creatorId)
      .filter((value, index, self) => self.indexOf(value) === index)
      .map(id => {
        const quizzes = state.quizzes.filter(quiz => quiz.creatorId === id);
        if (quizzes.length > 0) {
          const quiz = quizzes[0];
          return {
            id: quiz.creatorId,
            username: `User-${quiz.creatorId.substring(0, 4)}`,
            email: `user-${quiz.creatorId.substring(0, 4)}@example.com`,
            password: 'password', // Not secure, just for demo
            createdAt: quiz.createdAt,
            quizzesTaken: state.results.filter(result => result.userId === id).map(result => result.quizId),
            quizzesCreated: state.quizzes.filter(q => q.creatorId === id).map(q => q.id)
          };
        }
        return null;
      })
      .filter((user): user is User => user !== null);
    
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      saveUser(foundUser);
      return true;
    }
    
    // For demo purposes, create a new user if one doesn't exist
    if (email === 'demo@example.com' && password === 'password') {
      const newUser: User = {
        id: generateId(),
        username: 'Demo User',
        email: 'demo@example.com',
        password: 'password',
        createdAt: new Date(),
        quizzesTaken: [],
        quizzesCreated: []
      };
      
      setUser(newUser);
      setIsAuthenticated(true);
      saveUser(newUser);
      return true;
    }
    
    return false;
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    const state = loadState();
    
    // Check if user already exists (in a real app, this would be a server request)
    const users = state.quizzes
      .map(quiz => quiz.creatorId)
      .filter((value, index, self) => self.indexOf(value) === index)
      .map(id => {
        const quizzes = state.quizzes.filter(quiz => quiz.creatorId === id);
        if (quizzes.length > 0) {
          const quiz = quizzes[0];
          return {
            id: quiz.creatorId,
            username: `User-${quiz.creatorId.substring(0, 4)}`,
            email: `user-${quiz.creatorId.substring(0, 4)}@example.com`,
            password: 'password', // Not secure, just for demo
            createdAt: quiz.createdAt,
            quizzesTaken: state.results.filter(result => result.userId === id).map(result => result.quizId),
            quizzesCreated: state.quizzes.filter(q => q.creatorId === id).map(q => q.id)
          };
        }
        return null;
      })
      .filter((user): user is User => user !== null);
    
    const userExists = users.some(u => u.email === email);
    
    if (userExists) {
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: generateId(),
      username,
      email,
      password,
      createdAt: new Date(),
      quizzesTaken: [],
      quizzesCreated: []
    };
    
    setUser(newUser);
    setIsAuthenticated(true);
    saveUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    clearUser();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};