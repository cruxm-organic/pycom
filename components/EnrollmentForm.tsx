
import React, { useState } from 'react';
import { XMarkIcon, CheckCircleIcon, AcademicCapIcon } from './Icons.tsx';

interface EnrollmentFormProps {
  courseTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onEnterClassroom?: (courseTitle: string) => void;
}

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ courseTitle, isOpen, onClose, onEnterClassroom }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: 'Beginner',
    goals: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API processing
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleEnterClassroom = () => {
      if (onEnterClassroom) {
          onEnterClassroom(courseTitle);
          // Reset state for next time
          setTimeout(() => {
            setIsSubmitted(false);
            setFormData({ name: '', email: '', phone: '', experience: 'Beginner', goals: '' });
          }, 500);
      }
      onClose(); // Close the modal regardless
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in-up" onClick={onClose}>
      <div 
        className="bg-gray-900 border border-purple-500 rounded-2xl w-full max-w-lg shadow-2xl p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <XMarkIcon className="w-6 h-6" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-8 animate-pop-in">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="w-12 h-12 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">You're In!</h3>
            <p className="text-gray-300 mb-6">
                Enrollment confirmed for <span className="text-white font-semibold">{courseTitle}</span>.<br/>
                A confirmation has been sent to {formData.email}.
            </p>
            
            <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4 mb-6">
                <p className="text-purple-200 text-sm font-semibold mb-2">Your AI Instructor is ready.</p>
                <button 
                    onClick={handleEnterClassroom}
                    className="w-full bg-white text-purple-900 font-bold py-3 rounded-lg hover:bg-gray-200 transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                    <AcademicCapIcon className="w-6 h-6" />
                    Enter Classroom Now
                </button>
            </div>
            
            <button onClick={onClose} className="text-sm text-gray-500 hover:text-white underline">
                I'll start later
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">Enroll in Course</h2>
                <p className="text-purple-400 font-semibold mt-1 text-lg">{courseTitle}</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  placeholder="e.g. Alex Smith"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    placeholder="alex@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Current Experience Level</label>
                <select 
                  name="experience" 
                  value={formData.experience} 
                  onChange={handleChange} 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all appearance-none"
                >
                  <option value="Beginner">Beginner (New to Python)</option>
                  <option value="Intermediate">Intermediate (Some projects)</option>
                  <option value="Advanced">Advanced (Professional exp)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Learning Goals / Notes</label>
                <textarea 
                  name="goals" 
                  value={formData.goals} 
                  onChange={handleChange} 
                  rows={3} 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  placeholder="Tell us what you want to achieve..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-purple-600 text-white font-bold py-3.5 rounded-lg hover:bg-purple-700 disabled:bg-purple-800/50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] shadow-lg shadow-purple-900/50 mt-2 flex justify-center items-center"
              >
                {isLoading ? (
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                ) : (
                    "Confirm Enrollment"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default EnrollmentForm;
