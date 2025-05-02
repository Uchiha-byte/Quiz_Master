import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import { Menu, X, LogOut, UserCircle } from 'lucide-react';

type NavbarProps = {
  onNavigate: (path: string) => void;
  currentPath: string;
};

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPath }) => {
  const { isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigation = (path: string) => {
    onNavigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/quizzes', label: 'Browse Quizzes' },
    ...(isAuthenticated ? [{ path: '/my-quizzes', label: 'My Quizzes' }] : []),
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-white text-xl font-bold">QuizMaster</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      currentPath === item.path
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleNavigation('/create-quiz')}
                    className="border-white text-white hover:bg-white/10"
                  >
                    Create Quiz
                  </Button>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-white/80 hover:text-white transition-colors duration-200"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleNavigation('/login')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Login
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleNavigation('/register')}
                    className="bg-white text-blue-600 hover:bg-gray-100"
                  >
                    Register
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white/80 hover:text-white transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`block w-full px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  currentPath === item.path
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          
          <div className="pt-4 pb-3 border-t border-white/10">
            {isAuthenticated ? (
              <div className="px-2 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleNavigation('/create-quiz')}
                  className="w-full border-white text-white hover:bg-white/10"
                >
                  Create Quiz
                </Button>
                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2 rounded-md text-base font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-2 space-y-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleNavigation('/login')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleNavigation('/register')}
                  className="w-full bg-white text-blue-600 hover:bg-gray-100"
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;