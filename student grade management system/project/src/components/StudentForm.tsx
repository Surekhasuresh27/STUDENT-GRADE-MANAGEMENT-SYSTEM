import React, { useState, useEffect } from 'react';
import { Student, Grade } from '../types';
import { PlusCircle, Save, XCircle, BookOpen } from 'lucide-react';

interface StudentFormProps {
  onSubmit: (student: Student) => void;
  studentToEdit?: Student | null;
  onCancel?: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ 
  onSubmit, 
  studentToEdit = null,
  onCancel
}) => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [grades, setGrades] = useState<Grade[]>([{ subject: '', value: 0 }]);
  const [errors, setErrors] = useState<{
    name?: string;
    id?: string;
    grades?: string;
  }>({});

  useEffect(() => {
    if (studentToEdit) {
      setName(studentToEdit.name);
      setId(studentToEdit.id);
      setGrades(studentToEdit.grades.length > 0 
        ? studentToEdit.grades 
        : [{ subject: '', value: 0 }]);
    }
  }, [studentToEdit]);

  const handleGradeChange = (index: number, field: 'subject' | 'value', value: string | number) => {
    const newGrades = [...grades];
    newGrades[index] = { 
      ...newGrades[index], 
      [field]: field === 'value' ? Number(value) : value 
    };
    setGrades(newGrades);
  };

  const addGradeField = () => {
    setGrades([...grades, { subject: '', value: 0 }]);
  };

  const removeGradeField = (index: number) => {
    if (grades.length > 1) {
      const newGrades = grades.filter((_, i) => i !== index);
      setGrades(newGrades);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {
      name?: string;
      id?: string;
      grades?: string;
    } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!id.trim()) {
      newErrors.id = 'ID is required';
    }
    
    const invalidGrades = grades.some(grade => !grade.subject.trim() || grade.value < 0 || grade.value > 100);
    if (invalidGrades) {
      newErrors.grades = 'All subjects must have a name and grades must be between 0-100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const validGrades = grades.filter(grade => grade.subject.trim() !== '');
    
    const student: Student = {
      id,
      name,
      grades: validGrades,
    };
    
    onSubmit(student);
    
    if (!studentToEdit) {
      setName('');
      setId('');
      setGrades([{ subject: '', value: 0 }]);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            {studentToEdit ? 'Edit Student' : 'Add New Student'}
          </h2>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Student Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-2.5 border ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
            placeholder="Enter student name"
          />
          {errors.name && <p className="mt-1.5 text-sm text-red-500">{errors.name}</p>}
        </div>
        
        <div>
          <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">
            Student ID
          </label>
          <input
            type="text"
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            disabled={!!studentToEdit}
            className={`w-full px-4 py-2.5 border ${
              errors.id ? 'border-red-500' : 'border-gray-300'
            } ${studentToEdit ? 'bg-gray-50' : ''} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
            placeholder="Enter student ID"
          />
          {errors.id && <p className="mt-1.5 text-sm text-red-500">{errors.id}</p>}
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Grades
            </label>
            <button
              type="button"
              onClick={addGradeField}
              className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <PlusCircle size={16} className="mr-1.5" /> Add Subject
            </button>
          </div>
          
          {errors.grades && (
            <p className="mb-3 text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
              {errors.grades}
            </p>
          )}
          
          <div className="space-y-3">
            {grades.map((grade, index) => (
              <div key={index} className="flex items-center gap-3 group">
                <div className="flex-1">
                  <input
                    type="text"
                    value={grade.subject}
                    onChange={(e) => handleGradeChange(index, 'subject', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Subject name"
                  />
                </div>
                <div className="w-28">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={grade.value}
                    onChange={(e) => handleGradeChange(index, 'value', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Grade"
                  />
                </div>
                {grades.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeGradeField(index)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                    aria-label="Remove grade"
                  >
                    <XCircle size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
            >
              Cancel
            </button>
          )}
          
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2.5 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02]"
          >
            <Save size={18} className="mr-2" />
            {studentToEdit ? 'Update' : 'Add'} Student
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;