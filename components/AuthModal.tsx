
import React, { useState } from 'react';
import { GoogleIcon, MobileIcon, ShieldCheckIcon, UserCircleIcon, BuildingOfficeIcon, BriefcaseIcon, CheckCircleIcon, XMarkIcon } from './Icons.tsx';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

type AuthStep = 'initial' | 'data-collection' | 'success';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [step, setStep] = useState<AuthStep>('initial');
  
  // States for different auth flows
  const [authMethod, setAuthMethod] = useState<'default' | 'mobile'>('default');
  const [mobileStep, setMobileStep] = useState<'number' | 'otp'>('number');
  
  // Form inputs
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  
  // Data Collection Inputs
  const [userData, setUserData] = useState({
      fullName: '',
      role: '',
      company: '',
      goal: 'Learning Python'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const resetState = () => {
      setAuthMethod('default');
      setMobileStep('number');
      setStep('initial');
      setPhoneNumber('');
      setOtpCode('');
      setUserData({ fullName: '', role: '', company: '', goal: 'Learning Python' });
      setIsLoading(false);
      setSuccessMessage('');
  };

  const handleClose = () => {
      resetState();
      onClose();
  }

  const handleProviderClick = () => {
      setIsLoading(true);
      // Simulate provider auth delay
      setTimeout(() => {
          setIsLoading(false);
          if (activeTab === 'signin') {
              // If signing in, assume data is already there, skip to success
              setSuccessMessage('Welcome back to PyCom!');
              setStep('success');
              setTimeout(() => {
                  onAuthSuccess();
                  handleClose();
              }, 1500);
          } else {
              setStep('data-collection');
          }
      }, 1000);
  };

  const handleDataSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      // Simulate API call to save user data
      setTimeout(() => {
          setIsLoading(false);
          setSuccessMessage(`Welcome to PyCom, ${userData.fullName}!`);
          setStep('success');
          setTimeout(() => {
              onAuthSuccess(); // Notify parent of success
              handleClose();
          }, 2000);
      }, 1500);
  };

  const handleMobileSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(!phoneNumber) return;
      setIsLoading(true);
      setTimeout(() => {
          setIsLoading(false);
          setMobileStep('otp');
      }, 1000);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
      e.preventDefault();
      if(!otpCode) return;
      setIsLoading(true);
      setTimeout(() => {
          setIsLoading(false);
          if (activeTab === 'signin') {
              setSuccessMessage('Mobile verification successful!');
              setStep('success');
              setTimeout(() => {
                  onAuthSuccess();
                  handleClose();
              }, 1500);
          } else {
              setStep('data-collection');
          }
      }, 1000);
  };

  const TabButton: React.FC<{ tab: 'signin' | 'signup', children: React.ReactNode }> = ({ tab, children }) => (
    <button
      onClick={() => {
          setActiveTab(tab);
          resetState();
      }}
      className={`w-1/2 py-3 font-bold text-center transition-colors ${
        activeTab === tab ? 'text-white border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in-up" onClick={handleClose}>
      <div
        className="bg-gray-900 border border-purple-500 rounded-2xl w-full max-w-md shadow-2xl p-8 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-white">
            {step === 'data-collection' ? 'Almost There!' : activeTab === 'signin' ? 'Welcome Back' : 'Join PyCom'}
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {step === 'initial' && (
            <div className="border-b border-gray-700 mt-2 mb-6">
                <div className="flex">
                    <TabButton tab="signin">Sign In</TabButton>
                    <TabButton tab="signup">Sign Up</TabButton>
                </div>
            </div>
        )}

        {step === 'success' ? (
            <div className="text-center py-8 animate-pop-in">
                <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50">
                    <CheckCircleIcon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Success!</h3>
                <p className="text-gray-300">{successMessage}</p>
            </div>
        ) : step === 'data-collection' ? (
            <div className="animate-fade-in-up">
                <p className="text-sm text-gray-400 mb-6">Please complete your profile to access the dashboard.</p>
                <form onSubmit={handleDataSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                        <div className="relative">
                            <UserCircleIcon className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                            <input 
                                type="text" 
                                required
                                value={userData.fullName}
                                onChange={(e) => setUserData({...userData, fullName: e.target.value})}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 p-3 text-white focus:border-purple-500 focus:outline-none"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Job Title</label>
                            <input 
                                type="text" 
                                required
                                value={userData.role}
                                onChange={(e) => setUserData({...userData, role: e.target.value})}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none"
                                placeholder="Developer"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Company</label>
                            <input 
                                type="text" 
                                value={userData.company}
                                onChange={(e) => setUserData({...userData, company: e.target.value})}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none"
                                placeholder="Acme Inc."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Primary Goal</label>
                        <div className="relative">
                            <BriefcaseIcon className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                            <select 
                                value={userData.goal}
                                onChange={(e) => setUserData({...userData, goal: e.target.value})}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 p-3 text-white focus:border-purple-500 focus:outline-none appearance-none"
                            >
                                <option>Learning Python</option>
                                <option>Hiring Talent</option>
                                <option>Strategic Investment</option>
                                <option>Enterprise Solutions</option>
                                <option>Building a Project</option>
                            </select>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full mt-4 bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-all hover:scale-[1.02] shadow-lg shadow-purple-900/20 flex justify-center items-center"
                    >
                        {isLoading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : 'Complete Setup'}
                    </button>
                </form>
            </div>
        ) : (
            <>
                {/* Initial Step: Login Options */}
                {authMethod === 'default' && (
                    <div className="space-y-4 animate-fade-in-up">
                        <button 
                            onClick={handleProviderClick}
                            disabled={isLoading}
                            className="w-full bg-white text-gray-900 font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-3"
                        >
                            {isLoading ? (
                                <span className="animate-spin h-5 w-5 border-2 border-gray-900 border-t-transparent rounded-full"></span>
                            ) : (
                                <GoogleIcon className="w-5 h-5" />
                            )}
                            <span>Continue with Google</span>
                        </button>

                        <button 
                            onClick={handleProviderClick}
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20"
                        >
                            <ShieldCheckIcon className="w-5 h-5" />
                            <span>Enterprise SSO</span>
                        </button>

                        <button 
                            onClick={() => setAuthMethod('mobile')}
                            className="w-full bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-3 border border-gray-600"
                        >
                            <MobileIcon className="w-5 h-5 text-purple-400" />
                            <span>Continue with Mobile</span>
                        </button>

                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-gray-700"></div>
                            <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">Or continue with email</span>
                            <div className="flex-grow border-t border-gray-700"></div>
                        </div>

                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <input type="email" className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" placeholder="Email address" />
                            <input type="password" className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" placeholder="Password" />
                            <button onClick={handleProviderClick} className="w-full mt-2 bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-900/20">
                                {activeTab === 'signin' ? 'Sign In' : 'Create Account'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Mobile Flow */}
                {authMethod === 'mobile' && (
                    <div className="animate-fade-in-up">
                        <button onClick={() => setAuthMethod('default')} className="text-purple-400 text-sm font-semibold hover:text-purple-300 mb-6 flex items-center gap-1">
                            &larr; Back to all methods
                        </button>

                        {mobileStep === 'number' ? (
                            <form onSubmit={handleMobileSubmit} className="space-y-4">
                                <h3 className="text-lg font-bold text-white">Enter your mobile number</h3>
                                <p className="text-sm text-gray-400">We'll send you a verification code.</p>
                                <div className="flex gap-2">
                                    <select className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none">
                                        <option>+1</option>
                                        <option>+91</option>
                                        <option>+44</option>
                                    </select>
                                    <input 
                                        type="tel" 
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="flex-grow bg-gray-800 border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" 
                                        placeholder="Mobile Number" 
                                        required
                                    />
                                </div>
                                <button type="submit" disabled={isLoading} className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-colors flex justify-center">
                                    {isLoading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : 'Get OTP'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOTP} className="space-y-4">
                                <h3 className="text-lg font-bold text-white">Enter Verification Code</h3>
                                <p className="text-sm text-gray-400">Enter the 6-digit code sent to your mobile.</p>
                                <input 
                                    type="text" 
                                    maxLength={6}
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white text-center tracking-widest text-xl" 
                                    placeholder="000000" 
                                    required
                                />
                                <button type="submit" disabled={isLoading} className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-colors flex justify-center">
                                    {isLoading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : 'Verify & Continue'}
                                </button>
                                <button type="button" onClick={() => setMobileStep('number')} className="w-full text-sm text-gray-400 hover:text-white">
                                    Change Number
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </>
        )}

        <p className="text-center text-gray-600 text-xs mt-6">
            By continuing, you agree to PyCom's Terms of Service.
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
