import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import QuizListingPage from './pages/QuizListingPage';
import CreateQuizPage from './pages/CreateQuizPage';
import TakeQuizPage from './pages/TakeQuizPage';
import MyQuizzesPage from './pages/MyQuizzesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { AuthProvider } from './context/AuthContext';
import { QuizProvider } from './context/QuizContext';
import { loadState, getPublicQuizzes, saveQuiz, generateId } from './utils/storage';

function App() {
  const [currentPath, setCurrentPath] = useState('/');
  
  // Handle navigation
  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };
  
  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  
  // Update browser URL without reloading the page
  useEffect(() => {
    window.history.pushState({}, '', currentPath);
  }, [currentPath]);
  
  // Add sample quizzes if none exist
  useEffect(() => {
    const state = loadState();
    
    if (state.quizzes.length === 0) {
      // Sample Quiz 1: General Knowledge
      const quiz1 = {
        id: generateId(),
        title: 'General Knowledge Quiz',
        description: 'Test your knowledge with these general trivia questions.',
        creatorId: 'system',
        createdAt: new Date(),
        isPublic: true,
        questions: [
          {
            id: generateId(),
            text: 'What is the capital of France?',
            options: [
              { id: generateId(), text: 'London' },
              { id: generateId(), text: 'Berlin' },
              { id: generateId(), text: 'Paris' },
              { id: generateId(), text: 'Madrid' }
            ],
            correctOptionId: '3',
          },
          {
            id: generateId(),
            text: 'Which planet is known as the Red Planet?',
            options: [
              { id: generateId(), text: 'Venus' },
              { id: generateId(), text: 'Mars' },
              { id: generateId(), text: 'Jupiter' },
              { id: generateId(), text: 'Saturn' }
            ],
            correctOptionId: '2',
          },
          {
            id: generateId(),
            text: 'Who wrote the play "Romeo and Juliet"?',
            options: [
              { id: generateId(), text: 'Charles Dickens' },
              { id: generateId(), text: 'William Shakespeare' },
              { id: generateId(), text: 'Jane Austen' },
              { id: generateId(), text: 'Mark Twain' }
            ],
            correctOptionId: '2',
          }
        ]
      };
      
      // Sample Quiz 2: Technology Quiz
      const quiz2 = {
        id: generateId(),
        title: 'Technology Quiz',
        description: 'Challenge yourself with these questions about technology and computing.',
        creatorId: 'system',
        createdAt: new Date(),
        isPublic: true,
        questions: [
          {
            id: generateId(),
            text: 'What does "HTTP" stand for?',
            options: [
              { id: generateId(), text: 'Hypertext Transfer Protocol' },
              { id: generateId(), text: 'Hypertext Transit Protocol' },
              { id: generateId(), text: 'High Transfer Text Protocol' },
              { id: generateId(), text: 'Hypertext Terminal Protocol' }
            ],
            correctOptionId: '1',
          },
          {
            id: generateId(),
            text: 'Which company created the iPhone?',
            options: [
              { id: generateId(), text: 'Google' },
              { id: generateId(), text: 'Microsoft' },
              { id: generateId(), text: 'Apple' },
              { id: generateId(), text: 'Samsung' }
            ],
            correctOptionId: '3',
          },
          {
            id: generateId(),
            text: 'What year was the first website published?',
            options: [
              { id: generateId(), text: '1991' },
              { id: generateId(), text: '1995' },
              { id: generateId(), text: '2000' },
              { id: generateId(), text: '1989' }
            ],
            correctOptionId: '1',
          }
        ]
      };
      
      // Save sample quizzes
      saveQuiz(quiz1);
      saveQuiz(quiz2);
    }
  }, []);
  
  // Render the current page based on the path
  const renderPage = () => {
    // Extract quizId from path if present
    const quizMatch = currentPath.match(/\/quiz\/([^/]+)/);
    const quizId = quizMatch ? quizMatch[1] : '';
    
    const editQuizMatch = currentPath.match(/\/edit-quiz\/([^/]+)/);
    const editQuizId = editQuizMatch ? editQuizMatch[1] : '';
    
    switch (true) {
      case currentPath === '/':
        return <HomePage onNavigate={handleNavigate} />;
      
      case currentPath === '/quizzes':
        return <QuizListingPage onNavigate={handleNavigate} />;
      
      case currentPath === '/create-quiz':
        return <CreateQuizPage onNavigate={handleNavigate} />;
      
      case currentPath === '/my-quizzes':
        return <MyQuizzesPage onNavigate={handleNavigate} />;
      
      case currentPath === '/login':
        return <LoginPage onNavigate={handleNavigate} />;
      
      case currentPath === '/register':
        return <RegisterPage onNavigate={handleNavigate} />;
      
      case Boolean(quizMatch):
        return <TakeQuizPage quizId={quizId} onNavigate={handleNavigate} />;
      
      // Handle more paths as needed
      
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };
  
  return (
    <AuthProvider>
      <QuizProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar onNavigate={handleNavigate} currentPath={currentPath} />
          <main>{renderPage()}</main>
        </div>
      </QuizProvider>
    </AuthProvider>
  );
}

export default App;