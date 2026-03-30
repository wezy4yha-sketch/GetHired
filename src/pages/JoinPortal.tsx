import React, { useState } from 'react';
import { motion } from 'motion/react';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, CheckCircle, ArrowRight } from 'lucide-react';
import { UserRole } from '../types';

export default function JoinPortal() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!role || !auth.currentUser) return;
    setLoading(true);
    try {
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        role: role,
        createdAt: new Date().toISOString(),
      });
      navigate('/dashboard');
    } catch (error) {
      console.error("Error setting role:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-pastel-purple via-white to-pastel-blue">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl border border-slate-100 text-center"
      >
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Welcome to GetHired</h2>
        <p className="text-slate-500 mb-12 text-lg">Tell us how you'd like to use the platform.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.button
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setRole('job_seeker')}
            className={`p-8 rounded-3xl border-2 transition-all text-left relative overflow-hidden ${
              role === 'job_seeker' 
                ? 'border-brand-primary bg-brand-primary/5' 
                : 'border-slate-100 bg-slate-50 hover:border-brand-primary/30'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
              role === 'job_seeker' ? 'bg-brand-primary text-white' : 'bg-white text-slate-600'
            }`}>
              <User size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">I am a Job Seeker</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Browse top jobs, apply with AI matching, and track your career growth.</p>
            {role === 'job_seeker' && (
              <div className="absolute top-4 right-4 text-brand-primary">
                <CheckCircle size={24} />
              </div>
            )}
          </motion.button>

          <motion.button
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setRole('employer')}
            className={`p-8 rounded-3xl border-2 transition-all text-left relative overflow-hidden ${
              role === 'employer' 
                ? 'border-brand-primary bg-brand-primary/5' 
                : 'border-slate-100 bg-slate-50 hover:border-brand-primary/30'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
              role === 'employer' ? 'bg-brand-primary text-white' : 'bg-white text-slate-600'
            }`}>
              <Briefcase size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">I am an Employer</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Post job listings, manage applicants, and find the perfect talent for your team.</p>
            {role === 'employer' && (
              <div className="absolute top-4 right-4 text-brand-primary">
                <CheckCircle size={24} />
              </div>
            )}
          </motion.button>
        </div>

        <button 
          disabled={!role || loading}
          onClick={handleJoin}
          className="w-full bg-brand-primary text-white py-5 rounded-2xl font-bold text-xl shadow-xl shadow-brand-primary/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Continue to Dashboard</span>
              <ArrowRight size={24} />
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
