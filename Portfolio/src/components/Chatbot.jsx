import React, { useState, useRef, useEffect } from 'react';
import { chatbotKnowledge } from '../config/chatbotKnowledge';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm Ankit's AI assistant. How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
        setInput('');

        // Process response
        setTimeout(() => {
            const response = generateResponse(userMessage);
            setMessages(prev => [...prev, { text: response, isBot: true }]);
        }, 500);
    };

    const generateResponse = (query) => {
        const q = query.toLowerCase();

        if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
            return "Hello! You can ask me about Ankit's projects, skills, education, or contact details.";
        }

        if (q.includes('project') || q.includes('build') || q.includes('work')) {
            const projects = chatbotKnowledge.projects.map(p => p.title).join(', ');
            return `Ankit has worked on several projects including: ${projects}. Which one would you like to know more about?`;
        }

        if (q.includes('skill') || q.includes('tech') || q.includes('know')) {
            const techs = [...chatbotKnowledge.skills.languages, ...chatbotKnowledge.skills.frameworks].join(', ');
            return `Ankit is proficient in: ${techs}. He also uses tools like ${chatbotKnowledge.skills.tools.join(', ')}.`;
        }

        if (q.includes('education') || q.includes('study') || q.includes('college')) {
            const edu = chatbotKnowledge.education[0];
            return `Ankit is currently studying ${edu.course} at ${edu.institution} (${edu.period}). He previously completed a B.Sc. in Chemistry.`;
        }

        if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('reach')) {
            return `You can reach Ankit via email at ${chatbotKnowledge.personalInfo.email} or call him at ${chatbotKnowledge.personalInfo.phone}.`;
        }

        // Individual project matching
        for (const project of chatbotKnowledge.projects) {
            if (q.includes(project.title.toLowerCase())) {
                return `${project.title}: ${project.description} Technologies: ${project.technologies.join(', ')}.`;
            }
        }

        return "I'm not sure about that. Try asking about his projects, skills, or education!";
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            {/* Chat window */}
            {isOpen && (
                <div className="mb-4 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300 transform scale-100 origin-bottom-right">
                    {/* Header */}
                    <div className="bg-blue-600 p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-white">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <i className="ri-robot-2-line text-lg"></i>
                            </div>
                            <div>
                                <p className="font-bold text-sm">Ankit's Assistant</p>
                                <p className="text-[10px] opacity-80">Online | Ready to help</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white hover:opacity-70">
                            <i className="ri-close-line text-xl"></i>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.isBot
                                        ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-700'
                                        : 'bg-blue-600 text-white shadow-md'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type a message..."
                                className="flex-1 bg-gray-100 dark:bg-gray-700 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:text-gray-200 outline-none"
                            />
                            <button
                                onClick={handleSend}
                                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                            >
                                <i className="ri-send-plane-fill"></i>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group"
            >
                {isOpen ? (
                    <i className="ri-close-line text-2xl"></i>
                ) : (
                    <div className="relative">
                        <i className="ri-chat-3-line text-2xl"></i>
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                    </div>
                )}
            </button>
        </div>
    );
};

export default Chatbot;
