import React, { useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import Input from '../components/ui/Input';
import TextArea from '../components/ui/TextArea';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardBody } from '../components/ui/Card';
import QuestionForm from '../components/quiz/QuestionForm';
import { Question } from '../types';
import { generateId } from '../utils/storage';
import { PlusCircle, Save, Edit, Trash2 } from 'lucide-react';

type CreateQuizPageProps = {
  onNavigate: (path: string) => void;
};

const CreateQuizPage: React.FC<CreateQuizPageProps> = ({ onNavigate }) => {
  const { createQuiz } = useQuiz();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    questions?: string;
  }>({});

  const handleAddQuestion = () => {
    setIsAddingQuestion(true);
    setEditingQuestionId(null);
  };

  const handleEditQuestion = (questionId: string) => {
    setIsAddingQuestion(false);
    setEditingQuestionId(questionId);
  };

  const handleSaveQuestion = (question: Question) => {
    if (editingQuestionId) {
      setQuestions(questions.map(q => q.id === editingQuestionId ? question : q));
      setEditingQuestionId(null);
    } else {
      setQuestions([...questions, question]);
      setIsAddingQuestion(false);
    }
  };

  const handleCancelQuestion = () => {
    setIsAddingQuestion(false);
    setEditingQuestionId(null);
  };

  const handleRemoveQuestion = (questionId: string) => {
    setQuestions(questions.filter(question => question.id !== questionId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: {
      title?: string;
      description?: string;
      questions?: string;
    } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (questions.length === 0) {
      newErrors.questions = 'At least one question is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const quizId = createQuiz({
      title,
      description,
      isPublic,
      questions,
    });
    
    onNavigate(`/quiz/${quizId}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Create a New Quiz</h1>
        <p className="text-gray-600">
          Fill in the details and add questions to create your quiz
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Quiz Details</h2>
          
          <Input
            id="title"
            label="Quiz Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a catchy title for your quiz"
            error={errors.title}
            required
          />
          
          <TextArea
            id="description"
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide a brief description of your quiz"
            error={errors.description}
            required
          />
          
          <div className="mb-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <span className="ml-2 text-gray-700">Make this quiz public</span>
            </label>
            <p className="text-sm text-gray-500 mt-1">
              Public quizzes can be taken by anyone. Private quizzes are only accessible with a direct link.
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Questions</h2>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={handleAddQuestion}
              disabled={isAddingQuestion || editingQuestionId !== null}
            >
              <PlusCircle size={16} className="mr-1" />
              Add Question
            </Button>
          </div>
          
          {errors.questions && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {errors.questions}
            </div>
          )}
          
          {isAddingQuestion && (
            <div className="mb-6">
              <QuestionForm
                onSave={handleSaveQuestion}
                onCancel={handleCancelQuestion}
              />
            </div>
          )}
          
          {editingQuestionId && (
            <div className="mb-6">
              <QuestionForm
                question={questions.find(q => q.id === editingQuestionId)}
                onSave={handleSaveQuestion}
                onCancel={handleCancelQuestion}
              />
            </div>
          )}
          
          {questions.length > 0 ? (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <Card key={question.id}>
                  <CardHeader className="flex justify-between items-center py-3 bg-gray-50">
                    <h3 className="text-base font-medium text-gray-700">
                      Question {index + 1}
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleEditQuestion(question.id)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        disabled={isAddingQuestion || editingQuestionId !== null}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(question.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                        disabled={isAddingQuestion || editingQuestionId !== null}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <p className="mb-2">{question.text}</p>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {question.options.map((option) => (
                        <li
                          key={option.id}
                          className={`flex items-center ${
                            option.id === question.correctOptionId
                              ? 'text-green-600 font-medium'
                              : ''
                          }`}
                        >
                          {option.id === question.correctOptionId && (
                            <span className="mr-1">✓</span>
                          )}
                          {option.text}
                        </li>
                      ))}
                    </ul>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500 mb-2">No questions added yet</p>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={handleAddQuestion}
                disabled={isAddingQuestion}
              >
                <PlusCircle size={16} className="mr-1" />
                Add Your First Question
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button
            variant="primary"
            size="lg"
            type="submit"
            disabled={questions.length === 0 || isAddingQuestion || editingQuestionId !== null}
          >
            <Save size={18} className="mr-2" />
            Create Quiz
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuizPage;