import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Zap, Bot, User } from 'lucide-react';

const PortfolioChatBot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hi! I'm Ankit's AI assistant. Ask me anything about his skills, projects, or experience!",
      isBot: true,
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cleaner message splitter
  const formatMessage = (text) => {
    const lines = text.split('\n');
    return (
      <>
        {lines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </>
    );
  };

  // More optimized AI Response Logic
  const AI_RESPONSES = [
    {
      keywords: ['skill', 'technology', 'tech'],
      reply:
        "Ankit is proficient in:\n• React.js, JavaScript, HTML, CSS, Tailwind\n• Backend: Node.js, Express.js\n• Databases: MongoDB, Firebase\n• Tools: Git, VS Code, Figma\n• Specialities: Responsive UI, Mobile Apps, UI/UX",
    },
    {
      keywords: ['experience', 'job', 'work'],
      reply:
        "Ankit is a passionate full-stack developer skilled in building responsive, real-world applications using modern JavaScript technologies.",
    },
    {
      keywords: ['project', 'portfolio'],
      reply:
        "Ankit has built:\n• TodoList App\n• TrafficSub System\n• LinkedIn Clone\n• Multiple responsive web apps.\nEach project highlights clean UI + modern development practices.",
    },
    {
      keywords: ['contact', 'hire', 'email', 'reach'],
      reply:
        "You can contact Ankit via:\n• Portfolio Contact Form\n• LinkedIn Profile\n• GitHub Repositories\nHe is actively open to new opportunities!",
    },
    {
      keywords: ['education', 'study', 'learn', 'background'],
      reply:
        "Ankit is always learning new technologies and improving his skills in frontend, backend, and mobile app development.",
    },
    {
      keywords: ['hello', 'hi', 'hey', 'start'],
      reply:
        "Hello! 👋 Ask me anything about Ankit’s skills, projects, or experience.",
    },
    {
      keywords: ['react', 'javascript', 'js'],
      reply:
        "Ankit has strong expertise in React.js and JavaScript, building modern, scalable, component-driven applications.",
    },
    {
      keywords: ['mobile', 'responsive', 'app'],
      reply:
        "Ankit builds responsive websites and mobile-friendly UIs with smooth layouts and great user experience.",
    },
    {
      keywords: ['ui', 'ux', 'design'],
      reply:
        "Ankit focuses on clean UI and smooth UX, ensuring layouts are modern, minimal, and user-friendly.",
    },
    {
      keywords: ['mongodb', 'database', 'backend'],
      reply:
        "Ankit works with MongoDB, Firebase, Node.js, and Express to build full-stack applications.",
    },
  ];

  const getAIResponse = (message) => {
    const lower = message.toLowerCase();

    for (const block of AI_RESPONSES) {
      if (block.keywords.some((k) => lower.includes(k))) {
        return block.reply;
      }
    }

    return "That's interesting! Ask me about Ankit’s tech skills, experience, or projects — I'm here to help.";
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    setMessages((prev) => [...prev, { text: userMessage, isBot: false }]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse(userMessage);
      setMessages((prev) => [...prev, { text: response, isBot: true }]);
      setIsTyping(false);
    }, 700 + Math.random() * 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <footer className="text-center py-8 border-t border-gray-200 bg-gray-50">
        <p className="text-gray-600">© 2025 Ankit Kumar. All rights reserved.</p>
      </footer>

      {/* Chat Popup */}
      <div className="fixed bottom-6 right-6 z-50">
        {isChatOpen && (
          <div className="mb-4 w-[90vw] max-w-md h-[70vh] sm:w-96 sm:h-[500px] 
            bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl 
            flex flex-col animate-in slide-in-from-bottom-4 duration-300">

            {/* Header */}
            <div className="p-4 border-b bg-gradient-to-r from-cyan-500 to-purple-600 
              rounded-t-2xl text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">AI Assistant</h3>
                  <p className="text-xs opacity-75">Ask about Ankit</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)}>
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                  {msg.isBot && (
                    <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed 
                    ${msg.isBot
                      ? 'bg-white text-gray-800 shadow-sm border'
                      : 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-sm'
                    }`}>
                    {formatMessage(msg.text)}
                  </div>
                  {!msg.isBot && (
                    <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2 justify-start">
                  <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-white px-3 py-2 rounded-2xl shadow-sm border">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white rounded-b-2xl">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about skills, projects, experience..."
                  className="flex-1 px-3 py-2 bg-gray-50 text-gray-800 rounded-xl text-sm
                    focus:ring-2 focus:ring-cyan-500/20"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 p-2 rounded-xl disabled:opacity-50">
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:scale-105">
          {isChatOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
        </button>

        {/* Notification */}
        {!isChatOpen && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
    </>
  );
};

export default PortfolioChatBot;
