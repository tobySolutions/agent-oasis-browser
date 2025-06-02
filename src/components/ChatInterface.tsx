import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Bot, Send, User, X, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

interface ChatInterfaceProps {
  agent: any;
  currentUser: any;
  isOpen: boolean;
  onClose: () => void;
}

export const ChatInterface = ({ agent, currentUser, isOpen, onClose }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting message
      const greeting: Message = {
        id: Date.now().toString(),
        content: `Hello! I'm ${agent.name}, powered by Gaia inferencing. I specialize in ${agent.category.toLowerCase()} tasks. How can I help you today?`,
        sender: 'agent',
        timestamp: new Date()
      };
      setMessages([greeting]);
    }
  }, [isOpen, agent, messages.length]);

  const generateAgentResponse = (userMessage: string) => {
    const responses = {
      WEB3: [
        "I can help you analyze your DeFi portfolio and suggest optimizations.",
        "Let me check the latest blockchain data for you.",
        "I'm scanning multiple protocols to find the best yield opportunities.",
        "Based on current gas prices, I'd recommend waiting for a better time to execute this transaction."
      ],
      SHOPPING: [
        "I found some great deals on that item across multiple stores!",
        "Let me compare prices and find the best value for your budget.",
        "I can help you track price changes and notify you when it drops.",
        "Based on your preferences, here are some sustainable alternatives."
      ],
      UTILITY: [
        "I can process that document and extract the key information for you.",
        "Let me organize your calendar and find the optimal meeting time.",
        "I'll review your code and suggest improvements for better performance.",
        "I can help automate this task to save you time."
      ],
      FINANCE: [
        "I've analyzed your spending patterns and found potential savings opportunities.",
        "Let me assess your investment portfolio and suggest rebalancing strategies.",
        "Based on current market conditions, here's my recommendation.",
        "I can help optimize your tax strategy for maximum savings."
      ],
      HEALTH: [
        "I can help analyze your symptoms, but please consult a healthcare professional for diagnosis.",
        "Let me create a personalized workout plan based on your fitness goals.",
        "I'll track your mood patterns and suggest wellness strategies.",
        "Here are some stress management techniques that might help."
      ],
      EDUCATION: [
        "I can help you practice conversation in any language you're learning.",
        "Let me generate some quiz questions to test your understanding.",
        "I'll summarize this research paper and highlight the key findings.",
        "Here's a study schedule optimized for your learning style."
      ],
      ENTERTAINMENT: [
        "Based on your viewing history, I recommend these movies and shows.",
        "I found some new music that matches your taste perfectly!",
        "Let me analyze your gameplay and suggest strategy improvements.",
        "Here's a curated playlist for your current mood."
      ],
      BUSINESS: [
        "I've completed the market research analysis you requested.",
        "Here are some qualified leads that match your target criteria.",
        "I can help create engaging content optimized for your audience.",
        "Let me analyze your competitors and identify market opportunities."
      ]
    };

    const categoryResponses = responses[agent.category as keyof typeof responses] || responses.UTILITY;
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate agent response delay
    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAgentResponse(inputValue),
        sender: 'agent',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, agentResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl h-[600px] bg-white border-gray-300 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-black font-semibold">{agent.name}</h3>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Sparkles className="w-3 h-3 text-gray-600" />
                <span>Powered by Gaia</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-600 hover:text-black"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex max-w-[80%] ${
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                } items-start space-x-2`}
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  {message.sender === 'user' ? (
                    <>
                      <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                      <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                    </>
                  ) : (
                    <AvatarFallback className="bg-black">
                      <Bot className="w-4 h-4 text-white" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div
                  className={`rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-black border border-gray-300'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-black">
                    <Bot className="w-4 h-4 text-white" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-300">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="bg-white border-gray-300 text-black placeholder-gray-500"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="bg-black text-white hover:bg-gray-800"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
