import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile } from './types';
import Home from './pages/Home';
import Auth from './pages/Auth';
import JoinPortal from './pages/JoinPortal';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import { LogOut, Briefcase, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const docRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pastel-blue">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} profile={profile} />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/dashboard" />} />
              <Route path="/join" element={user && !profile ? <JoinPortal /> : (user ? <Navigate to="/dashboard" /> : <Navigate to="/auth" />)} />
              <Route 
                path="/dashboard" 
                element={
                  user ? (
                    profile ? (
                      profile.role === 'job_seeker' ? <JobSeekerDashboard /> : <EmployerDashboard />
                    ) : <Navigate to="/join" />
                  ) : <Navigate to="/auth" />
                } 
              />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function Navbar({ user, profile }: { user: User | null, profile: UserProfile | null }) {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-primary/20">
              G
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-800">GetHired</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-600 hover:text-brand-primary transition-colors">Home</Link>
            {user && (
              <Link to="/dashboard" className="text-slate-600 hover:text-brand-primary transition-colors flex items-center space-x-1">
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
            )}
            {user ? (
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-full transition-all"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            ) : (
              <Link 
                to="/auth" 
                className="bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-2 rounded-full shadow-lg shadow-brand-primary/25 transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold">G</div>
              <span className="text-xl font-bold">GetHired</span>
            </div>
            <p className="text-slate-500 max-w-xs">
              Empowering the next generation of talent with AI-driven matching and premium career opportunities.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-slate-500">
              <li><Link to="/auth">Find Jobs</Link></li>
              <li><Link to="/auth">Post a Job</Link></li>
              <li><Link to="/">Success Stories</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-slate-500">
              <li><Link to="/">About Us</Link></li>
              <li><Link to="/">Privacy Policy</Link></li>
              <li><Link to="/">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-50 text-center text-slate-400 text-sm">
          © {new Date().getFullYear()} GetHired. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
