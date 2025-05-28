
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Bot, Search, Plus, Star, Users, Activity, LogOut, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { agentData } from '@/data/agentData';

export const Marketplace = ({ currentUser, onLogout }) => {
  const [agents, setAgents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [filteredAgents, setFilteredAgents] = useState([]);
  const navigate = useNavigate();

  const categories = ['ALL', 'WEB3', 'SHOPPING', 'UTILITY', 'FINANCE', 'HEALTH', 'EDUCATION', 'ENTERTAINMENT', 'BUSINESS'];

  useEffect(() => {
    // Initialize agents from data or localStorage
    const storedAgents = localStorage.getItem('marketplace_agents');
    if (storedAgents) {
      setAgents(JSON.parse(storedAgents));
    } else {
      setAgents(agentData);
      localStorage.setItem('marketplace_agents', JSON.stringify(agentData));
    }
  }, []);

  useEffect(() => {
    let filtered = agents;
    
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(agent => agent.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(agent => 
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredAgents(filtered);
  }, [agents, searchTerm, selectedCategory]);

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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bot className="w-8 h-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">AI Marketplace</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/onboard')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Submit Agent
              </Button>
              
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-gray-400"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`${
                  selectedCategory === category 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'border-slate-600 text-gray-300 hover:text-white hover:border-slate-500'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Agents</p>
                  <p className="text-2xl font-bold text-white">{agents.length}</p>
                </div>
                <Bot className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Users</p>
                  <p className="text-2xl font-bold text-white">2.4k</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Interactions</p>
                  <p className="text-2xl font-bold text-white">156k</p>
                </div>
                <Activity className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAgents.map((agent) => (
            <Card 
              key={agent.id}
              className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 cursor-pointer group"
              onClick={() => navigate(`/agent/${agent.id}`)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg group-hover:text-purple-300 transition-colors">
                        {agent.name}
                      </CardTitle>
                      <Badge className={getCategoryColor(agent.category)}>
                        {agent.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <CardDescription className="text-gray-300 mb-4 line-clamp-2">
                  {agent.description}
                </CardDescription>
                
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>{agent.rating}</span>
                    <span>({agent.reviews})</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{agent.users}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-3">
                  {agent.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-slate-700 text-gray-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-12">
            <Bot className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No agents found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};
