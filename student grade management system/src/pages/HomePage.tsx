import React, { useState, useEffect } from 'react';
import StudentForm from '../components/StudentForm';
import StudentList from '../components/StudentList';
import { Student } from '../types';
import { getStudents, saveStudents } from '../utils/localStorage';
import { GraduationCap, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadedStudents = getStudents();
    setStudents(loadedStudents);
  }, []);
  
  const handleAddStudent = (newStudent: Student) => {
    if (user?.role !== 'teacher') {
      alert('Only teachers can add students!');
      return;
    }

    const existingStudentIndex = students.findIndex(s => s.id === newStudent.id);
    
    if (existingStudentIndex >= 0 && !studentToEdit) {
      alert(`A student with ID ${newStudent.id} already exists!`);
      return;
    }
    
    let updatedStudents: Student[];
    
    if (studentToEdit) {
      updatedStudents = students.map(student => 
        student.id === studentToEdit.id ? newStudent : student
      );
      setStudentToEdit(null);
    } else {
      updatedStudents = [...students, newStudent];
    }
    
    setStudents(updatedStudents);
    saveStudents(updatedStudents);
  };
  
  const handleEditStudent = (student: Student) => {
    if (user?.role !== 'teacher') {
      alert('Only teachers can edit students!');
      return;
    }
    setStudentToEdit(student);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleDeleteStudent = (id: string) => {
    if (user?.role !== 'teacher') {
      alert('Only teachers can delete students!');
      return;
    }

    if (window.confirm('Are you sure you want to delete this student?')) {
      const updatedStudents = students.filter(student => student.id !== id);
      setStudents(updatedStudents);
      saveStudents(updatedStudents);
      
      if (studentToEdit && studentToEdit.id === id) {
        setStudentToEdit(null);
      }
    }
  };
  
  const handleCancelEdit = () => {
    setStudentToEdit(null);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    student.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <GraduationCap size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Student Grade Manager</h1>
                <p className="text-blue-100 text-sm mt-1">Welcome back, {user?.name} • {user?.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="px-3 py-1 bg-blue-500/20 rounded-full">
                <span className="text-sm text-blue-100">
                  {students.length} {students.length === 1 ? 'student' : 'students'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-200 focus:ring-2 focus:ring-white/20 focus:outline-none"
              >
                <LogOut size={18} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {user?.role === 'teacher' && (
            <div className="lg:col-span-5">
              <div className="sticky top-8">
                <StudentForm 
                  onSubmit={handleAddStudent} 
                  studentToEdit={studentToEdit}
                  onCancel={studentToEdit ? handleCancelEdit : undefined}
                />
              </div>
            </div>
          )}
          
          <div className={user?.role === 'teacher' ? 'lg:col-span-7' : 'lg:col-span-12'}>
            <StudentList 
              students={filteredStudents}
              onEditStudent={handleEditStudent}
              onDeleteStudent={handleDeleteStudent}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              userRole={user?.role || ''}
            />
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-sm">
              Student Grade Management System • {new Date().getFullYear()}
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-sm text-gray-600">Logged in as {user?.role}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;