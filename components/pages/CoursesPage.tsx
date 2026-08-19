
import React, { useState } from 'react';
import type { PageNavigationProps, Course } from '../../types.ts';
import { CourseIcon, SparklesIcon } from '../Icons.tsx';
import ServicesBanner from '../ServicesBanner.tsx';
import EnrollmentForm from '../EnrollmentForm.tsx';
import { COURSES_DATA } from '../../constants.ts';
import CourseLMS from '../ai-lab/CourseLMS.tsx';

interface CourseCardProps extends Course {
  onEnrollClick: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ title, description, level, duration, isAiPowered, onEnrollClick }) => {
  const levelColor = level === 'Beginner' ? 'text-green-400' : level === 'Intermediate' ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="interactive-card bg-gray-800/70 p-6 rounded-xl border border-purple-500/30 flex flex-col h-full">
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          {isAiPowered && (
            <div className="flex items-center gap-1 text-xs font-bold text-purple-300 bg-purple-900/50 px-2 py-1 rounded-full flex-shrink-0">
              <SparklesIcon className="w-4 h-4" />
              <span>AI-Powered</span>
            </div>
          )}
        </div>
        <p className="text-gray-400 text-sm mb-4">{description}</p>
      </div>
      <div className="flex items-center justify-between text-sm mt-4 text-gray-300 border-t border-gray-700 pt-4">
        <span className={`font-bold ${levelColor}`}>{level}</span>
        <span>{duration}</span>
      </div>
      <button onClick={onEnrollClick} className="w-full mt-4 bg-purple-600 text-white font-bold py-2 rounded-lg hover:bg-purple-700 transition-colors">
        Enroll Now
      </button>
    </div>
  );
};


const CoursesPage: React.FC<PageNavigationProps> = ({ setActivePage }) => {
  const [selectedCourseForEnrollment, setSelectedCourseForEnrollment] = useState<string | null>(null);
  const [activeClassroomCourse, setActiveClassroomCourse] = useState<string | null>(null);

  const handleEnterClassroom = (courseTitle: string) => {
      setActiveClassroomCourse(courseTitle);
      setSelectedCourseForEnrollment(null);
  };

  if (activeClassroomCourse) {
      return (
          <div className="animate-fade-in-up">
              <CourseLMS 
                courseTitle={activeClassroomCourse} 
                onLeaveClass={() => setActiveClassroomCourse(null)} 
              />
          </div>
      );
  }

  return (
     <div className="animate-fade-in-up space-y-16">
      <EnrollmentForm 
        isOpen={!!selectedCourseForEnrollment} 
        courseTitle={selectedCourseForEnrollment || ''} 
        onClose={() => setSelectedCourseForEnrollment(null)} 
        onEnterClassroom={handleEnterClassroom}
      />

      <div>
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 flex items-center justify-center gap-4">
            <CourseIcon className="w-12 h-12" />
            Our Courses
          </h1>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Structured learning paths designed to take you from novice to pro, with AI-powered assistance along the way.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {COURSES_DATA.map(course => (
              <CourseCard 
                key={course.title} 
                {...course} 
                onEnrollClick={() => setSelectedCourseForEnrollment(course.title)} 
              />
            ))}
        </div>
      </div>
      <ServicesBanner onCTAClick={() => setActivePage('contact')} />
    </div>
  );
};

export default CoursesPage;