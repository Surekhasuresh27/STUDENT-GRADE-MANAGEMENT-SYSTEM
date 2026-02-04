import React from 'react';
import { Student } from '../types';
import StudentItem from './StudentItem';
import { Search, UsersRound } from 'lucide-react';

interface StudentListProps {
  students: Student[];
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  userRole: string;
}

const StudentList: React.FC<StudentListProps> = ({
  students,
  onEditStudent,
  onDeleteStudent,
  searchQuery,
  setSearchQuery,
  userRole
}) => {
  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center text-gray-800">
          <div className="p-2 bg-blue-100 rounded-lg mr-3">
            <UsersRound className="text-blue-600" size={22} />
          </div>
          Student List
          <span className="ml-3 px-2.5 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
            {students.length}
          </span>
        </h2>
        
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students..."
            className="pl-10 pr-4 py-2 w-64 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        {students.length > 0 ? (
          students.map((student) => (
            <StudentItem
              key={student.id}
              student={student}
              onEdit={onEditStudent}
              onDelete={onDeleteStudent}
              userRole={userRole}
            />
          ))
        ) : (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UsersRound size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">
              {searchQuery 
                ? 'No students found matching your search criteria.' 
                : userRole === 'teacher' 
                  ? 'No students added yet. Create your first student using the form above!'
                  : 'No students available to display.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList;