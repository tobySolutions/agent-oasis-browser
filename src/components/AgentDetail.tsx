import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Bot, ArrowLeft, Star, Users, Activity, ExternalLink, MessageCircle, LogOut } from 'lucide-react';
import { ChatInterface } from './ChatInterface';

export const AgentDetail = ({ currentUser, onLogout }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const agents = JSON.parse(localStorage.getItem('marketplace_agents') || '[]');
    const foundAgent = agents.find(a => a.id === parseInt(id));
    setAgent(foundAgent);
    setIsLoading(false);
  }, [id]);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'WEB3': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'SHOPPING': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'UTILITY': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'FINANCE': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'HEALTH': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'EDUCATION': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'ENTERTAINMENT': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      case 'BUSINESS': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleTryAgent = () => {
    setIsChatOpen(true);
    
    // Update user count
    const agents = JSON.parse(localStorage.getItem('marketplace_agents') || '[]');
    const updatedAgents = agents.map(a => 
      a.id === agent.id 
        ? { ...a, users: a.users + 1 }
        : a
    );
    localStorage.setItem('marketplace_agents', JSON.stringify(updatedAgents));
    setAgent(prev => ({ ...prev, users: prev.users + 1 }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Bot className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-400">Loading agent details...</p>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Bot className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Agent Not Found</h2>
          <p className="text-gray-400 mb-4">The agent you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>
            Return to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Marketplace
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                  <AvatarFallback>{currentUser?.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <span className="text-white font-medium">{currentUser?.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="text-gray-400 hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Agent Header */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-2xl text-white">{agent.name}</CardTitle>
                      <Badge className={getCategoryColor(agent.category)}>
                        {agent.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-300 text-lg">
                      {agent.description}
                    </CardDescription>
                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>{agent.rating || 'New'}</span>
                        {agent.reviews > 0 && <span>({agent.reviews} reviews)</span>}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{agent.users} users</span>
                      </div>
                      {agent.creator && (
                        <div>
                          <span>Created by {agent.creator}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Description and Capabilities */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">About This Agent</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-white font-medium mb-2">Description</h4>
                  <p className="text-gray-300">{agent.description}</p>
                </div>
                
                {agent.capabilities && (
                  <div>
                    <h4 className="text-white font-medium mb-2">Key Capabilities</h4>
                    <p className="text-gray-300">{agent.capabilities}</p>
                  </div>
                )}

                {agent.tags && agent.tags.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {agent.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="bg-slate-700 text-gray-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator className="bg-slate-600" />

                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Bot className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-300 font-medium">Powered by Gaia</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    This agent uses Gaia inferencing for reliable, high-performance AI interactions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Try This Agent</CardTitle>
                <CardDescription className="text-gray-400">
                  Interact with this AI agent now
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleTryAgent}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start Conversation
                </Button>
                
                {agent.apiEndpoint && (
                  <Button variant="outline" className="w-full border-slate-600 text-gray-300 hover:text-white">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    API Documentation
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Agent Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Users</span>
                  <span className="text-white font-medium">{agent.users}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Rating</span>
                  <span className="text-white font-medium">{agent.rating || 'New'}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Category</span>
                  <Badge className={getCategoryColor(agent.category)}>
                    {agent.category}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Pricing</span>
                  <span className="text-white font-medium capitalize">
                    {agent.pricing || 'Free'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Integration Info */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Status</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {agent.status || 'Active'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Gaia Enabled</span>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      ✓ Yes
                    </Badge>
                  </div>
                  
                  {agent.createdAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Created</span>
                      <span className="text-white">
                        {new Date(agent.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <ChatInterface 
        agent={agent}
        currentUser={currentUser}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
};
