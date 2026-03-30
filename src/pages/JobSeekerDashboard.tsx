import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db, storage } from '../firebase';
import { collection, query, getDocs, addDoc, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Briefcase, MapPin, DollarSign, FileText, CheckCircle, Search, Zap, Loader2, X, Upload } from 'lucide-react';
import { JobPost, Application, OperationType } from '../types';
import { handleFirestoreError } from '../lib/errorHandlers';
import { getJobMatches } from '../services/aiService';

export default function JobSeekerDashboard() {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [applying, setApplying] = useState(false);
  const [aiMatching, setAiMatching] = useState(false);
  const [aiMatches, setAiMatches] = useState<number[]>([]);

  useEffect(() => {
    const jobsQuery = query(collection(db, 'jobs'));
    const unsubscribeJobs = onSnapshot(jobsQuery, (snapshot) => {
      setJobs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobPost)));
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'jobs'));

    const appsQuery = query(collection(db, 'applications'), where('jobSeekerId', '==', auth.currentUser?.uid));
    const unsubscribeApps = onSnapshot(appsQuery, (snapshot) => {
      setApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'applications'));

    return () => {
      unsubscribeJobs();
      unsubscribeApps();
    };
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob || !resumeFile || !auth.currentUser) return;

    setApplying(true);
    try {
      const storageRef = ref(storage, `resumes/${auth.currentUser.uid}/${Date.now()}_${resumeFile.name}`);
      await uploadBytes(storageRef, resumeFile);
      const resumeUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'applications'), {
        jobId: selectedJob.id,
        jobSeekerId: auth.currentUser.uid,
        employerId: selectedJob.employerId,
        resumeUrl,
        status: 'pending',
        appliedAt: new Date().toISOString(),
        jobTitle: selectedJob.title,
        companyName: selectedJob.company
      });

      setSelectedJob(null);
      setResumeFile(null);
      alert('Application submitted successfully!');
    } catch (error) {
      console.error("Application error:", error);
      alert('Failed to submit application.');
    } finally {
      setApplying(false);
    }
  };

  const runAiMatch = async () => {
    if (!resumeFile) {
      alert("Please upload your resume first to run AI matching.");
      return;
    }
    setAiMatching(true);
    try {
      // In a real app, we'd extract text from PDF. For this demo, we'll simulate with a prompt.
      const matches = await getJobMatches("Experienced developer with React and Node.js skills", jobs.map(j => j.description));
      setAiMatches(matches.map((m: any) => m.index));
    } catch (error) {
      console.error("AI Match error:", error);
    } finally {
      setAiMatching(false);
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Job Seeker Dashboard</h1>
          <p className="text-slate-500">Find and manage your career opportunities.</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative flex-grow md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search jobs or companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Job Listings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-800">Available Jobs</h2>
            <button 
              onClick={runAiMatch}
              disabled={aiMatching || jobs.length === 0}
              className="flex items-center space-x-2 text-brand-primary font-semibold hover:bg-brand-primary/5 px-4 py-2 rounded-xl transition-all disabled:opacity-50"
            >
              <Zap size={18} className={aiMatching ? "animate-pulse" : ""} />
              <span>{aiMatching ? "Matching..." : "AI Match Me"}</span>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-brand-primary" size={40} />
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white p-12 rounded-[2rem] text-center border border-slate-100">
              <Briefcase className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="text-slate-500">No jobs found matching your search.</p>
            </div>
          ) : (
            filteredJobs.map((job, idx) => (
              <motion.div 
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white p-8 rounded-[2rem] border transition-all hover:shadow-xl group relative ${
                  aiMatches.includes(idx) ? 'border-brand-primary ring-4 ring-brand-primary/5' : 'border-slate-100'
                }`}
              >
                {aiMatches.includes(idx) && (
                  <div className="absolute -top-3 -right-3 bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center space-x-1">
                    <Zap size={12} />
                    <span>AI MATCH</span>
                  </div>
                )}
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-pastel-blue rounded-2xl flex items-center justify-center text-brand-primary">
                      <Briefcase size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-primary transition-colors">{job.title}</h3>
                      <p className="text-slate-600 font-medium mb-2">{job.company}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                        <span className="flex items-center space-x-1"><MapPin size={14} /> <span>{job.location}</span></span>
                        <span className="flex items-center space-x-1"><DollarSign size={14} /> <span>{job.salary}</span></span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedJob(job)}
                    className="bg-brand-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-brand-primary/20 hover:scale-105 transition-transform"
                  >
                    Apply Now
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Applied Jobs Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 sticky top-24">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
              <CheckCircle size={24} className="text-brand-primary" />
              <span>Applied Jobs</span>
            </h2>
            
            <div className="space-y-4">
              {applications.length === 0 ? (
                <p className="text-slate-400 text-center py-8">You haven't applied to any jobs yet.</p>
              ) : (
                applications.map(app => (
                  <div key={app.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <h4 className="font-bold text-slate-900">{app.jobTitle}</h4>
                    <p className="text-sm text-slate-500 mb-2">{app.companyName}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                        app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {app.status}
                      </span>
                      <span className="text-[10px] text-slate-400">{new Date(app.appliedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Apply for Role</h3>
                  <p className="text-slate-500">{selectedJob.title} @ {selectedJob.company}</p>
                </div>
                <button onClick={() => setSelectedJob(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleApply} className="p-8 space-y-6">
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">Upload Resume (PDF/DOC)</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-brand-primary transition-colors cursor-pointer relative">
                    <input 
                      type="file" 
                      required
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center">
                      <Upload className="text-slate-400 mb-2" size={32} />
                      <p className="text-slate-600 font-medium">
                        {resumeFile ? resumeFile.name : "Click or drag to upload resume"}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">Max file size: 5MB</p>
                    </div>
                  </div>
                </div>

                <div className="bg-pastel-blue/30 p-4 rounded-2xl flex items-start space-x-3">
                  <Zap size={20} className="text-brand-primary mt-1" />
                  <p className="text-sm text-slate-600">
                    Our AI will automatically highlight your relevant skills to the employer based on this resume.
                  </p>
                </div>

                <button 
                  type="submit"
                  disabled={applying}
                  className="w-full bg-brand-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-brand-primary/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {applying ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      <span>Submit Application</span>
                      <CheckCircle size={20} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
