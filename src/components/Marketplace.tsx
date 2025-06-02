
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bot, Search, Plus, Star, Users, Activity, LogOut, Filter, ChevronDown, Settings } from 'lucide-react';
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
      case 'WEB3': return 'bg-gray-200 text-gray-800 border-gray-300';
      case 'SHOPPING': return 'bg-gray-200 text-gray-800 border-gray-300';
      case 'UTILITY': return 'bg-gray-200 text-gray-800 border-gray-300';
      case 'FINANCE': return 'bg-gray-200 text-gray-800 border-gray-300';
      case 'HEALTH': return 'bg-gray-200 text-gray-800 border-gray-300';
      case 'EDUCATION': return 'bg-gray-200 text-gray-800 border-gray-300';
      case 'ENTERTAINMENT': return 'bg-gray-200 text-gray-800 border-gray-300';
      case 'BUSINESS': return 'bg-gray-200 text-gray-800 border-gray-300';
      default: return 'bg-gray-200 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-300 bg-black sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bot className="w-8 h-8 text-white" />
              <h1 className="text-2xl font-bold text-white">AI Marketplace</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/onboard')}
                className="bg-white text-black hover:bg-gray-200 border border-gray-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                Submit Agent
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 text-white hover:text-white hover:bg-gray-800">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                      <AvatarFallback className="bg-white text-black">{currentUser?.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{currentUser?.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border-gray-300">
                  <DropdownMenuItem 
                    onClick={() => navigate('/dashboard')}
                    className="text-black hover:text-black hover:bg-gray-100 cursor-pointer"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    API Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-300" />
                  <DropdownMenuItem 
                    onClick={onLogout}
                    className="text-black hover:text-black hover:bg-gray-100 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
              className="pl-10 bg-white border-gray-300 text-black placeholder-gray-500"
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
                    ? 'bg-black text-white hover:bg-gray-800' 
                    : 'border-gray-300 text-black hover:bg-gray-100 hover:border-gray-400'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white border-gray-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Agents</p>
                  <p className="text-2xl font-bold text-black">{agents.length}</p>
                </div>
                <Bot className="w-8 h-8 text-black" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-gray-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Active Users</p>
                  <p className="text-2xl font-bold text-black">2.4k</p>
                </div>
                <Users className="w-8 h-8 text-black" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-gray-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Interactions</p>
                  <p className="text-2xl font-bold text-black">156k</p>
                </div>
                <Activity className="w-8 h-8 text-black" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAgents.map((agent) => (
            <Card 
              key={agent.id}
              className="bg-white border-gray-300 hover:border-black transition-all duration-300 hover:scale-105 cursor-pointer group hover:shadow-lg"
              onClick={() => navigate(`/agent/${agent.id}`)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-black text-lg group-hover:text-gray-600 transition-colors">
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
                <CardDescription className="text-gray-600 mb-4 line-clamp-2">
                  {agent.description}
                </CardDescription>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-black" />
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
                    <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700 border border-gray-300">
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
            <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No agents found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};
