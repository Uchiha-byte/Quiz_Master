import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Question, QuizOption } from '../../types';
import { generateId } from '../../utils/storage';
import { PlusCircle, Trash2, Check } from 'lucide-react';

type QuestionFormProps = {
  question?: Question;
  onSave: (question: Question) => void;
  onCancel: () => void;
};

const QuestionForm: React.FC<QuestionFormProps> = ({
  question,
  onSave,
  onCancel,
}) => {
  const [questionText, setQuestionText] = useState(question?.text || '');
  const [options, setOptions] = useState<QuizOption[]>(
    question?.options || [
      { id: generateId(), text: '' },
      { id: generateId(), text: '' },
    ]
  );
  const [correctOptionId, setCorrectOptionId] = useState<string>(
    question?.correctOptionId || ''
  );
  const [error, setError] = useState<string>('');

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, { id: generateId(), text: '' }]);
    }
  };

  const handleRemoveOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter(option => option.id !== id));
      if (correctOptionId === id) {
        setCorrectOptionId('');
      }
    } else {
      setError('A question must have at least 2 options');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleOptionChange = (id: string, text: string) => {
    setOptions(
      options.map(option => 
        option.id === id ? { ...option, text } : option
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!questionText.trim()) {
      setError('Question text is required');
      return;
    }
    
    const emptyOptions = options.some(option => !option.text.trim());
    if (emptyOptions) {
      setError('All options must have text');
      return;
    }
    
    if (!correctOptionId) {
      setError('Please select a correct answer');
      return;
    }
    
    const newQuestion: Question = {
      id: question?.id || generateId(),
      text: questionText,
      options,
      correctOptionId,
    };
    
    onSave(newQuestion);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">
        {question ? 'Edit Question' : 'Add Question'}
      </h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <Input
        id="question-text"
        label="Question"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        placeholder="Enter your question here"
        required
      />
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Options
            <span className="text-red-500 ml-1">*</span>
          </label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleAddOption}
            disabled={options.length >= 6}
            className="text-blue-600"
          >
            <PlusCircle size={16} className="mr-1" />
            Add Option
          </Button>
        </div>
        
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={option.id} className="flex items-center space-x-2">
              <div className="flex-grow">
                <div className="relative">
                  <Input
                    id={`option-${option.id}`}
                    value={option.text}
                    onChange={(e) => handleOptionChange(option.id, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="mb-0 pr-10"
                  />
                  <button
                    type="button"
                    className={`absolute right-10 top-2 p-1 rounded-full ${
                      correctOptionId === option.id
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                    onClick={() => setCorrectOptionId(option.id)}
                    title="Mark as correct answer"
                  >
                    <Check size={16} />
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveOption(option.id)}
                className="p-2 text-red-500 hover:text-red-700"
                disabled={options.length <= 2}
                title="Remove option"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          Save Question
        </Button>
      </div>
    </form>
  );
};

export default QuestionForm;