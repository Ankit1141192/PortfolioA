import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSend,
  FiX,
  FiTrash2,
  FiExternalLink,
  FiDownload,
} from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";
import { chatbotKnowledge } from "../config/chatbotKnowledge";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      sender: "bot",
      text: `Hi there! 👋 I'm Ankit's AI Assistant (Frontend-Powered). How can I help you explore his portfolio today?`,
      chips: ["Tell me about Ankit", "Projects", "Tech Skills", "Services", "Contact Info", "Download Resume"],
      timestamp: new Date(),
    },
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasOpened(true);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, messages, isTyping]);

  const handleOpen = () => {
    setIsOpen(true);
    setHasOpened(true);
  };

  const handleClear = () => {
    setMessages([
      {
        id: "welcome-reset",
        sender: "bot",
        text: `Chat cleared! What else would you like to know about Ankit?`,
        chips: ["Projects", "Tech Skills", "Contact Info", "Download Resume"],
        timestamp: new Date(),
      },
    ]);
  };

  const handleSend = (textToSend) => {
    const query = typeof textToSend === "string" ? textToSend : input;
    if (!query || !query.trim()) return;

    const userMsg = {
      id: "user-" + Date.now(),
      sender: "user",
      text: query.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate natural thinking delay (350ms)
    setTimeout(() => {
      const botResponse = generateAnswer(query.trim());
      setMessages((prev) => [
        ...prev,
        {
          id: "bot-" + Date.now(),
          sender: "bot",
          ...botResponse,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 380);
  };

  const generateAnswer = (userQuery) => {
    const q = userQuery.toLowerCase().trim();

    // 1. GREETINGS
    if (/^(hi|hello|hey|yo|namaste|greetings|hola|good\s*(morning|evening|afternoon))(\b|!)/i.test(q)) {
      return {
        text: `Hello! 👋 Great to meet you. I can tell you all about Ankit's featured projects, full-stack & mobile skills, services, education, or how to contact him. What interests you?`,
        chips: ["Tell me about Ankit", "Projects", "Tech Skills", "Contact Info"],
      };
    }

    // 2. RESUME
    if (q.includes("resume") || q.includes("cv") || q.includes("download resume")) {
      return {
        text: `You can download Ankit's updated resume directly using the link below:`,
        links: [
          {
            label: "📄 Download Resume (PDF)",
            href: chatbotKnowledge.personalInfo.resumeUrl,
            download: true,
          },
        ],
        chips: ["Projects", "Tech Skills", "Contact Info"],
      };
    }

    // 3. ABOUT / BIO / WHO IS ANKIT
    if (
      q.includes("about") ||
      q.includes("who is ankit") ||
      q.includes("tell me about") ||
      q.includes("bio") ||
      q.includes("intro")
    ) {
      return {
        text: `${chatbotKnowledge.personalInfo.name} is an ${chatbotKnowledge.personalInfo.role} based in ${chatbotKnowledge.personalInfo.location}.\n\n${chatbotKnowledge.personalInfo.summary}\n\nStatus: ${chatbotKnowledge.personalInfo.status}.`,
        chips: ["Projects", "Tech Skills", "Services", "Download Resume"],
      };
    }

    // 4. SPECIFIC PROJECT MATCH
    for (const p of chatbotKnowledge.projects) {
      if (q.includes(p.title.toLowerCase())) {
        const linkItems = [];
        if (p.demo) linkItems.push({ label: "Live Demo", href: p.demo });
        if (p.github) linkItems.push({ label: "GitHub Repo", href: p.github });

        return {
          text: `🚀 **${p.title}** (${p.category})\n${p.description}\n\n**Tech Stack:** ${p.technologies.join(", ")}`,
          links: linkItems,
          chips: ["Other Projects", "Tech Skills", "Contact Info"],
        };
      }
    }

    // 5. ALL PROJECTS / WORK
    if (
      q.includes("project") ||
      q.includes("work") ||
      q.includes("built") ||
      q.includes("apps") ||
      q.includes("portfolio")
    ) {
      const topProjects = chatbotKnowledge.projects.slice(0, 4);
      const projList = topProjects
        .map((p) => `• **${p.title}** (${p.category}) — ${p.technologies.slice(0, 3).join(", ")}`)
        .join("\n");

      return {
        text: `Here are some of Ankit's featured projects:\n\n${projList}\n\n...plus mobile apps like **SkillUp** (React Native) and **Stayver** (Hotel Booking). Which one would you like details on?`,
        chips: ["Valdio", "BoundDesk CRM", "Jeevaloop", "SkillUp", "Stayver"],
      };
    }

    // 6. SKILLS / TECH STACK
    if (
      q.includes("skill") ||
      q.includes("tech") ||
      q.includes("stack") ||
      q.includes("language") ||
      q.includes("framework") ||
      q.includes("mern") ||
      q.includes("database") ||
      q.includes("react") ||
      q.includes("node")
    ) {
      return {
        text: `Ankit's core tech competencies include:\n\n💻 **Frontend & Mobile:** ${chatbotKnowledge.skills.core.join(", ")}\n\n⚙️ **Backend & Database:** ${chatbotKnowledge.skills.server.join(", ")}\n\n🛠️ **DevOps & Tools:** ${chatbotKnowledge.skills.tooling.join(", ")}`,
        chips: ["Projects", "Services", "Download Resume"],
      };
    }

    // 7. SERVICES / FREELANCE / HIRING
    if (
      q.includes("service") ||
      q.includes("offer") ||
      q.includes("freelance") ||
      q.includes("hire") ||
      q.includes("contract") ||
      q.includes("mvp")
    ) {
      const servicesList = chatbotKnowledge.services
        .map((s) => `• **${s.title}**: ${s.description}`)
        .join("\n\n");

      return {
        text: `Ankit offers the following engineering services for startups, businesses, and founders:\n\n${servicesList}\n\nHe is available for freelance contracts and full-time positions!`,
        chips: ["Contact Info", "Schedule Call", "Projects"],
      };
    }

    // 8. EDUCATION & CERTIFICATIONS
    if (
      q.includes("education") ||
      q.includes("college") ||
      q.includes("university") ||
      q.includes("masai") ||
      q.includes("study") ||
      q.includes("degree") ||
      q.includes("certificate") ||
      q.includes("achievement")
    ) {
      const eduInfo = chatbotKnowledge.education
        .map((e) => `• **${e.course}** — ${e.institution} (${e.period})`)
        .join("\n");
      const achInfo = chatbotKnowledge.achievements
        .map((a) => `• ${a.title} (${a.org})`)
        .join("\n");

      return {
        text: `🎓 **Education:**\n${eduInfo}\n\n🏆 **Key Achievements:**\n${achInfo}`,
        chips: ["Tech Skills", "Projects", "Contact Info"],
      };
    }

    // 9. CONTACT / SCHEDULE / SOCIALS
    if (
      q.includes("contact") ||
      q.includes("email") ||
      q.includes("phone") ||
      q.includes("reach") ||
      q.includes("message") ||
      q.includes("call") ||
      q.includes("schedule") ||
      q.includes("linkedin") ||
      q.includes("github")
    ) {
      return {
        text: `You can reach Ankit directly:\n\n📧 **Email:** ${chatbotKnowledge.personalInfo.email}\n📱 **Phone:** ${chatbotKnowledge.personalInfo.phone}\n📍 **Location:** ${chatbotKnowledge.personalInfo.location}\n\nYou can also click the link below to visit his socials or send a message via the contact form!`,
        links: [
          { label: "LinkedIn Profile", href: chatbotKnowledge.personalInfo.links.linkedin },
          { label: "GitHub Profile", href: chatbotKnowledge.personalInfo.links.github },
        ],
        chips: ["Download Resume", "Projects", "Services"],
      };
    }

    // 10. DEFAULT / FALLBACK
    return {
      text: `I'm not completely certain about that specific query, but I know everything about Ankit's work, code, and career! Try asking one of these:`,
      chips: ["Projects", "Tech Skills", "Services", "Contact Info", "Download Resume"],
    };
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-body">
      {/* CHAT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="mb-3 w-[calc(100vw-2.5rem)] sm:w-[390px] h-[520px] max-h-[82vh] bg-panel border border-line rounded-2xl shadow-panel flex flex-col overflow-hidden backdrop-blur-md"
          >
            {/* HEADER */}
            <div className="bg-panel2 px-4 py-3.5 border-b border-line flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-xl bg-cyan/10 border border-cyan/30 flex items-center justify-center text-cyan">
                  <RiRobot2Line className="text-xl" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyan ring-2 ring-panel2 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-semibold text-paper text-sm tracking-tight">
                      Ankit's Assistant
                    </h3>
                    <span className="bg-cyan/15 text-cyan border border-cyan/30 rounded px-1.5 py-0.5 text-[9px] font-mono font-medium uppercase tracking-wider">
                      Offline AI
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-muted flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
                    Always active &amp; instant
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleClear}
                  title="Clear chat"
                  className="p-1.5 rounded-lg text-muted hover:text-paper hover:bg-line/40 transition-colors"
                >
                  <FiTrash2 className="text-sm" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="p-1.5 rounded-lg text-muted hover:text-paper hover:bg-line/40 transition-colors"
                >
                  <FiX className="text-base" />
                </button>
              </div>
            </div>

            {/* MESSAGES CONTAINER */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-ink/70 blueprint-grid">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed break-words whitespace-pre-line shadow-sm ${
                      msg.sender === "user"
                        ? "bg-cyan text-ink font-medium rounded-tr-sm"
                        : "bg-panel2 border border-line text-paper/95 rounded-tl-sm"
                    }`}
                  >
                    {msg.text}

                    {/* LINKS ATTACHMENT */}
                    {msg.links && msg.links.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-line/60 flex flex-wrap gap-2">
                        {msg.links.map((link, idx) => (
                          <a
                            key={idx}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={link.download}
                            className="inline-flex items-center gap-1.5 bg-panel border border-cyan/40 text-cyan text-[11px] font-mono px-2.5 py-1 rounded-md hover:bg-cyan/10 transition-colors"
                          >
                            {link.download ? <FiDownload /> : <FiExternalLink />}
                            {link.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* QUICK CHIP SUGGESTIONS */}
                  {msg.chips && msg.chips.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5 max-w-[95%]">
                      {msg.chips.map((chip, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSend(chip)}
                          className="bg-panel/90 border border-line hover:border-cyan text-muted hover:text-paper font-mono text-[11px] px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* TYPING INDICATOR */}
              {isTyping && (
                <div className="flex items-center gap-1.5 bg-panel2 border border-line px-3 py-2 rounded-2xl rounded-tl-sm w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-bounce" />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* INPUT FOOTER */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-panel2 border-t border-line flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about projects, skills, contact..."
                className="flex-1 bg-ink border border-line rounded-xl px-3.5 py-2 text-xs sm:text-sm text-paper placeholder:text-muted/60 focus:border-cyan focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="bg-cyan text-ink hover:bg-cyan/90 disabled:opacity-30 disabled:cursor-not-allowed w-9 h-9 rounded-xl flex items-center justify-center transition-transform active:scale-95 flex-shrink-0"
              >
                <FiSend className="text-sm" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING TOGGLE BUTTON */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-panel border transition-all duration-300 cursor-pointer ${
          isOpen
            ? "bg-panel2 border-line text-paper"
            : "bg-gradient-to-br from-cyan to-cyan/80 text-ink border-cyan/60 hover:shadow-cyan/20 hover:shadow-lg"
        }`}
        aria-label="Toggle chatbot"
      >
        {isOpen ? (
          <FiX className="text-2xl" />
        ) : (
          <div className="relative flex items-center justify-center">
            <RiRobot2Line className="text-2xl" />
            {!hasOpened && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber rounded-full ring-2 ring-ink animate-ping" />
            )}
          </div>
        )}
      </motion.button>
    </div>
  );
}
