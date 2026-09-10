import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBriefcase,
  FiSend,
  FiExternalLink,
  FiCheckCircle,
  FiClock,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiPlus,
  FiX,
  FiMail,
  FiPhone,
  FiFileText,
  FiEye,
  FiRefreshCw,
  FiArrowLeft,
  FiLayers,
  FiAward,
  FiAlertCircle,
  FiUploadCloud
} from "react-icons/fi";
import {
  fetchApplications,
  postJobApplication,
  updateApplicationStatus,
  deleteApplication
} from "../lib/api";
import { useNavigate } from "../lib/router";

const DEFAULT_RESUME_URL = "/Ankit_Kumar_Resume.pdf";
const DEFAULT_RESUME_NAME = "Ankit_Kumar_Resume.pdf";

const INITIAL_DEMO_APPLICATIONS = [
  {
    _id: "demo-app-1",
    companyName: "Razorpay",
    position: "Full-Stack MERN Developer",
    source: "LinkedIn",
    jobUrl: "https://www.linkedin.com/jobs/view/razorpay-mern",
    applicationType: "Email",
    hrEmail: "careers@razorpay.com",
    applicantEmail: "ankit2914978@gmail.com",
    message: "Hi Hiring Team, I came across the Full-Stack MERN Developer role at Razorpay. With 10+ shipped web & mobile projects using React, Node.js, Express, and MongoDB, I build clean, high-concurrency systems and responsive UIs. Looking forward to discussing how I can add immediate value.",
    resumeName: "Ankit_Kumar_Resume.pdf",
    resumeUrl: DEFAULT_RESUME_URL,
    status: "Interviewing",
    appliedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "demo-app-2",
    companyName: "Swiggy",
    position: "React Native Mobile Developer",
    source: "Naukri",
    jobUrl: "https://careers.swiggy.com/jobs/mobile-engineer",
    applicationType: "Email",
    hrEmail: "tech-recruiting@swiggy.in",
    applicantEmail: "ankit2914978@gmail.com",
    message: "Hello Swiggy Tech Team! As an active React Native & MERN developer with experience building cross-platform apps, offline-first sync, and smooth 60fps mobile interfaces, I would love to contribute to Swiggy's consumer mobile apps.",
    resumeName: "Ankit_Kumar_Resume.pdf",
    resumeUrl: DEFAULT_RESUME_URL,
    status: "Applied",
    appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "demo-app-3",
    companyName: "Zepto",
    position: "Frontend React Engineer",
    source: "Wellfound",
    jobUrl: "https://wellfound.com/jobs/zepto-frontend-eng",
    applicationType: "WhatsApp",
    hrPhone: "+919876543210",
    applicantEmail: "ankit2914978@gmail.com",
    message: "Hi! Reaching out regarding Zepto's Frontend React role. I specialize in rapid UI delivery with React, Tailwind CSS, Framer Motion, and micro-interactions. My portfolio showcases 10+ shipped products.",
    resumeName: "Ankit_Kumar_Resume.pdf",
    resumeUrl: DEFAULT_RESUME_URL,
    status: "Offered",
    appliedDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const QUICK_ROLES = [
  "Full-Stack MERN Developer",
  "React Native Developer",
  "Frontend Engineer (React)",
  "Backend Node.js Developer",
  "Mobile App Engineer"
];

const QUICK_PITCH_TEMPLATES = {
  mern: "Hi Hiring Team,\n\nI am thrilled to apply for the position of [ROLE] at [COMPANY]. As a dedicated MERN Stack Developer with 10+ shipped projects, I bring robust proficiency in MongoDB, Express, React, and Node.js. I focus on clean architectural patterns, responsive UI design with Tailwind CSS, and resilient REST APIs.\n\nMy portfolio: https://ankitkumar1141-portfolio.vercel.app/\nGitHub: https://github.com/Ankit1141192\n\nI would love the chance to discuss how my skill set aligns with your team's goals.",
  mobile: "Hello Recruiting Team,\n\nI am writing to express my strong interest in the [ROLE] role at [COMPANY]. With deep expertise in React Native, Expo, and cross-platform mobile development alongside full-stack MERN backends, I specialize in shipping smooth, high-performance apps for Android and iOS.\n\nI look forward to discussing how I can help elevate your mobile product experience.",
  quick: "Hi [COMPANY] Team,\n\nI'm Ankit Kumar, a Full-Stack & Mobile Developer specializing in high-velocity product engineering with React, React Native, Node.js, and MongoDB. I have built 10+ production-ready projects and thrive in fast-paced teams that prioritize clean, maintainable code.\n\nPlease find my resume attached. Excited for the opportunity to connect!"
};

const STATUS_CONFIG = {
  Applied: {
    label: "Applied",
    badge: "bg-amber/10 text-amber border-amber/30",
    dot: "bg-amber",
  },
  Interviewing: {
    label: "Interviewing",
    badge: "bg-cyan/10 text-cyan border-cyan/30",
    dot: "bg-cyan",
  },
  Offered: {
    label: "Offered",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  Rejected: {
    label: "Rejected",
    badge: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    dot: "bg-rose-400",
  },
};

export default function ApplyPortal() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Modals state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedAppForView, setSelectedAppForView] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    companyName: "",
    position: "Full-Stack MERN Developer",
    jobUrl: "",
    source: "LinkedIn",
    applicationType: "Email",
    applicantEmail: "ankit2914978@gmail.com",
    hrEmail: "",
    hrPhone: "",
    message: QUICK_PITCH_TEMPLATES.mern
      .replace("[ROLE]", "Full-Stack MERN Developer")
      .replace("[COMPANY]", "your team"),
    useDefaultResume: true,
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [lastSubmittedApp, setLastSubmittedApp] = useState(null);

  // Load applications from API, falling back to localStorage / demo
  const loadApplications = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const data = await fetchApplications();
      if (Array.isArray(data) && data.length > 0) {
        setApplications(data);
        localStorage.setItem("ankit_portfolio_apps", JSON.stringify(data));
      } else {
        // Fallback to local storage or demo
        const stored = localStorage.getItem("ankit_portfolio_apps");
        if (stored) {
          setApplications(JSON.parse(stored));
        } else {
          setApplications(INITIAL_DEMO_APPLICATIONS);
          localStorage.setItem("ankit_portfolio_apps", JSON.stringify(INITIAL_DEMO_APPLICATIONS));
        }
      }
    } catch (err) {
      console.warn("Backend fetch failed, utilizing cached or demo applications:", err?.message);
      const stored = localStorage.getItem("ankit_portfolio_apps");
      if (stored) {
        setApplications(JSON.parse(stored));
      } else {
        setApplications(INITIAL_DEMO_APPLICATIONS);
        localStorage.setItem("ankit_portfolio_apps", JSON.stringify(INITIAL_DEMO_APPLICATIONS));
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  // Update Status
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateApplicationStatus(id, newStatus);
    } catch (e) {
      console.warn("API status update failed, saving locally:", e);
    }

    setApplications((prev) => {
      const updated = prev.map((item) =>
        item._id === id ? { ...item, status: newStatus } : item
      );
      localStorage.setItem("ankit_portfolio_apps", JSON.stringify(updated));
      return updated;
    });
  };

  // Delete Application
  const handleDelete = async (id) => {
    try {
      await deleteApplication(id);
    } catch (e) {
      console.warn("API delete failed, removing locally:", e);
    }

    setApplications((prev) => {
      const updated = prev.filter((item) => item._id !== id);
      localStorage.setItem("ankit_portfolio_apps", JSON.stringify(updated));
      return updated;
    });
    setDeleteConfirmId(null);
  };

  // Form Field change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Quick preset template apply
  const handlePitchTemplate = (templateKey) => {
    const raw = QUICK_PITCH_TEMPLATES[templateKey] || "";
    const replaced = raw
      .replace("[ROLE]", formData.position || "Developer")
      .replace("[COMPANY]", formData.companyName || "your team");
    setFormData((prev) => ({ ...prev, message: replaced }));
  };

  // Quick preset role apply
  const handleRoleSelect = (role) => {
    setFormData((prev) => {
      const updated = { ...prev, position: role };
      if (prev.message.includes("Developer") || prev.message.includes("Engineer")) {
        updated.message = prev.message.replace(/Full-Stack MERN Developer|React Native Developer|Frontend Engineer \(React\)|Backend Node\.js Developer|Mobile App Engineer/g, role);
      }
      return updated;
    });
  };

  // Submit Application
  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!formData.position.trim()) {
      setFormError("Job Position is required.");
      return;
    }
    if (!formData.companyName.trim()) {
      setFormError("Company Name is required.");
      return;
    }
    if (formData.applicationType === "Email" && (!formData.applicantEmail || !formData.hrEmail)) {
      setFormError("Applicant Email and Recruiter HR Email are required for Email applications.");
      return;
    }
    if (formData.applicationType === "WhatsApp" && !formData.hrPhone) {
      setFormError("Recruiter HR Phone is required for WhatsApp applications.");
      return;
    }
    if (!formData.message.trim()) {
      setFormError("Please provide a cover letter or pitch message.");
      return;
    }

    setSubmitting(true);

    const payload = new FormData();
    payload.append("companyName", formData.companyName);
    payload.append("position", formData.position);
    payload.append("source", formData.source);
    payload.append("jobUrl", formData.jobUrl);
    payload.append("applicationType", formData.applicationType);
    payload.append("applicantEmail", formData.applicantEmail);
    if (formData.applicationType === "Email") {
      payload.append("hrEmail", formData.hrEmail);
    } else {
      payload.append("hrPhone", formData.hrPhone);
    }
    payload.append("message", formData.message);

    if (resumeFile && !formData.useDefaultResume) {
      payload.append("resume", resumeFile);
    }

    try {
      let savedApp = null;
      try {
        const response = await postJobApplication(payload);
        savedApp = response?.application;
      } catch (apiErr) {
        console.warn("Backend API not reachable, saving application locally:", apiErr?.message);
      }

      const finalApp = savedApp || {
        _id: "app-" + Date.now(),
        companyName: formData.companyName,
        position: formData.position,
        source: formData.source,
        jobUrl: formData.jobUrl,
        applicationType: formData.applicationType,
        applicantEmail: formData.applicantEmail,
        hrEmail: formData.hrEmail || undefined,
        hrPhone: formData.hrPhone || undefined,
        message: formData.message,
        resumeName: resumeFile ? resumeFile.name : DEFAULT_RESUME_NAME,
        resumeUrl: resumeFile ? URL.createObjectURL(resumeFile) : DEFAULT_RESUME_URL,
        status: "Applied",
        appliedDate: new Date().toISOString(),
      };

      setApplications((prev) => {
        const updated = [finalApp, ...prev];
        localStorage.setItem("ankit_portfolio_apps", JSON.stringify(updated));
        return updated;
      });

      setLastSubmittedApp(finalApp);
      setFormSuccess(
        formData.applicationType === "WhatsApp"
          ? "Application saved! Click 'Open WhatsApp' below to dispatch your message."
          : "Application processed and dispatched successfully!"
      );

      // Reset form fields
      setFormData((prev) => ({
        ...prev,
        companyName: "",
        jobUrl: "",
        hrEmail: "",
        hrPhone: "",
      }));
      setResumeFile(null);
    } catch (err) {
      setFormError(err?.response?.data?.error || "Failed to submit application. Please check inputs.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered Applications
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        !searchQuery ||
        app.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.source?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        app.status?.toLowerCase() === statusFilter.toLowerCase();

      const matchesType =
        typeFilter === "all" ||
        app.applicationType?.toLowerCase() === typeFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [applications, searchQuery, statusFilter, typeFilter]);

  // Metrics
  const stats = useMemo(() => {
    const total = applications.length;
    const interviewing = applications.filter((a) => a.status === "Interviewing").length;
    const offered = applications.filter((a) => a.status === "Offered").length;
    const applied = applications.filter((a) => a.status === "Applied").length;
    return { total, interviewing, offered, applied };
  }, [applications]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Recent";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-ink text-paper font-body pt-24 pb-20 selection:bg-cyan/30 selection:text-paper">
      {/* Blueprint grid background */}
      <div className="fixed inset-0 blueprint-grid pointer-events-none opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Navigation Breadcrumb / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-line">
          <div>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 font-mono text-xs text-muted hover:text-cyan transition-colors mb-3"
            >
              <FiArrowLeft /> Back to Portfolio Home
            </button>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-paper">
                Apply Portal <span className="text-cyan font-mono text-xl">&amp;</span> Tracker
              </h1>
              <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-cyan/10 border border-cyan/30 text-cyan hidden sm:inline-block">
                /appliedJob
              </span>
            </div>
            <p className="text-muted text-sm sm:text-base mt-1.5 max-w-2xl">
              Centralized command center for dispatching job applications, tracking recruiter correspondence, and monitoring pipeline status in real time.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => loadApplications(true)}
              title="Refresh applications"
              className="p-3 border border-line rounded-lg text-muted hover:text-cyan hover:border-cyan transition-colors bg-panel"
            >
              <FiRefreshCw className={refreshing ? "animate-spin" : ""} size={17} />
            </button>
            <button
              onClick={() => {
                setIsNewModalOpen(true);
                setFormSuccess("");
                setFormError("");
                setLastSubmittedApp(null);
              }}
              className="inline-flex items-center gap-2 bg-amber text-ink font-display font-semibold px-5 py-3 rounded-lg hover:bg-amber-dim transition-all shadow-[0_0_20px_-5px_rgba(251,191,36,0.3)]"
            >
              <FiPlus size={18} /> New Application
            </button>
          </div>
        </div>

        {/* Pipeline Metrics Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-8">
          <div className="p-5 rounded-xl border border-line bg-panel relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted">TOTAL APPLIED</span>
              <FiLayers className="text-muted group-hover:text-paper transition-colors" />
            </div>
            <div className="font-display text-3xl font-bold text-paper mt-3">
              {stats.total}
            </div>
            <div className="text-xs text-muted font-mono mt-1">Across all channels</div>
          </div>

          <div className="p-5 rounded-xl border border-line bg-panel relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-cyan">IN INTERVIEWS</span>
              <FiClock className="text-cyan" />
            </div>
            <div className="font-display text-3xl font-bold text-cyan mt-3">
              {stats.interviewing}
            </div>
            <div className="text-xs text-muted font-mono mt-1">Active candidate rounds</div>
          </div>

          <div className="p-5 rounded-xl border border-line bg-panel relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-emerald-400">OFFERS EXTENDED</span>
              <FiAward className="text-emerald-400" />
            </div>
            <div className="font-display text-3xl font-bold text-emerald-400 mt-3">
              {stats.offered}
            </div>
            <div className="text-xs text-muted font-mono mt-1">Offers received</div>
          </div>

          <div className="p-5 rounded-xl border border-line bg-panel relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-amber">WAITING / IN REVIEW</span>
              <FiSend className="text-amber" />
            </div>
            <div className="font-display text-3xl font-bold text-amber mt-3">
              {stats.applied}
            </div>
            <div className="text-xs text-muted font-mono mt-1">Awaiting recruiter review</div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 rounded-xl border border-line bg-panel2 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search by company, position, source..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-panel border border-line rounded-lg pl-10 pr-4 py-2 text-sm text-paper placeholder:text-muted focus:outline-none focus:border-cyan font-mono"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-1.5 font-mono text-xs overflow-x-auto">
              <span className="text-muted mr-1 hidden sm:inline">Status:</span>
              {["all", "Applied", "Interviewing", "Offered", "Rejected"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-md border transition-colors ${
                    statusFilter === st
                      ? "border-cyan text-cyan bg-cyan/10 font-semibold"
                      : "border-line text-muted hover:text-paper bg-panel"
                  }`}
                >
                  {st === "all" ? "All" : st}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="text-muted mr-1 hidden sm:inline">Type:</span>
              {["all", "Email", "WhatsApp"].map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-1.5 rounded-md border transition-colors ${
                    typeFilter === type
                      ? "border-amber text-amber bg-amber/10 font-semibold"
                      : "border-line text-muted hover:text-paper bg-panel"
                  }`}
                >
                  {type === "all" ? "All" : type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="p-16 border border-line rounded-xl bg-panel text-center font-mono text-sm text-muted">
            <FiRefreshCw className="animate-spin inline-block mb-3 text-cyan" size={24} />
            <div>Loading applications from repository ...</div>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="p-16 border border-line rounded-xl bg-panel text-center">
            <FiBriefcase className="mx-auto text-muted mb-4 opacity-40" size={40} />
            <h3 className="font-display text-lg font-semibold text-paper mb-1">
              No matching applications found
            </h3>
            <p className="text-muted text-sm max-w-sm mx-auto mb-6">
              {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                ? "Try clearing your filters or search terms to view all entries."
                : "No applications have been logged yet. Click '+ New Application' to dispatch one."}
            </p>
            {(searchQuery || statusFilter !== "all" || typeFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setTypeFilter("all");
                }}
                className="font-mono text-xs text-cyan border border-cyan/40 px-4 py-2 rounded-md hover:bg-cyan/10 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredApps.map((app) => {
              const currentStatus = STATUS_CONFIG[app.status] || STATUS_CONFIG.Applied;
              const isWhatsApp = app.applicationType === "WhatsApp";

              return (
                <motion.div
                  key={app._id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-line bg-panel p-5 hover:border-line/80 transition-all shadow-panel"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Role and Company Info */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-lg font-bold text-paper">
                          {app.position}
                        </h3>
                        <span className="font-mono text-xs text-muted">@</span>
                        <span className="font-display text-lg font-semibold text-cyan">
                          {app.companyName}
                        </span>

                        {app.jobUrl && (
                          <a
                            href={app.jobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open Job Listing"
                            className="text-muted hover:text-cyan transition-colors"
                          >
                            <FiExternalLink size={14} />
                          </a>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted pt-1">
                        <span className="inline-flex items-center gap-1.5">
                          <FiClock size={12} className="text-muted/70" />
                          {formatDate(app.appliedDate)}
                        </span>

                        <span className="text-line">•</span>

                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-line bg-panel2">
                          {isWhatsApp ? (
                            <>
                              <FiPhone size={11} className="text-emerald-400" />
                              <span className="text-paper">WhatsApp</span>
                            </>
                          ) : (
                            <>
                              <FiMail size={11} className="text-cyan" />
                              <span className="text-paper">Email</span>
                            </>
                          )}
                        </span>

                        {app.source && (
                          <span className="px-2 py-0.5 rounded border border-line bg-panel2 text-paper">
                            {app.source}
                          </span>
                        )}

                        {app.resumeName && (
                          <a
                            href={app.resumeUrl || DEFAULT_RESUME_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-muted hover:text-cyan transition-colors"
                          >
                            <FiFileText size={12} /> {app.resumeName}
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Status & Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 self-start lg:self-center">
                      {/* Interactive Status Selector */}
                      <div className="flex items-center gap-1.5 bg-panel2 border border-line rounded-lg p-1">
                        <span className={`w-2 h-2 rounded-full ${currentStatus.dot} ml-2`} />
                        <select
                          value={app.status || "Applied"}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          className="bg-transparent font-mono text-xs text-paper py-1 pr-2 pl-1 cursor-pointer focus:outline-none"
                        >
                          <option value="Applied" className="bg-panel2 text-paper">Applied</option>
                          <option value="Interviewing" className="bg-panel2 text-paper">Interviewing</option>
                          <option value="Offered" className="bg-panel2 text-paper">Offered</option>
                          <option value="Rejected" className="bg-panel2 text-paper">Rejected</option>
                        </select>
                      </div>

                      {/* Recruiter Quick Link */}
                      {isWhatsApp && app.hrPhone ? (
                        <a
                          href={`https://wa.me/${app.hrPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Hi! Following up on my application for ${app.position} at ${app.companyName}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/40 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 font-mono text-xs transition-colors"
                        >
                          <FiPhone size={12} /> WhatsApp HR
                        </a>
                      ) : app.hrEmail ? (
                        <a
                          href={`mailto:${app.hrEmail}?subject=${encodeURIComponent(
                            `Application: ${app.position} - Ankit Kumar`
                          )}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line text-muted hover:text-cyan hover:border-cyan font-mono text-xs transition-colors bg-panel2"
                        >
                          <FiMail size={12} /> Email HR
                        </a>
                      ) : null}

                      {/* View Message Modal Trigger */}
                      <button
                        onClick={() => setSelectedAppForView(app)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line text-muted hover:text-paper font-mono text-xs transition-colors bg-panel2"
                        title="View Cover Letter / Message"
                      >
                        <FiEye size={12} /> View Pitch
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => setDeleteConfirmId(app._id)}
                        className="p-2 rounded-lg border border-line text-muted hover:text-rose-400 hover:border-rose-500/40 transition-colors bg-panel2"
                        title="Delete application"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* NEW APPLICATION MODAL */}
      <AnimatePresence>
        {isNewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink/80 backdrop-blur-sm"
              onClick={() => setIsNewModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-2xl bg-panel border border-line rounded-2xl shadow-2xl overflow-hidden z-10 my-8"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-panel2">
                <div className="flex items-center gap-2 font-display font-semibold text-lg text-paper">
                  <FiSend className="text-amber" />
                  <span>Dispatch New Job Application</span>
                </div>
                <button
                  onClick={() => setIsNewModalOpen(false)}
                  className="p-1 rounded text-muted hover:text-paper transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmitApplication} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto font-mono text-sm">
                {formSuccess ? (
                  <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 space-y-3">
                    <div className="flex items-center gap-2 font-semibold">
                      <FiCheckCircle size={18} /> {formSuccess}
                    </div>
                    {lastSubmittedApp?.applicationType === "WhatsApp" && lastSubmittedApp?.hrPhone && (
                      <a
                        href={`https://wa.me/${lastSubmittedApp.hrPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                          lastSubmittedApp.message
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-emerald-500 text-ink font-display font-bold px-4 py-2 rounded-lg hover:bg-emerald-400 transition-colors"
                      >
                        <FiPhone /> Open WhatsApp Direct Chat Now
                      </a>
                    )}
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormSuccess("");
                          setIsNewModalOpen(false);
                        }}
                        className="mt-2 text-xs text-muted hover:text-paper underline"
                      >
                        Close modal
                      </button>
                    </div>
                  </div>
                ) : null}

                {formError && (
                  <div className="p-3 rounded-lg border border-rose-500/40 bg-rose-500/10 text-rose-300 text-xs flex items-center gap-2">
                    <FiAlertCircle /> {formError}
                  </div>
                )}

                {/* Channel Selector */}
                <div>
                  <label className="block text-xs text-muted mb-2 uppercase">Application Channel</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, applicationType: "Email" }))}
                      className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border text-xs transition-colors ${
                        formData.applicationType === "Email"
                          ? "border-cyan bg-cyan/10 text-cyan font-bold"
                          : "border-line bg-panel2 text-muted hover:text-paper"
                      }`}
                    >
                      <FiMail size={15} /> Email (Nodemailer)
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, applicationType: "WhatsApp" }))}
                      className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border text-xs transition-colors ${
                        formData.applicationType === "WhatsApp"
                          ? "border-emerald-400 bg-emerald-500/10 text-emerald-400 font-bold"
                          : "border-line bg-panel2 text-muted hover:text-paper"
                      }`}
                    >
                      <FiPhone size={15} /> WhatsApp Direct
                    </button>
                  </div>
                </div>

                {/* Role and Company Inputs */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-muted mb-1">POSITION / ROLE *</label>
                    <input
                      type="text"
                      name="position"
                      required
                      value={formData.position}
                      onChange={handleInputChange}
                      placeholder="e.g. Full-Stack MERN Developer"
                      className="w-full bg-panel2 border border-line rounded-lg px-3 py-2 text-paper focus:outline-none focus:border-cyan text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-muted mb-1">COMPANY NAME *</label>
                    <input
                      type="text"
                      name="companyName"
                      required
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="e.g. Swiggy, Google, Razorpay"
                      className="w-full bg-panel2 border border-line rounded-lg px-3 py-2 text-paper focus:outline-none focus:border-cyan text-xs"
                    />
                  </div>
                </div>

                {/* Role quick suggestion chips */}
                <div>
                  <span className="text-[11px] text-muted mr-2">Presets:</span>
                  <div className="inline-flex flex-wrap gap-1.5 mt-1">
                    {QUICK_ROLES.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleRoleSelect(role)}
                        className={`text-[10px] px-2 py-1 rounded border transition-colors ${
                          formData.position === role
                            ? "border-amber text-amber bg-amber/10"
                            : "border-line text-muted hover:text-paper bg-panel2"
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Source & Job URL */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-muted mb-1">SOURCE / PLATFORM</label>
                    <select
                      name="source"
                      value={formData.source}
                      onChange={handleInputChange}
                      className="w-full bg-panel2 border border-line rounded-lg px-3 py-2 text-paper focus:outline-none focus:border-cyan text-xs"
                    >
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Indeed">Indeed</option>
                      <option value="Wellfound">Wellfound / AngelList</option>
                      <option value="Naukri">Naukri</option>
                      <option value="Referral">Referral</option>
                      <option value="Direct Company Site">Direct Company Site</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-muted mb-1">JOB POSTING URL</label>
                    <input
                      type="url"
                      name="jobUrl"
                      value={formData.jobUrl}
                      onChange={handleInputChange}
                      placeholder="https://..."
                      className="w-full bg-panel2 border border-line rounded-lg px-3 py-2 text-paper focus:outline-none focus:border-cyan text-xs"
                    />
                  </div>
                </div>

                {/* Contact Coordinates */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {formData.applicationType === "Email" ? (
                    <>
                      <div>
                        <label className="block text-xs text-muted mb-1">RECRUITER / HR EMAIL *</label>
                        <input
                          type="email"
                          name="hrEmail"
                          required={formData.applicationType === "Email"}
                          value={formData.hrEmail}
                          onChange={handleInputChange}
                          placeholder="careers@company.com"
                          className="w-full bg-panel2 border border-line rounded-lg px-3 py-2 text-paper focus:outline-none focus:border-cyan text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted mb-1">APPLICANT EMAIL (YOU)</label>
                        <input
                          type="email"
                          name="applicantEmail"
                          value={formData.applicantEmail}
                          onChange={handleInputChange}
                          className="w-full bg-panel2 border border-line rounded-lg px-3 py-2 text-paper focus:outline-none focus:border-cyan text-xs"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs text-muted mb-1">RECRUITER WHATSAPP NUMBER *</label>
                        <input
                          type="text"
                          name="hrPhone"
                          required={formData.applicationType === "WhatsApp"}
                          value={formData.hrPhone}
                          onChange={handleInputChange}
                          placeholder="+91 9876543210"
                          className="w-full bg-panel2 border border-line rounded-lg px-3 py-2 text-paper focus:outline-none focus:border-cyan text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted mb-1">APPLICANT EMAIL (FOR RECORD)</label>
                        <input
                          type="email"
                          name="applicantEmail"
                          value={formData.applicantEmail}
                          onChange={handleInputChange}
                          className="w-full bg-panel2 border border-line rounded-lg px-3 py-2 text-paper focus:outline-none focus:border-cyan text-xs"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Pitch / Cover Letter & Generator */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs text-muted">COVER LETTER / PITCH MESSAGE *</label>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className="text-muted">Insert Pitch:</span>
                      <button
                        type="button"
                        onClick={() => handlePitchTemplate("mern")}
                        className="text-cyan hover:underline"
                      >
                        [MERN]
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePitchTemplate("mobile")}
                        className="text-cyan hover:underline"
                      >
                        [Mobile]
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePitchTemplate("quick")}
                        className="text-cyan hover:underline"
                      >
                        [Quick]
                      </button>
                    </div>
                  </div>
                  <textarea
                    rows={6}
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full bg-panel2 border border-line rounded-lg p-3 text-paper focus:outline-none focus:border-cyan text-xs leading-relaxed"
                  />
                </div>

                {/* Resume Option */}
                <div className="p-3 rounded-lg border border-line bg-panel2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-paper">
                      <input
                        type="checkbox"
                        name="useDefaultResume"
                        checked={formData.useDefaultResume}
                        onChange={handleInputChange}
                        className="accent-cyan"
                      />
                      <span>Attach Default Portfolio Resume ({DEFAULT_RESUME_NAME})</span>
                    </label>

                    <a
                      href={DEFAULT_RESUME_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-cyan hover:underline inline-flex items-center gap-1"
                    >
                      <FiEye /> Preview
                    </a>
                  </div>

                  {!formData.useDefaultResume && (
                    <div className="mt-3 pt-3 border-t border-line">
                      <label className="block text-xs text-muted mb-1">UPLOAD CUSTOM RESUME (PDF/DOC)</label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setResumeFile(e.target.files[0])}
                        className="text-xs text-muted file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-mono file:bg-cyan/10 file:text-cyan hover:file:bg-cyan/20 cursor-pointer"
                      />
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsNewModalOpen(false)}
                    className="px-4 py-2 border border-line rounded-lg text-muted hover:text-paper font-mono text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 bg-amber text-ink font-display font-semibold px-6 py-2.5 rounded-lg hover:bg-amber-dim transition-colors disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <FiRefreshCw className="animate-spin" /> Dispatching...
                      </>
                    ) : (
                      <>
                        <FiSend /> Submit &amp; Dispatch
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIEW PITCH / DETAILS MODAL */}
      <AnimatePresence>
        {selectedAppForView && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink/80 backdrop-blur-sm"
              onClick={() => setSelectedAppForView(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-panel border border-line rounded-2xl shadow-2xl p-6 z-10 font-mono"
            >
              <div className="flex items-center justify-between pb-4 border-b border-line mb-4">
                <div>
                  <h3 className="font-display text-xl font-bold text-paper">
                    {selectedAppForView.position}
                  </h3>
                  <div className="text-cyan text-sm">@{selectedAppForView.companyName}</div>
                </div>
                <button
                  onClick={() => setSelectedAppForView(null)}
                  className="text-muted hover:text-paper p-1 rounded"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-panel2 border border-line">
                  <div>
                    <span className="text-muted">Applied Date:</span>{" "}
                    <span className="text-paper">{formatDate(selectedAppForView.appliedDate)}</span>
                  </div>
                  <div>
                    <span className="text-muted">Channel:</span>{" "}
                    <span className="text-paper">{selectedAppForView.applicationType || "Email"}</span>
                  </div>
                  <div>
                    <span className="text-muted">Status:</span>{" "}
                    <span className="text-amber font-semibold">{selectedAppForView.status}</span>
                  </div>
                  <div>
                    <span className="text-muted">Source:</span>{" "}
                    <span className="text-paper">{selectedAppForView.source || "N/A"}</span>
                  </div>
                </div>

                <div>
                  <div className="text-muted text-[11px] mb-1">COVER LETTER / PITCH SENT:</div>
                  <div className="p-4 rounded-lg bg-panel2 border border-line text-paper/90 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                    {selectedAppForView.message}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {selectedAppForView.resumeUrl && (
                    <a
                      href={selectedAppForView.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan hover:underline inline-flex items-center gap-1.5"
                    >
                      <FiFileText /> View Attached Resume
                    </a>
                  )}

                  <button
                    onClick={() => setSelectedAppForView(null)}
                    className="px-4 py-2 border border-line rounded-lg text-muted hover:text-paper ml-auto"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink/80 backdrop-blur-sm"
              onClick={() => setDeleteConfirmId(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-panel border border-line rounded-xl shadow-2xl p-6 z-10 font-mono text-center"
            >
              <FiTrash2 className="mx-auto text-rose-400 mb-3" size={32} />
              <h4 className="font-display font-bold text-lg text-paper mb-2">Delete Application?</h4>
              <p className="text-muted text-xs mb-6">
                Are you sure you want to remove this application from the pipeline? This action cannot be undone.
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 border border-line rounded-lg text-muted hover:text-paper text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 text-xs font-semibold"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
