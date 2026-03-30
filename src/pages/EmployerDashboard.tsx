import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db, storage } from '../firebase';
import { collection, query, addDoc, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Plus, Briefcase, Users, FileText, CheckCircle, X, Upload, Loader2, MapPin, DollarSign, Trash2, ExternalLink } from 'lucide-react';
import { JobPost, Application, OperationType } from '../types';
import { handleFirestoreError } from '../lib/errorHandlers';

export default function EmployerDashboard() {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  
  // New Job Form
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');
  const [specFile, setSpecFile] = useState<File | null>(null);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;

    const jobsQuery = query(collection(db, 'jobs'), where('employerId', '==', auth.currentUser.uid));
    const unsubscribeJobs = onSnapshot(jobsQuery, (snapshot) => {
      setJobs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobPost)));
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'jobs'));

    const appsQuery = query(collection(db, 'applications'), where('employerId', '==', auth.currentUser.uid));
    const unsubscribeApps = onSnapshot(appsQuery, (snapshot) => {
      setApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'applications'));

    return () => {
      unsubscribeJobs();
      unsubscribeApps();
    };
  }, []);

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setPosting(true);
    try {
      let specUrl = '';
      if (specFile) {
        const storageRef = ref(storage, `specs/${auth.currentUser.uid}/${Date.now()}_${specFile.name}`);
        await uploadBytes(storageRef, specFile);
        specUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, 'jobs'), {
        employerId: auth.currentUser.uid,
        title,
        company,
        location,
        salary,
        description,
        specUrl,
        createdAt: new Date().toISOString()
      });

      setShowPostModal(false);
      resetForm();
      alert('Job posted successfully!');
    } catch (error) {
      console.error("Post job error:", error);
      alert('Failed to post job.');
    } finally {
      setPosting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setCompany('');
    setLocation('');
    setSalary('');
    setDescription('');
    setSpecFile(null);
  };

  const updateAppStatus = async (appId: string, status: Application['status']) => {
    try {
      await updateDoc(doc(db, 'applications', appId), { status });
    } catch (error) {
      console.error("Update status error:", error);
    }
  };

  const deleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job post?')) return;
    try {
      await deleteDoc(doc(db, 'jobs', jobId));
    } catch (error) {
      console.error("Delete job error:", error);
    }
  };

  const jobApplications = applications.filter(app => !selectedJobId || app.jobId === selectedJobId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Employer Dashboard</h1>
          <p className="text-slate-500">Manage your job listings and find top talent.</p>
        </div>
        
        <button 
          onClick={() => setShowPostModal(true)}
          className="bg-brand-primary text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-brand-primary/25 hover:scale-105 transition-transform flex items-center space-x-2"
        >
          <Plus size={24} />
          <span>Post New Job</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Job Management */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Your Job Posts</h2>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-brand-primary" size={40} />
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white p-12 rounded-[2rem] text-center border border-slate-100">
              <Briefcase className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="text-slate-500">You haven't posted any jobs yet.</p>
            </div>
          ) : (
            jobs.map(job => (
              <motion.div 
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white p-8 rounded-[2rem] border transition-all cursor-pointer ${
                  selectedJobId === job.id ? 'border-brand-primary ring-4 ring-brand-primary/5' : 'border-slate-100 hover:shadow-lg'
                }`}
                onClick={() => setSelectedJobId(selectedJobId === job.id ? null : job.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-pastel-pink rounded-2xl flex items-center justify-center text-brand-secondary">
                      <Briefcase size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                      <p className="text-slate-600 font-medium mb-2">{job.company}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                        <span className="flex items-center space-x-1"><MapPin size={14} /> <span>{job.location}</span></span>
                        <span className="flex items-center space-x-1"><DollarSign size={14} /> <span>{job.salary}</span></span>
                        <span className="flex items-center space-x-1"><Users size={14} /> <span>{applications.filter(a => a.jobId === job.id).length} Applicants</span></span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteJob(job.id); }}
                      className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Applicants Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 sticky top-24">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
              <Users size={24} className="text-brand-primary" />
              <span>Applicants</span>
            </h2>
            
            <div className="space-y-4">
              {jobApplications.length === 0 ? (
                <p className="text-slate-400 text-center py-8">
                  {selectedJobId ? "No applicants for this job yet." : "Select a job to view applicants."}
                </p>
              ) : (
                jobApplications.map(app => (
                  <div key={app.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-slate-900">{app.jobTitle}</h4>
                        <p className="text-xs text-slate-400">{new Date(app.appliedAt).toLocaleDateString()}</p>
                      </div>
                      <a 
                        href={app.resumeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-brand-primary hover:bg-brand-primary/10 p-2 rounded-lg transition-all"
                      >
                        <ExternalLink size={18} />
                      </a>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => updateAppStatus(app.id, 'accepted')}
                        className={`flex-grow py-2 rounded-lg text-xs font-bold transition-all ${
                          app.status === 'accepted' ? 'bg-green-500 text-white' : 'bg-white text-green-600 border border-green-200 hover:bg-green-50'
                        }`}
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => updateAppStatus(app.id, 'rejected')}
                        className={`flex-grow py-2 rounded-lg text-xs font-bold transition-all ${
                          app.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-white text-red-600 border border-red-200 hover:bg-red-50'
                        }`}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Post Job Modal */}
      <AnimatePresence>
        {showPostModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPostModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-slate-900">Post a New Job</h3>
                <button onClick={() => setShowPostModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handlePostJob} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Job Title</label>
                    <input 
                      type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Senior React Developer"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-brand-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Company Name</label>
                    <input 
                      type="text" required value={company} onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. GetHired AI"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-brand-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Location</label>
                    <input 
                      type="text" required value={location} onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Remote / New York"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-brand-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Salary Range</label>
                    <input 
                      type="text" required value={salary} onChange={(e) => setSalary(e.target.value)}
                      placeholder="e.g. $120k - $150k"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-brand-primary/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Job Description</label>
                  <textarea 
                    required value={description} onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the role, responsibilities, and requirements..."
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-brand-primary/20"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">Job Specification Document (Optional)</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-brand-primary transition-colors cursor-pointer relative">
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setSpecFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center">
                      <Upload className="text-slate-400 mb-2" size={24} />
                      <p className="text-slate-600 text-sm font-medium">
                        {specFile ? specFile.name : "Upload job spec (PDF/DOC)"}
                      </p>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={posting}
                  className="w-full bg-brand-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-brand-primary/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {posting ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      <span>Post Job Listing</span>
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
