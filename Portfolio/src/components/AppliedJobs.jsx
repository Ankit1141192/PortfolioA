import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText, 
  Send, 
  Trash2, 
  Search, 
  Plus, 
  Filter, 
  RefreshCw, 
  BarChart2, 
  PieChart, 
  Building, 
  ExternalLink,
  Mail,
  ChevronDown,
  Check,
  X,
  TrendingUp,
  FileCheck,
  ArrowLeft,
  Database,
  Activity,
  Wifi,
  Terminal,
  Sun,
  Moon,
  MessageSquare
} from 'lucide-react';
import { backendApi } from '../config/api';
import { jobTemplates } from '../utils/templates';

export default function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'apply' | 'history'
  
  // Local Dark Mode state - defaults to false (bright/light mode first)
  const [localDarkMode, setLocalDarkMode] = useState(false);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  // Form State
  const [formData, setFormData] = useState({
    applicantEmail: 'ankit2914978@gmail.com',
    hrEmail: '',
    hrPhone: '',
    companyName: '',
    source: 'LinkedIn',
    jobUrl: '',
    position: 'react-native-developer',
    message: '',
    applicationType: 'Email' // 'Email' | 'WhatsApp'
  });
  const [resume, setResume] = useState(null);
  const [resumeError, setResumeError] = useState('');
  const [showEmailPreview, setShowEmailPreview] = useState(true);
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });

  // Inline action loading state
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Clock state
  const [timeStr, setTimeStr] = useState(new Date().toLocaleTimeString());

  // Logs terminal state
  const [logs, setLogs] = useState([
    `[${new Date().toLocaleTimeString()}] DB_INIT: Establishing connection to MongoDB Cluster0...`,
    `[${new Date().toLocaleTimeString()}] DB_INIT: Connected successfully to database JobPortal.`,
    `[${new Date().toLocaleTimeString()}] SMTP_INIT: Verifying SMTP/WhatsApp configuration pipelines...`,
    `[${new Date().toLocaleTimeString()}] PLATFORM: Environment initialized and READY.`
  ]);

  const terminalEndRef = useRef(null);

  const addLog = (message) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Fetch applications on load
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendApi}/api/applications`);
      if (!res.ok) throw new Error('Failed to fetch applications');
      const data = await res.json();
      setApplications(data);
      addLog(`QUERY: Fetched ${data.length} application records from remote database.`);
      addLog("SYSTEM: Telemetry statistics compiled successfully.");
    } catch (err) {
      console.error(err);
      addLog(`ERROR: Failed to retrieve application data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Update template body when position or applicationType changes
  useEffect(() => {
    const template = jobTemplates[formData.position];
    if (template) {
      if (formData.applicationType === 'Email') {
        setFormData(prev => ({
          ...prev,
          message: template.body
        }));
      } else {
        const resumeLink = "https://drive.google.com/uc?export=download&id=1u12VQo7UlR_64m9-lU0Zc4DbgASlWDQS";
        setFormData(prev => ({
          ...prev,
          message: `Hello! I'm Ankit Kumar. I would like to apply for the ${template.label} role at ${prev.companyName || 'your company'}.\n\nHere is my resume link:\n${resumeLink}\n\nLooking forward to connecting!`
        }));
      }
    }
  }, [formData.position, formData.applicationType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setResumeError('File size must be under 5MB');
        setResume(null);
      } else {
        setResumeError('');
        setResume(file);
        addLog(`ATTACHMENT: Loaded local document "${file.name}" (${(file.size / 1024).toFixed(1)} KB).`);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!resume && formData.applicationType === 'Email') {
      setResumeError('Resume file is required for Email applications.');
      return;
    }

    setSubmitting(true);
    setFormStatus({ type: '', message: '' });
    addLog(`PROCESS: Starting application submission process via ${formData.applicationType} for ${formData.companyName}...`);
    
    if (formData.applicationType === 'Email') {
      addLog("SMTP: Compiling email cover letter targeting candidate position.");
    } else {
      addLog("WHATSAPP: Compiling metadata and preparing short message...");
    }

    const submissionData = new FormData();
    submissionData.append('companyName', formData.companyName);
    submissionData.append('source', formData.source);
    submissionData.append('jobUrl', formData.jobUrl);
    submissionData.append('position', jobTemplates[formData.position].label);
    submissionData.append('message', formData.message);
    if (resume) {
      submissionData.append('resume', resume);
    }
    submissionData.append('applicationType', formData.applicationType);

    if (formData.applicationType === 'Email') {
      submissionData.append('applicantEmail', formData.applicantEmail);
      submissionData.append('hrEmail', formData.hrEmail);
    } else {
      submissionData.append('hrPhone', formData.hrPhone);
    }

    try {
      const res = await fetch(`${backendApi}/api/send-email`, {
        method: 'POST',
        body: submissionData
      });

      const result = await res.json();

      if (res.ok) {
        if (formData.applicationType === 'Email') {
          setFormStatus({ type: 'success', message: 'Application sent and saved successfully!' });
          addLog(`SMTP: Outbound mail delivered successfully to ${formData.hrEmail}.`);
          addLog("DB_WRITE: Saved job application metadata to Cluster0 database.");
        } else {
          setFormStatus({ type: 'success', message: 'Application saved! Redirecting to WhatsApp...' });
          addLog(`WHATSAPP: Resume link resolved: ${result.resumeUrl}`);
          addLog("DB_WRITE: Saved job application metadata to Cluster0 database.");
          addLog("WHATSAPP: Launching WhatsApp Business API portal link...");

          // Build WhatsApp click-to-chat URL using customized message
          const waUrl = `https://api.whatsapp.com/send?phone=${formData.hrPhone.replace(/\D/g, '')}&text=${encodeURIComponent(formData.message)}`;
          
          // Open WhatsApp link in a new window/tab
          window.open(waUrl, '_blank');
        }
        
        // Reset non-static fields
        setFormData(prev => ({
          ...prev,
          hrEmail: '',
          hrPhone: '',
          companyName: '',
          jobUrl: '',
          message: jobTemplates[prev.position]?.body || ''
        }));
        setResume(null);
        fetchApplications();
        // Switch to history tab after short delay
        setTimeout(() => {
          setActiveTab('history');
          setFormStatus({ type: '', message: '' });
        }, 1500);
      } else {
        setFormStatus({ type: 'error', message: result.error || 'Failed to submit application.' });
        addLog(`ERROR: Application process aborted. Details: ${result.error || 'Server error'}`);
      }
    } catch (error) {
      console.error(error);
      setFormStatus({ type: 'error', message: 'Server connection failed. Make sure backend is running.' });
      addLog(`ERROR: SMTP/DB request failed. Check server status.`);
    } finally {
      setSubmitting(false);
    }
  };

  // Update application status
  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    addLog(`DB_WRITE: Requesting status update for record ${id} to "${newStatus}"...`);
    try {
      const res = await fetch(`${backendApi}/api/applications/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error('Failed to update status');
      
      // Update local state
      setApplications(prev => prev.map(app => app._id === id ? { ...app, status: newStatus } : app));
      addLog(`DB_WRITE: Record ${id} status updated successfully.`);
    } catch (err) {
      alert(err.message);
      addLog(`ERROR: Failed to update status for record ${id}: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete application
  const handleDeleteApplication = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application record?')) return;
    setDeletingId(id);
    addLog(`DB_WRITE: Requesting hard deletion of application record ${id}...`);
    try {
      const res = await fetch(`${backendApi}/api/applications/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete application');
      
      setApplications(prev => prev.filter(app => app._id !== id));
      addLog(`DB_WRITE: Record ${id} deleted from database.`);
    } catch (err) {
      alert(err.message);
      addLog(`ERROR: Deletion failed for record ${id}: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const toggleLocalDarkMode = () => {
    setLocalDarkMode(prev => !prev);
    addLog(`THEME: Switched interface to ${!localDarkMode ? 'DARK' : 'LIGHT'} telemetry mode.`);
  };

  // Calculate stats
  const totalApplied = applications.length;
  const interviewingCount = applications.filter(app => app.status === 'Interviewing').length;
  const offeredCount = applications.filter(app => app.status === 'Offered').length;
  const rejectedCount = applications.filter(app => app.status === 'Rejected').length;
  const appliedOnlyCount = applications.filter(app => app.status === 'Applied').length;
  const archivedCount = applications.filter(app => app.status === 'Archived').length;

  // Response rate is the % of apps that progressed past "Applied"
  const respondedApps = totalApplied - appliedOnlyCount;
  const responseRate = totalApplied > 0 ? Math.round((respondedApps / totalApplied) * 100) : 0;
  const offerRate = totalApplied > 0 ? Math.round((offeredCount / totalApplied) * 100) : 0;

  // Filter application list
  const filteredApplications = applications.filter(app => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = 
      app.companyName?.toLowerCase().includes(query) ||
      app.position?.toLowerCase().includes(query) ||
      app.hrEmail?.toLowerCase().includes(query) ||
      app.hrPhone?.toLowerCase().includes(query);
      
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || app.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  // Unique sources for filter dropdown
  const uniqueSources = ['LinkedIn', 'Naukri', 'Indeed', 'Direct', 'Other'];

  // Status Styling helpers
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Offered':
        return 'bg-emerald-950/40 text-emerald-400 border-emerald-900/50';
      case 'Interviewing':
        return 'bg-amber-950/40 text-amber-500 border-amber-900/50';
      case 'Rejected':
        return 'bg-rose-950/40 text-rose-400 border-rose-900/50';
      case 'Archived':
        return 'bg-slate-800 text-slate-400 border-slate-700/50';
      default:
        return 'bg-blue-950/40 text-blue-400 border-blue-900/50';
    }
  };

  // Source Stats mapping
  const sourceStats = uniqueSources.reduce((acc, source) => {
    acc[source] = applications.filter(app => app.source === source).length;
    return acc;
  }, {});

  // Custom premium Donut Chart data preparation
  const segments = [
    { name: 'Applied', count: appliedOnlyCount, color: '#3b82f6' },
    { name: 'Interviewing', count: interviewingCount, color: '#f59e0b' },
    { name: 'Offered', count: offeredCount, color: '#10b981' },
    { name: 'Rejected', count: rejectedCount, color: '#ef4444' },
    { name: 'Archived', count: archivedCount, color: '#64748b' }
  ].filter(s => s.count > 0);

  let accumulatedPercent = 0;

  // Custom premium Bar Chart data preparation
  const maxSourceCount = Math.max(...Object.values(sourceStats), 1);
  const sourceList = [
    { name: 'LinkedIn', count: sourceStats['LinkedIn'] || 0, color: 'from-blue-600 to-indigo-650' },
    { name: 'Naukri', count: sourceStats['Naukri'] || 0, color: 'from-indigo-600 to-purple-650' },
    { name: 'Indeed', count: sourceStats['Indeed'] || 0, color: 'from-sky-600 to-blue-650' },
    { name: 'Direct', count: sourceStats['Direct'] || 0, color: 'from-emerald-600 to-teal-650' },
    { name: 'Other', count: sourceStats['Other'] || 0, color: 'from-slate-650 to-slate-750' }
  ];

  // Line numbers helper for template editor
  const lineCount = formData.message.split('\n').length || 1;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 12) }, (_, i) => i + 1);

  // Dynamic Tailwind Theme Class Helpers
  const pageBg = localDarkMode 
    ? 'bg-slate-950 text-slate-100 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.12),rgba(255,255,255,0))]' 
    : 'bg-slate-50 text-slate-800 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.06),rgba(255,255,255,0))]';

  const topBarBorder = localDarkMode ? 'border-slate-900 text-slate-400' : 'border-slate-200 text-slate-600';
  
  const backBtnClass = localDarkMode 
    ? 'border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-300 hover:text-white' 
    : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900';

  const cardBg = localDarkMode ? 'bg-slate-900/50 border-slate-900 shadow-md' : 'bg-white border-slate-200 shadow-sm';
  const borderClass = localDarkMode ? 'border-slate-900' : 'border-slate-200';
  const subBorderClass = localDarkMode ? 'border-slate-800' : 'border-slate-100';
  const titleColor = localDarkMode ? 'text-slate-200' : 'text-slate-800';
  const textColor = localDarkMode ? 'text-slate-400' : 'text-slate-500';
  const labelColor = localDarkMode ? 'text-slate-400 font-mono' : 'text-slate-500 font-mono';
  
  const tabsBg = localDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-200/50 border-slate-300';
  
  const activeTabClass = localDarkMode 
    ? 'bg-slate-800 border border-slate-700 text-white shadow-lg shadow-indigo-500/5' 
    : 'bg-white border border-slate-300 text-slate-900 shadow-sm';
    
  const inactiveTabClass = localDarkMode ? 'text-slate-450 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900';

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans antialiased ${pageBg}`}>
      <div className="pt-8 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* Technical Top Utility Bar */}
        <div className={`flex items-center justify-between mb-8 pb-4 border-b text-xs font-mono ${topBarBorder}`}>
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition ${backBtnClass}`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Portfolio</span>
            </Link>
            <span className="hidden sm:inline text-slate-700">|</span>
            <span className="hidden sm:inline">Ankit Job Platform V2</span>
          </div>
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleLocalDarkMode}
              className={`p-1.5 rounded-lg border transition duration-300 cursor-pointer ${
                localDarkMode 
                  ? 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-amber-400' 
                  : 'border-slate-200 bg-white hover:bg-slate-100 text-indigo-600'
              }`}
              title="Toggle Bright/Dark Mode"
            >
              {localDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <span className="text-slate-400 font-bold">{timeStr}</span>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-emerald-500 font-bold">LIVE TELEMETRY</span>
            </div>
          </div>
        </div>

        {/* Premium Header */}
        <div className={`flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b ${borderClass}`}>
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/20 text-indigo-500 border border-indigo-900/20 mb-3">
              <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
              <span>Job Applied Center</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Ankit's Applied Jobs Platform
            </h1>
            <p className={`${textColor} mt-2 text-sm md:text-base`}>
              Track applications, send professional HR cover letters, and analyze outcomes.
            </p>
          </div>

          {/* Tab Buttons */}
          <div className={`flex items-center w-full md:w-auto overflow-x-auto justify-between md:justify-start space-x-1 mt-6 md:mt-0 p-1 rounded-xl border backdrop-blur-sm scrollbar-none ${tabsBg}`}>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'analytics' ? activeTabClass : inactiveTabClass
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" />
              <span>Analytics</span>
            </button>
            
            <button
              onClick={() => setActiveTab('apply')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'apply' ? activeTabClass : inactiveTabClass
              }`}
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" />
              <span>New Apply</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all relative cursor-pointer whitespace-nowrap ${
                activeTab === 'history' ? activeTabClass : inactiveTabClass
              }`}
            >
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" />
              <span>Tracker</span>
              {totalApplied > 0 && (
                <span className="absolute -top-1.5 -right-1 bg-indigo-500 text-white rounded-full text-[9px] w-3.5 h-3.5 flex items-center justify-center font-bold">
                  {totalApplied}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && applications.length === 0 && (
          <div className={`flex flex-col items-center justify-center py-20 rounded-2xl border ${borderClass} bg-slate-900/10`}>
            <RefreshCw className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
            <p className={`${textColor} font-mono text-xs`}>Loading platform database...</p>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 1: ANALYTICS DASHBOARD                 */}
        {/* ========================================== */}
        {activeTab === 'analytics' && !loading && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Dashboard Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              
              <div className={`p-6 rounded-2xl border flex flex-col justify-between hover:border-slate-700 transition-all duration-300 relative overflow-hidden group ${cardBg}`}>
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-24 h-24 text-blue-600" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${labelColor}`}>Total Applied</span>
                <div className="mt-4">
                  <span className={`text-3xl md:text-4xl font-extrabold font-mono ${titleColor}`}>{totalApplied}</span>
                  <p className="text-xs text-slate-400 mt-1">Applications logged</p>
                  <div className="flex items-center space-x-1.5 mt-2 text-[9px] font-mono text-slate-550">
                    <span>Mail: {applications.filter(a => a.applicationType !== 'WhatsApp').length}</span>
                    <span>•</span>
                    <span className="text-emerald-500 font-bold">WA: {applications.filter(a => a.applicationType === 'WhatsApp').length}</span>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-2xl border flex flex-col justify-between hover:border-slate-700 transition-all duration-300 relative overflow-hidden group ${cardBg}`}>
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                  <Clock className="w-24 h-24 text-amber-500" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${labelColor}`}>Interviewing</span>
                <div className="mt-4">
                  <span className="text-3xl md:text-4xl font-extrabold text-amber-500 font-mono">{interviewingCount}</span>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    {totalApplied > 0 ? Math.round((interviewingCount / totalApplied) * 100) : 0}% transition
                  </p>
                </div>
              </div>

              <div className={`p-6 rounded-2xl border flex flex-col justify-between hover:border-slate-700 transition-all duration-300 relative overflow-hidden group ${cardBg}`}>
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-24 h-24 text-emerald-500" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${labelColor}`}>Offers Received</span>
                <div className="mt-4">
                  <span className="text-3xl md:text-4xl font-extrabold text-emerald-500 font-mono">{offeredCount}</span>
                  <p className="text-xs text-slate-400 mt-1 font-mono">{offerRate}% success rate</p>
                </div>
              </div>

              <div className={`p-6 rounded-2xl border flex flex-col justify-between hover:border-slate-700 transition-all duration-300 relative overflow-hidden group ${cardBg}`}>
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                  <AlertCircle className="w-24 h-24 text-rose-500" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${labelColor}`}>Rejected</span>
                <div className="mt-4">
                  <span className="text-3xl md:text-4xl font-extrabold text-rose-500 font-mono">{rejectedCount}</span>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    {totalApplied > 0 ? Math.round((rejectedCount / totalApplied) * 100) : 0}% closure
                  </p>
                </div>
              </div>

              <div className={`p-6 rounded-2xl border col-span-2 md:col-span-1 lg:col-span-1 flex flex-col justify-between hover:border-slate-700 transition-all duration-300 relative overflow-hidden group ${cardBg}`}>
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-24 h-24 text-indigo-500" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${labelColor}`}>Response Rate</span>
                <div className="mt-4">
                  <span className="text-3xl md:text-4xl font-extrabold text-indigo-500 font-mono">{responseRate}%</span>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full rounded-full" style={{ width: `${responseRate}%` }}></div>
                  </div>
                </div>
              </div>

            </div>

            {totalApplied === 0 ? (
              <div className={`rounded-2xl p-12 text-center border ${borderClass} ${localDarkMode ? 'bg-slate-900/40' : 'bg-white'}`}>
                <Briefcase className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <h3 className={`text-base font-bold ${titleColor}`}>No Application Data Found</h3>
                <p className={`${textColor} max-w-sm mx-auto mt-2 text-xs`}>
                  Create a new job log or apply via email/WhatsApp under the "New Apply" tab. Telemetry and metrics will process instantly.
                </p>
                <button
                  onClick={() => setActiveTab('apply')}
                  className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition shadow-lg shadow-indigo-500/10 cursor-pointer"
                >
                  Log First Application
                </button>
              </div>
            ) : (
              <div className="grid lg:grid-cols-12 gap-6">
                
                {/* Visual Premium SVG Donut Chart */}
                <div className={`p-6 md:p-8 rounded-2xl border flex flex-col justify-between lg:col-span-5 ${cardBg}`}>
                  <div>
                    <h3 className={`text-sm font-bold flex items-center space-x-2 font-mono ${titleColor}`}>
                      <PieChart className="w-4 h-4 text-indigo-500" />
                      <span>APPLICATION STATUS BREAKDOWN</span>
                    </h3>
                    <p className={`text-[11px] ${textColor} mt-1`}>Status stages distribution analysis</p>
                  </div>

                  <div className="my-6 flex items-center justify-center relative">
                    {/* Donut SVG */}
                    <svg className="w-36 h-36 sm:w-44 sm:h-44 transform -rotate-90" viewBox="0 0 100 100">
                      {/* Base Background Track */}
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="38" 
                        fill="transparent" 
                        className={localDarkMode ? 'stroke-slate-800/80' : 'stroke-slate-100'} 
                        strokeWidth="8" 
                      />
                      
                      {/* Outer technical dash ring */}
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="44" 
                        fill="transparent" 
                        className={localDarkMode ? 'stroke-slate-800/40' : 'stroke-slate-200/50'} 
                        strokeWidth="0.75" 
                        strokeDasharray="4 2" 
                      />

                      {/* Segments */}
                      {(() => {
                        let accumulated = 0;
                        return segments.map((seg, idx) => {
                          const percentage = (seg.count / totalApplied) * 100;
                          const strokeDasharray = `${percentage} ${100 - percentage}`;
                          const strokeDashoffset = -accumulated;
                          accumulated += percentage;

                          return (
                            <circle
                              key={idx}
                              cx="50"
                              cy="50"
                              r="38"
                              fill="transparent"
                              stroke={seg.color}
                              strokeWidth="8"
                              strokeDasharray={strokeDasharray}
                              strokeDashoffset={strokeDashoffset}
                              pathLength="100"
                              strokeLinecap="butt"
                              className="transition-all duration-300 hover:stroke-[10px] cursor-pointer"
                            />
                          );
                        });
                      })()}
                    </svg>

                    {/* Inside Donut Text */}
                    <div className="absolute flex flex-col items-center justify-center font-mono">
                      <span className={`text-2xl font-black ${localDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{totalApplied}</span>
                      <span className={`text-[9px] uppercase tracking-wider font-semibold ${textColor}`}>Total Jobs</span>
                    </div>
                  </div>

                  {/* Donut Legend */}
                  <div className={`grid grid-cols-2 gap-2 text-[10px] font-mono border-t pt-4 ${borderClass}`}>
                    {segments.map((seg, idx) => (
                      <div key={idx} className={`flex items-center justify-between p-2 rounded-xl border ${
                        localDarkMode ? 'bg-slate-950/60 border-slate-900 text-slate-350' : 'bg-slate-50 border-slate-100 text-slate-700'
                      }`}>
                        <div className="flex items-center space-x-1.5 min-w-0">
                          <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ backgroundColor: seg.color }}></span>
                          <span className="truncate">{seg.name}</span>
                        </div>
                        <span className="font-bold ml-1">{seg.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Source Visual Bar Graph */}
                <div className={`p-6 md:p-8 rounded-2xl border flex flex-col justify-between lg:col-span-7 ${cardBg}`}>
                  <div>
                    <h3 className={`text-sm font-bold flex items-center space-x-2 font-mono ${titleColor}`}>
                      <BarChart2 className="w-4 h-4 text-blue-500" />
                      <span>APPLICATION VOLUME BY SOURCE</span>
                    </h3>
                    <p className={`text-[11px] ${textColor} mt-1`}>Platform origin metrics</p>
                  </div>

                  <div className="flex h-48 mt-6">
                    {/* Y-axis Labels */}
                    <div className="flex flex-col justify-between text-[8px] sm:text-[9px] font-mono text-slate-400 pb-8 pr-1.5 select-none text-right min-w-[1.2rem]">
                      <span>{maxSourceCount}</span>
                      <span>{Math.round(maxSourceCount / 2)}</span>
                      <span>0</span>
                    </div>

                    {/* Chart Area */}
                    <div className={`flex-1 relative flex items-end justify-between px-2 pb-8 border-b border-l ${localDarkMode ? 'border-slate-800/80' : 'border-slate-200'}`}>
                      {/* Grid Background Lines */}
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pr-1">
                        <div className={`w-full h-0 border-t ${localDarkMode ? 'border-slate-900/40' : 'border-slate-100'}`}></div>
                        <div className={`w-full h-0 border-t ${localDarkMode ? 'border-slate-900/40' : 'border-slate-100'}`}></div>
                        <div className={`w-full h-0 border-t ${localDarkMode ? 'border-slate-900/40' : 'border-slate-100'}`}></div>
                        <div className={`w-full h-0 border-t ${localDarkMode ? 'border-slate-900/40' : 'border-slate-100'}`}></div>
                      </div>

                      {/* Columns */}
                      {sourceList.map(item => {
                        const heightPercent = maxSourceCount > 0 ? (item.count / maxSourceCount) * 110 : 0;
                        return (
                          <div key={item.name} className="flex flex-col items-center flex-1 group z-10 px-1">
                            {/* Tooltip badge */}
                            <span className={`text-[9px] font-mono font-bold border px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 mb-1 ${
                              localDarkMode ? 'bg-slate-900 text-slate-300 border-slate-800' : 'bg-white text-slate-700 border-slate-200 shadow-md'
                            }`}>
                              {item.count}
                            </span>
                            {/* Bar body */}
                            <div 
                              className={`w-full max-w-[2.2rem] bg-gradient-to-t ${item.color} rounded-t-sm transition-all duration-300 group-hover:brightness-110 shadow-lg relative`}
                              style={{ height: `${Math.max(heightPercent, 4)}px` }}
                            >
                              {/* Top glowing cap */}
                              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-white/20"></div>
                            </div>
                            {/* Label */}
                            <span className={`text-[9px] sm:text-[10px] font-mono mt-2 truncate w-full text-center ${textColor}`}>
                              {item.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className={`text-[11px] mt-4 flex items-center space-x-2 font-mono ${textColor}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span>Live application source feeds mapped automatically.</span>
                  </div>
                </div>

                {/* Recent Activity Feed */}
                <div className={`p-6 md:p-8 rounded-2xl border lg:col-span-12 ${cardBg}`}>
                  <h3 className={`text-sm font-bold flex items-center space-x-2 mb-6 font-mono ${titleColor}`}>
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <span>RECENT JOB APPLICATIONS LOG</span>
                  </h3>

                  <div className="flow-root">
                    <ul className="-mb-8">
                      {applications.slice(0, 4).map((app, appIdx) => (
                        <li key={app._id}>
                          <div className="relative pb-8">
                            {appIdx !== applications.slice(0, 4).length - 1 ? (
                              <span className={`absolute top-4 left-4 -ml-px h-full w-0.5 ${localDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} aria-hidden="true" />
                            ) : null}
                            <div className="relative flex space-x-3">
                              <div>
                                <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ${
                                  localDarkMode ? 'ring-slate-950' : 'ring-white'
                                } ${
                                  app.status === 'Offered' ? 'bg-emerald-600' :
                                  app.status === 'Interviewing' ? 'bg-amber-600' :
                                  app.status === 'Rejected' ? 'bg-rose-600' : 'bg-blue-600'
                                }`}>
                                  <Briefcase className="w-3.5 h-3.5 text-white" />
                                </span>
                              </div>
                              <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p className={`text-xs font-semibold ${localDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                    Applied to <span className="font-bold text-indigo-600 dark:text-indigo-400">{app.companyName || 'Unknown'}</span> as <span className="font-bold">{app.position}</span>
                                    {app.applicationType === 'WhatsApp' && (
                                      <span className="ml-2 inline-flex items-center space-x-0.5 px-1.5 py-0.2 rounded bg-emerald-900/20 text-emerald-650 border border-emerald-500/25 text-[8.5px] font-mono">
                                        <MessageSquare className="w-2.5 h-2.5" />
                                        <span>WA</span>
                                      </span>
                                    )}
                                  </p>
                                  <p className={`text-[10px] mt-0.5 font-mono ${textColor}`}>
                                    Source: {app.source || 'N/A'} • {app.applicationType === 'WhatsApp' ? `WA: ${app.hrPhone}` : `HR: ${app.hrEmail}`}
                                  </p>
                                </div>
                                <div className={`text-right text-[11px] whitespace-nowrap ${textColor}`}>
                                  <time dateTime={app.appliedDate} className="font-mono">{new Date(app.appliedDate).toLocaleDateString()}</time>
                                  <span className={`block mt-1 px-2 py-0.5 text-[9px] rounded-full text-center font-bold border ${getStatusBadgeClass(app.status)}`}>
                                    {app.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Simulated Terminal Console */}
                <div className={`rounded-2xl border shadow-xl overflow-hidden lg:col-span-12 font-mono ${
                  localDarkMode ? 'bg-slate-950 border-slate-900' : 'bg-slate-900 border-slate-750'
                }`}>
                  {/* Terminal Header */}
                  <div className={`px-4 py-2 border-b flex items-center justify-between ${
                    localDarkMode ? 'bg-slate-900 border-slate-950' : 'bg-slate-800 border-slate-900'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-semibold text-slate-300">sys_log_analyzer@ankit-os:~</span>
                    </div>
                    <div className="flex space-x-1.5">
                      <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    </div>
                  </div>
                  {/* Terminal Content */}
                  <div className="p-4 h-40 overflow-y-auto space-y-1.5 text-xs text-emerald-450 select-text scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                    {logs.map((log, index) => (
                      <div key={index} className="leading-relaxed whitespace-pre-wrap">
                        <span className="text-slate-500 select-none hidden sm:inline">guest@ankit-platform:$ </span>
                        <span className="text-slate-500 select-none sm:hidden">$ </span>
                        {log}
                      </div>
                    ))}
                    <div ref={terminalEndRef} />
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: NEW APPLICATION FORM                */}
        {/* ========================================== */}
        {activeTab === 'apply' && (
          <div className="grid lg:grid-cols-12 gap-8 animate-fadeIn">
            
            {/* Form Column */}
            <div className={`p-6 md:p-8 rounded-2xl border lg:col-span-7 ${cardBg}`}>
              <h3 className={`text-sm font-bold flex items-center space-x-2 mb-6 font-mono ${titleColor}`}>
                <FileCheck className="w-4 h-4 text-indigo-500" />
                <span>COMPOSE APPLICATION DETAILS & PIPELINE</span>
              </h3>

              {formStatus.message && (
                <div className={`mb-6 p-4 rounded-xl border flex items-start space-x-3 ${
                  formStatus.type === 'success' 
                    ? 'bg-emerald-900/20 text-emerald-500 border-emerald-900/30' 
                    : 'bg-rose-900/20 text-rose-500 border-rose-900/30'
                }`}>
                  {formStatus.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  )}
                  <span className="text-xs font-semibold font-mono">{formStatus.message}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-5">
                
                {/* Application Type Selector */}
                <div>
                  <label className={`block mb-2 text-[10px] font-bold uppercase tracking-wider font-mono ${labelColor}`}>APPLICATION ROUTING METHOD</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, applicationType: 'Email' }))}
                      className={`py-3 rounded-xl border font-bold text-xs flex items-center justify-center space-x-2 transition cursor-pointer ${
                        formData.applicationType === 'Email'
                          ? 'bg-indigo-500/10 border-indigo-500 text-indigo-650 dark:text-indigo-400 font-bold'
                          : `${localDarkMode ? 'border-slate-805 bg-slate-950/40 text-slate-400' : 'border-slate-200 bg-white text-slate-600'} hover:text-indigo-500`
                      }`}
                    >
                      <Mail className="w-4 h-4" />
                      <span>Email cover letter</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, applicationType: 'WhatsApp' }))}
                      className={`py-3 rounded-xl border font-bold text-xs flex items-center justify-center space-x-2 transition cursor-pointer ${
                        formData.applicationType === 'WhatsApp'
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                          : `${localDarkMode ? 'border-slate-805 bg-slate-950/40 text-slate-400' : 'border-slate-200 bg-white text-slate-600'} hover:text-emerald-500`
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>WhatsApp Message</span>
                    </button>
                  </div>
                </div>

                {/* Form Grid */}
                <div className="grid sm:grid-cols-2 gap-5">
                  
                  {formData.applicationType === 'Email' ? (
                    <>
                      <div>
                        <label className={`block mb-1.5 text-[10px] font-bold uppercase tracking-wider font-mono ${labelColor}`}>Applicant Email Address</label>
                        <input
                          type="email"
                          name="applicantEmail"
                          required
                          value={formData.applicantEmail}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs font-medium ${
                            localDarkMode ? 'border-slate-800 bg-slate-950/80 text-slate-200' : 'border-slate-200 bg-white text-slate-800'
                          }`}
                          placeholder="e.g. ankit2914978@gmail.com"
                        />
                      </div>

                      <div>
                        <label className={`block mb-1.5 text-[10px] font-bold uppercase tracking-wider font-mono ${labelColor}`}>HR Email Address(es)</label>
                        <input
                          type="email"
                          name="hrEmail"
                          required
                          value={formData.hrEmail}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs font-medium ${
                            localDarkMode ? 'border-slate-800 bg-slate-950/80 text-slate-200' : 'border-slate-200 bg-white text-slate-800'
                          }`}
                          placeholder="e.g. hr@company.com"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="sm:col-span-2">
                      <label className={`block mb-1.5 text-[10px] font-bold uppercase tracking-wider font-mono ${labelColor}`}>HR WhatsApp / Mobile Number (with country code, e.g. 919876543210)</label>
                      <input
                        type="text"
                        name="hrPhone"
                        required
                        value={formData.hrPhone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs font-medium ${
                          localDarkMode ? 'border-slate-800 bg-slate-950/80 text-slate-200' : 'border-slate-200 bg-white text-slate-800'
                        }`}
                        placeholder="e.g. 919876543210"
                      />
                    </div>
                  )}

                  <div>
                    <label className={`block mb-1.5 text-[10px] font-bold uppercase tracking-wider font-mono ${labelColor}`}>Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs font-medium ${
                        localDarkMode ? 'border-slate-800 bg-slate-950/80 text-slate-200' : 'border-slate-200 bg-white text-slate-800'
                      }`}
                      placeholder="e.g. Google"
                    />
                  </div>

                  <div>
                    <label className={`block mb-1.5 text-[10px] font-bold uppercase tracking-wider font-mono ${labelColor}`}>Job Board Source</label>
                    <select
                      name="source"
                      value={formData.source}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs font-medium cursor-pointer ${
                        localDarkMode ? 'border-slate-800 bg-slate-950/80 text-slate-200' : 'border-slate-200 bg-white text-slate-800'
                      }`}
                    >
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Naukri">Naukri</option>
                      <option value="Indeed">Indeed</option>
                      <option value="Direct">Direct Application</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block mb-1.5 text-[10px] font-bold uppercase tracking-wider font-mono ${labelColor}`}>Applying Position</label>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs font-medium cursor-pointer ${
                        localDarkMode ? 'border-slate-800 bg-slate-950/80 text-slate-200' : 'border-slate-200 bg-white text-slate-800'
                      }`}
                    >
                      {Object.keys(jobTemplates).map(key => (
                        <option key={key} value={key}>
                          {jobTemplates[key].label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block mb-1.5 text-[10px] font-bold uppercase tracking-wider font-mono ${labelColor}`}>Job Posting Link</label>
                    <input
                      type="url"
                      name="jobUrl"
                      value={formData.jobUrl}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs font-medium ${
                        localDarkMode ? 'border-slate-800 bg-slate-950/80 text-slate-200' : 'border-slate-200 bg-white text-slate-800'
                      }`}
                      placeholder="https://linkedin.com/jobs/..."
                    />
                  </div>

                </div>

                {/* Resume File Upload */}
                <div>
                  <label className={`block mb-1.5 text-[10px] font-bold uppercase tracking-wider font-mono ${labelColor}`}>
                    Attach Resume {formData.applicationType === 'Email' ? '(Required)' : '(Optional - defaults to portfolio resume)'}
                  </label>
                  <div className={`relative border border-dashed rounded-2xl p-6 transition flex flex-col items-center justify-center cursor-pointer group bg-slate-950/10 ${
                    localDarkMode ? 'border-slate-800 hover:border-slate-700' : 'border-slate-200 hover:border-slate-400'
                  }`}>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <FileText className="w-8 h-8 text-slate-500 group-hover:text-indigo-400 transition-colors mb-2" />
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-300">
                      {resume ? resume.name : 'Click to select or drag resume file'}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1">PDF, DOC, DOCX up to 5MB</span>
                  </div>
                  {resumeError && (
                    <p className="text-[11px] text-rose-500 font-bold mt-1.5 font-mono">{resumeError}</p>
                  )}
                </div>

                {/* Cover Letter Code Editor Header */}
                <div className={`flex items-center justify-between border-t pt-4 ${borderClass}`}>
                  <div>
                    <span className={`text-xs font-semibold ${titleColor}`}>Cover Letter / Template Body</span>
                    <p className={`text-[10px] ${textColor}`}>Markdown draft editor</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowEmailPreview(!showEmailPreview)}
                    className={`px-3 py-1.5 border hover:bg-slate-850 rounded-lg text-[10px] font-mono transition flex items-center space-x-1 cursor-pointer ${
                      localDarkMode ? 'border-slate-800 text-slate-350' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <span>{showEmailPreview ? 'Collapse Editor' : 'Open IDE Editor'}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showEmailPreview ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Monospace Code Editor Component */}
                {showEmailPreview && (
                  <div className={`rounded-xl border overflow-hidden font-mono shadow-lg animate-fadeIn ${
                    localDarkMode ? 'bg-slate-950 border-slate-900' : 'bg-slate-900 border-slate-800'
                  }`}>
                    {/* Editor Tab Bar */}
                    <div className={`px-4 py-2 border-b flex items-center justify-between ${
                      localDarkMode ? 'bg-slate-900 border-slate-950' : 'bg-slate-850 border-slate-900'
                    }`}>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-xs font-semibold text-slate-300">cover_letter.md</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase border border-slate-800 px-1 py-0.2 rounded">DRAFTING</span>
                      </div>
                      <div className="text-[10px] text-slate-555 font-semibold">markdown</div>
                    </div>
                    {/* Editor Content Area */}
                    <div className="flex bg-slate-950 p-2 text-xs leading-relaxed">
                      {/* Line Numbers Column */}
                      <div className="select-none text-right pr-3.5 text-slate-700 border-r border-slate-900 font-mono text-[11px] leading-6 min-w-[2.2rem]">
                        {lineNumbers.map(n => (
                          <div key={n}>{n}</div>
                        ))}
                      </div>
                      {/* Textarea Column */}
                      <textarea
                        name="message"
                        required
                        rows={Math.max(lineCount, 12)}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full pl-3.5 bg-transparent text-slate-300 focus:outline-none resize-none font-mono text-[11px] leading-6 border-0 p-0 outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full text-white py-3 rounded-xl font-bold transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer ${
                    formData.applicationType === 'Email'
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-indigo-500/10'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/10'
                  }`}
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processing pipeline routing...</span>
                    </>
                  ) : (
                    <>
                      {formData.applicationType === 'Email' ? (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Deliver Mail & Log Metadata</span>
                        </>
                      ) : (
                        <>
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Generate Link & Open WhatsApp</span>
                        </>
                      )}
                    </>
                  )}
                </button>

              </form>
            </div>

            {/* Info Card Column */}
            <div className="space-y-6 lg:col-span-5">
              
              <div className={`border p-6 md:p-8 rounded-2xl shadow-md ${
                localDarkMode ? 'bg-slate-900/30 border-slate-900' : 'bg-white border-slate-200'
              }`}>
                <h4 className={`text-sm font-bold flex items-center space-x-2 mb-4 font-mono ${titleColor}`}>
                  <Mail className="w-4 h-4 text-indigo-500" />
                  <span>ROUTING PIPELINE DETAILS</span>
                </h4>
                <ul className={`space-y-4 text-xs font-mono ${textColor}`}>
                  <li className="flex items-start space-x-3">
                    <span className="w-4 h-4 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5 text-indigo-400">1</span>
                    <p>
                      {formData.applicationType === 'Email' 
                        ? 'SMTP pipeline connects to the Gmail servers asynchronously.'
                        : 'WhatsApp pipeline saves details and hosts the resume file publicly.'}
                    </p>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-4 h-4 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5 text-indigo-400">2</span>
                    <p>Matches and processes candidate template parameters dynamically.</p>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-4 h-4 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5 text-indigo-400">3</span>
                    <p>
                      {formData.applicationType === 'Email'
                        ? 'Mails letter directly to HR with file attachment.'
                        : 'Opens WhatsApp Click-to-Chat with pre-filled cover letter text and hosted resume link.'}
                    </p>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-4 h-4 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5 text-indigo-400">4</span>
                    <p>Database logs record details under AnkitPlatform applications history.</p>
                  </li>
                </ul>
              </div>

              <div className={`p-6 rounded-2xl border font-mono ${cardBg}`}>
                <h4 className={`text-[10px] font-bold uppercase tracking-wider mb-3 ${labelColor}`}>Transmission Parameters</h4>
                <div className={`p-4 rounded-xl text-[10px] text-slate-400 space-y-1 border ${
                  localDarkMode ? 'bg-slate-950/60 border-slate-900' : 'bg-slate-50 border-slate-100'
                }`}>
                  {formData.applicationType === 'Email' ? (
                    <>
                      <p><span className="font-bold text-slate-300 dark:text-slate-400">From:</span> {jobTemplates[formData.position]?.label} Candidate &lt;{formData.applicantEmail}&gt;</p>
                      <p><span className="font-bold text-slate-350">To:</span> {formData.hrEmail || 'hr@company.com'}</p>
                      <p><span className="font-bold text-slate-350">Subject:</span> Job Application: {jobTemplates[formData.position]?.label} - {formData.applicantEmail}</p>
                    </>
                  ) : (
                    <>
                      <p><span className="font-bold text-slate-350">Send To:</span> WhatsApp Number: +{formData.hrPhone || '919876543210'}</p>
                      <p><span className="font-bold text-slate-355">Payload:</span> Cover Letter text + Public Resume URL link</p>
                    </>
                  )}
                  <p><span className="font-bold text-slate-350">Attach:</span> {resume ? resume.name : 'resume.pdf'}</p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* TAB 3: TRACKER & APPLICATION HISTORY       */}
        {/* ========================================== */}
        {activeTab === 'history' && (
          <div className={`rounded-2xl border overflow-hidden animate-fadeIn ${cardBg}`}>
            
            {/* Controls Bar */}
            <div className={`p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              localDarkMode ? 'bg-slate-900/20 border-slate-900' : 'bg-slate-50 border-slate-200'
            }`}>
              
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs font-semibold ${
                    localDarkMode ? 'border-slate-800 bg-slate-950/60 text-slate-200' : 'border-slate-200 bg-white text-slate-800'
                  }`}
                  placeholder="Search company, role, HR, or WhatsApp..."
                />
              </div>

              {/* Filter Group */}
              <div className="flex flex-wrap items-center gap-3">
                
                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold focus:outline-none cursor-pointer ${
                      localDarkMode ? 'border-slate-800 bg-slate-900/60 text-slate-300' : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <option value="all">All Stages</option>
                    <option value="Applied">Applied Only</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offered">Offered</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                {/* Source Filter */}
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold focus:outline-none cursor-pointer ${
                    localDarkMode ? 'border-slate-800 bg-slate-900/60 text-slate-300' : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <option value="all">All Sources</option>
                  {uniqueSources.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                {/* Refresh Button */}
                <button
                  onClick={fetchApplications}
                  className={`p-2 border rounded-xl transition cursor-pointer ${
                    localDarkMode ? 'border-slate-800 hover:bg-slate-850 text-slate-400' : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                  }`}
                  title="Refresh Records"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

              </div>

            </div>

            {/* Table Element */}
            <div className="overflow-x-auto">
              {filteredApplications.length === 0 ? (
                <div className="p-12 text-center">
                  <FileText className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                  <p className="text-xs font-semibold text-slate-450 font-mono">No application records matches parameters.</p>
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  
                  <thead>
                    <tr className={`text-[10px] font-bold uppercase tracking-wider border-b ${
                      localDarkMode ? 'bg-slate-950/40 border-slate-900 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}>
                      <th className="py-3 px-3 sm:py-4 sm:px-6 font-mono">Company / Job Posting</th>
                      <th className="py-3 px-3 sm:py-4 sm:px-6 font-mono">Applied Position</th>
                      <th className="py-3 px-3 sm:py-4 sm:px-6 font-mono">Type</th>
                      <th className="py-3 px-3 sm:py-4 sm:px-6 font-mono">Source</th>
                      <th className="py-3 px-3 sm:py-4 sm:px-6 font-mono">Date Applied</th>
                      <th className="py-3 px-3 sm:py-4 sm:px-6 font-mono">Status Stage</th>
                      <th className="py-3 px-3 sm:py-4 sm:px-6 text-right font-mono">Actions</th>
                    </tr>
                  </thead>

                  <tbody className={`divide-y font-mono ${localDarkMode ? 'divide-slate-900' : 'divide-slate-200'}`}>
                    {filteredApplications.map((app) => (
                      <tr key={app._id} className={`group transition-colors ${localDarkMode ? 'hover:bg-slate-900/20' : 'hover:bg-slate-50/50'}`}>
                        
                        {/* Company Name & Link */}
                        <td className="py-3 px-3 sm:py-4 sm:px-6">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <span className={`p-1.5 sm:p-2 rounded-lg border ${
                              localDarkMode ? 'bg-slate-950 border-slate-900 text-indigo-400' : 'bg-slate-50 border-slate-200 text-indigo-500'
                            }`}>
                              <Building className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </span>
                            <div>
                              <span className={`font-bold block text-[11px] sm:text-xs ${localDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                {app.companyName || 'Generic Application'}
                              </span>
                              <span className="text-[9px] sm:text-[10px] text-slate-500 block truncate max-w-[100px] sm:max-w-none">
                                {app.applicationType === 'WhatsApp' ? `+${app.hrPhone}` : app.hrEmail}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Position */}
                        <td className={`py-3 px-3 sm:py-4 sm:px-6 font-semibold text-[11px] sm:text-xs ${localDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          {app.position}
                        </td>

                        {/* Application Type */}
                        <td className="py-3 px-3 sm:py-4 sm:px-6">
                          {app.applicationType === 'WhatsApp' ? (
                            <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-emerald-950/20 text-emerald-500 border border-emerald-500/25 text-[8.5px] sm:text-[9px] font-bold">
                              <MessageSquare className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              <span className="hidden xs:inline">WhatsApp</span>
                              <span className="xs:hidden">WA</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-blue-950/20 text-blue-500 border border-blue-500/25 text-[8.5px] sm:text-[9px] font-bold">
                              <Mail className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              <span className="hidden xs:inline">Email</span>
                              <span className="xs:hidden">Mail</span>
                            </span>
                          )}
                        </td>

                        {/* Source */}
                        <td className="py-3 px-3 sm:py-4 sm:px-6">
                          <span className={`text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded border ${
                            localDarkMode ? 'bg-slate-950 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}>
                            {app.source || 'Direct'}
                          </span>
                        </td>

                        {/* Date */}
                        <td className={`py-3 px-3 sm:py-4 sm:px-6 text-[9px] sm:text-[10px] ${textColor}`}>
                          {new Date(app.appliedDate).toLocaleDateString(undefined, { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </td>

                        {/* Status Selector Dropdown */}
                        <td className="py-3 px-3 sm:py-4 sm:px-6">
                          {updatingId === app._id ? (
                            <div className="flex items-center space-x-1 text-[10px] sm:text-xs text-slate-500">
                              <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                              <span>...</span>
                            </div>
                          ) : (
                            <div className="relative">
                              <select
                                value={app.status}
                                onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                                className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] rounded-full font-bold border cursor-pointer focus:outline-none bg-slate-950 ${getStatusBadgeClass(app.status)}`}
                              >
                                <option value="Applied">Applied</option>
                                <option value="Interviewing">Interviewing</option>
                                <option value="Offered">Offered</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Archived">Archived</option>
                              </select>
                            </div>
                          )}
                        </td>

                        {/* Row Actions */}
                        <td className="py-3 px-3 sm:py-4 sm:px-6 text-right">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-end space-x-1.5 sm:space-x-2">
                            
                            {app.resumeUrl && (
                              <a
                                href={app.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-1 sm:p-1.5 rounded-lg transition border ${
                                  localDarkMode ? 'text-slate-500 hover:text-indigo-400 border-slate-900 hover:bg-slate-850' : 'text-slate-500 hover:text-indigo-655 border-slate-200 hover:bg-slate-100'
                                }`}
                                title="View Hosted Resume File"
                              >
                                <FileText className="w-3.5 h-3.5" />
                              </a>
                            )}

                            {app.jobUrl && (
                              <a
                                href={app.jobUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-1 sm:p-1.5 rounded-lg transition border ${
                                  localDarkMode ? 'text-slate-500 hover:text-indigo-400 border-slate-900 hover:bg-slate-850' : 'text-slate-500 hover:text-indigo-600 border-slate-200 hover:bg-slate-100'
                                }`}
                                title="Visit Job URL"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}

                            {app.applicationType === 'WhatsApp' && app.hrPhone && (
                              <a
                                href={`https://api.whatsapp.com/send?phone=${app.hrPhone.replace(/\D/g, '')}&text=${encodeURIComponent(`Hello, I am following up on my application for the ${app.position} position at ${app.companyName || 'your company'}.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-1 sm:p-1.5 rounded-lg transition border ${
                                  localDarkMode ? 'text-emerald-405 hover:text-emerald-400 border-slate-900 hover:bg-slate-850' : 'text-emerald-600 hover:text-emerald-500 border-slate-200 hover:bg-slate-100'
                                }`}
                                title="Chat / Follow up with HR on WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>
                            )}

                            <button
                              onClick={() => handleDeleteApplication(app._id)}
                              disabled={deletingId === app._id}
                              className={`p-1 sm:p-1.5 rounded-lg transition disabled:opacity-30 border cursor-pointer ${
                                localDarkMode ? 'text-slate-500 hover:text-rose-400 border-slate-900 hover:bg-slate-855' : 'text-slate-500 hover:text-rose-600 border-slate-200 hover:bg-slate-150'
                              }`}
                              title="Delete Application Log"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
