import React from 'react';
import { motion } from 'motion/react';
import { Search, Briefcase, Users, Zap, CheckCircle, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 bg-gradient-to-br from-pastel-blue via-white to-pastel-pink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-sm border border-white px-4 py-2 rounded-full mb-8"
            >
              <Zap size={16} className="text-brand-primary" />
              <span className="text-sm font-medium text-slate-600">AI-Powered Job Matching is Here</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-tight"
            >
              Find Your Dream Job <br />
              <span className="text-brand-primary">Faster Than Ever</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-600 mb-10 leading-relaxed"
            >
              GetHired uses advanced AI to match your unique skills with the world's most innovative companies. Join the talent network of the future.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <Link 
                to="/auth" 
                className="w-full sm:w-auto bg-brand-primary text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl shadow-brand-primary/30 hover:scale-105 transition-transform flex items-center justify-center space-x-2"
              >
                <span>Find Jobs</span>
                <ArrowRight size={20} />
              </Link>
              <Link 
                to="/auth" 
                className="w-full sm:w-auto bg-white text-slate-800 px-8 py-4 rounded-2xl font-semibold text-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Join Portal
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-pastel-purple rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-pastel-yellow rounded-full blur-3xl opacity-50 animate-pulse" />
      </section>

      {/* Success Metrics */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Active Jobs', value: '12k+' },
              { label: 'Companies', value: '450+' },
              { label: 'Success Rate', value: '94%' },
              { label: 'Talent Network', value: '80k+' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-slate-900 mb-2">{stat.value}</div>
                <div className="text-slate-500 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Matching Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-slate-900 mb-6">AI-Powered Precision</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Stop scrolling through endless job boards. Our AI engine analyzes your resume, projects, and aspirations to find the roles where you'll truly thrive.
              </p>
              <ul className="space-y-4">
                {[
                  'Smart Resume Analysis',
                  'Skill Gap Identification',
                  'Personalized Career Pathing',
                  'Instant Matching Notifications'
                ].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-pastel-green rounded-full flex items-center justify-center text-green-600">
                      <CheckCircle size={16} />
                    </div>
                    <span className="font-medium text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 relative z-10">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                    <Star size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold">Match Score: 98%</h4>
                    <p className="text-sm text-slate-500">Senior Product Designer @ TechFlow</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: '98%' }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="h-full bg-brand-primary"
                    />
                  </div>
                  <p className="text-sm text-slate-600 italic">"Your experience with Figma and React perfectly aligns with TechFlow's current design system initiatives."</p>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-pastel-pink rounded-full blur-3xl opacity-60" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pastel-blue rounded-full blur-3xl opacity-60" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Latest Roles */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Latest Roles</h2>
              <p className="text-slate-500">Fresh opportunities from top-tier companies.</p>
            </div>
            <Link to="/auth" className="text-brand-primary font-semibold flex items-center space-x-1 hover:underline">
              <span>View all</span>
              <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Frontend Engineer', company: 'Lumina', location: 'Remote', salary: '$120k - $160k', color: 'bg-pastel-blue' },
              { title: 'Product Manager', company: 'Vortex', location: 'New York', salary: '$140k - $190k', color: 'bg-pastel-pink' },
              { title: 'Data Scientist', company: 'Neural', location: 'San Francisco', salary: '$150k - $210k', color: 'bg-pastel-green' },
            ].map((job, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className={`${job.color} p-8 rounded-3xl border border-white shadow-sm hover:shadow-xl transition-all cursor-pointer`}
              >
                <div className="bg-white/50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <Briefcase size={24} className="text-slate-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                <p className="text-slate-600 mb-4 font-medium">{job.company} • {job.location}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-800">{job.salary}</span>
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-800">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-brand-primary rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden"
          >
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to Level Up Your Career?</h2>
              <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
                Join thousands of professionals who found their perfect match on GetHired.
              </p>
              <Link 
                to="/auth" 
                className="bg-white text-brand-primary px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:scale-105 transition-transform inline-block"
              >
                Get Started Now
              </Link>
            </div>
            {/* Background blobs */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20">
              <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-10 w-80 h-80 bg-brand-secondary rounded-full blur-3xl" />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
