import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Zap, Bot, User } from 'lucide-react';

const PortfolioChatBot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm Ankit's AI assistant. Ask me anything about his skills, projects, or experience!", isBot: true }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Enhanced responses with more detail
    if (lowerMessage.includes('skill') || lowerMessage.includes('technology') || lowerMessage.includes('tech')) {
      return "Ankit is proficient in:\n• Frontend: React.js, JavaScript, HTML5, CSS3, Tailwind CSS\n• Backend: Node.js, Express.js\n• Databases: MongoDB, Firebase\n• Tools: Git, VS Code, Figma\n• Specialties: UI/UX Design, Mobile App Development, Responsive Design";
    }
    
    if (lowerMessage.includes('experience') || lowerMessage.includes('job') || lowerMessage.includes('work')) {
      return "Ankit is a passionate full-stack developer with hands-on experience in modern web technologies. He specializes in creating responsive, user-friendly applications and has a strong foundation in both frontend and backend development.";
    }
    
    if (lowerMessage.includes('project') || lowerMessage.includes('portfolio') || lowerMessage.includes('work')) {
      return "Ankit has built several impressive projects:\n• TodoList Clone - Task management app\n• TrafficSub - Traffic management system\n• LinkedIn Clone - Social networking platform\n• Various responsive web applications\n\nEach project showcases his expertise in modern development practices!";
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('hire') || lowerMessage.includes('email') || lowerMessage.includes('reach')) {
      return "You can connect with Ankit through:\n• Email: Use the contact form on his portfolio\n• LinkedIn: Professional networking\n• GitHub: Check out his code repositories\n• He's actively looking for new opportunities!";
    }
    
    if (lowerMessage.includes('education') || lowerMessage.includes('study') || lowerMessage.includes('learn') || lowerMessage.includes('background')) {
      return "Ankit is committed to continuous learning and professional growth. He stays updated with the latest tech trends, best practices, and emerging technologies in web development.";
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('start')) {
      return "Hello there! 👋 I'm excited to tell you about Ankit Kumar. He's a talented developer with a passion for creating amazing digital experiences. What would you like to know?";
    }
    
    if (lowerMessage.includes('react') || lowerMessage.includes('javascript') || lowerMessage.includes('js')) {
      return "Great question! Ankit has strong expertise in React.js and JavaScript. He builds modern, interactive web applications using React hooks, state management, and component-based architecture.";
    }
    
    if (lowerMessage.includes('mobile') || lowerMessage.includes('app') || lowerMessage.includes('responsive')) {
      return "Ankit specializes in responsive design and mobile app development. He ensures all his applications work seamlessly across desktop, tablet, and mobile devices with optimal user experience.";
    }
    
    if (lowerMessage.includes('ui') || lowerMessage.includes('ux') || lowerMessage.includes('design')) {
      return "Ankit has a keen eye for UI/UX design! He combines technical skills with design principles to create visually appealing and user-friendly interfaces that provide excellent user experiences.";
    }
    
    if (lowerMessage.includes('mongodb') || lowerMessage.includes('database') || lowerMessage.includes('backend')) {
      return "Ankit works with various database technologies including MongoDB and Firebase. He can build complete full-stack applications with robust backend systems and efficient data management.";
    }
    
    // Default response
    return "That's an interesting question! Ankit is a versatile full-stack developer with expertise in modern web technologies. Feel free to ask about his specific skills, projects, experience, or how to get in touch with him!";
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = inputMessage;
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setInputMessage('');
    setIsTyping(true);
    
    // Simulate typing delay
    setTimeout(() => {
      const response = getAIResponse(userMessage);
      setMessages(prev => [...prev, { text: response, isBot: true }]);
      setIsTyping(false);
    }, Math.random() * 1000 + 500); // Random delay between 500-1500ms
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (text) => {
    return text.split('\n').map((line, index) => (
      <div key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </div>
    ));
  };

  return (
    <>
      {/* Footer */}
      <footer className="text-center py-8 border-t border-gray-200 bg-gray-50">
        <p className="text-gray-600">© 2025 Ankit Kumar. All rights reserved.</p>
      </footer>

      {/* Chat Bot */}
      <div className="fixed bottom-6 right-6 z-50">
        {isChatOpen && (
          <div className="mb-4 w-[90vw] max-w-md h-[70vh] sm:w-96 sm:h-[500px] bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-cyan-500 to-purple-600 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">AI Assistant</h3>
                  <p className="text-white/80 text-xs">Ask about Ankit</p>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                  {msg.isBot && (
                    <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.isBot 
                      ? 'bg-white text-gray-800 shadow-sm border border-gray-100' 
                      : 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-sm'
                  }`}>
                    {formatMessage(msg.text)}
                  </div>
                  {!msg.isBot && (
                    <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-2 justify-start">
                  <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-white px-3 py-2 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about skills, projects, experience..."
                  className="flex-1 px-3 py-2 bg-gray-50 text-gray-800 rounded-xl placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:bg-white transition-all"
                  disabled={isTyping}
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 p-2 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          {isChatOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white" />
          )}
        </button>

        {/* Notification Badge */}
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