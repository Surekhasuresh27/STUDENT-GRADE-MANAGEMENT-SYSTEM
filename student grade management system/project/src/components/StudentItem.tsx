import React, { useState } from 'react';
import { Student } from '../types';
import { calculateAverage, getGradeColor, getGradeLetterAndEmoji } from '../utils/gradeUtils';
import { Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface StudentItemProps {
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
  userRole: string;
}

const StudentItem: React.FC<StudentItemProps> = ({ student, onEdit, onDelete, userRole }) => {
  const [expanded, setExpanded] = useState(false);
  
  const average = calculateAverage(student.grades);
  const gradeColor = getGradeColor(average);
  const { letter, emoji } = getGradeLetterAndEmoji(average);
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-gray-200">
      <div 
        className="px-6 py-4 flex items-center justify-between cursor-pointer group"
        onClick={toggleExpanded}
      >
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${gradeColor.replace('text-', 'bg-').replace('600', '100')}`}>
            <span className={`text-2xl font-bold ${gradeColor}`}>{letter}</span>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{student.name}</h3>
            <p className="text-sm text-gray-500">Student ID: {student.id}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end mr-2">
            <div className="flex items-center space-x-1.5">
              <span className={`text-lg font-semibold ${gradeColor}`}>{average}</span>
              <span className="text-lg">{emoji}</span>
            </div>
            <span className="text-xs text-gray-500">
              {student.grades.length} {student.grades.length === 1 ? 'subject' : 'subjects'}
            </span>
          </div>
          
          {userRole === 'teacher' && (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(student);
                }}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                aria-label="Edit student"
              >
                <Edit size={18} />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(student.id);
                }}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                aria-label="Delete student"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
          
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>
      
      {expanded && (
        <div className="px-6 pb-4 pt-2 border-t border-gray-100 bg-gray-50 animate-fadeIn">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Grade Details</h4>
          
          {student.grades.length > 0 ? (
            <div className="space-y-2">
              {student.grades.map((grade, index) => (
                <div key={index} className="flex justify-between items-center px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                  <span className="text-sm font-medium text-gray-700">{grade.subject}</span>
                  <span className={`text-sm font-semibold px-2 py-1 rounded-md ${getGradeColor(grade.value).replace('text-', 'bg-').replace('600', '100')}`}>
                    {grade.value}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No grades recorded yet</p>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentItem;