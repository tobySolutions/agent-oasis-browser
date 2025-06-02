
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Bot, ArrowLeft, Plus, X, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export const AgentOnboarding = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    tags: [],
    capabilities: '',
    pricing: 'free',
    apiEndpoint: ''
  });
  const [currentTag, setCurrentTag] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Get existing agents
    const existingAgents = JSON.parse(localStorage.getItem('marketplace_agents') || '[]');
    
    // Create new agent
    const newAgent = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      category: formData.category,
      tags: formData.tags,
      capabilities: formData.capabilities,
      pricing: formData.pricing,
      apiEndpoint: formData.apiEndpoint,
      rating: 0,
      reviews: 0,
      users: 0,
      creator: currentUser.name,
      createdAt: new Date().toISOString(),
      status: 'pending',
      gaiaEnabled: true
    };

    // Save to localStorage
    const updatedAgents = [...existingAgents, newAgent];
    localStorage.setItem('marketplace_agents', JSON.stringify(updatedAgents));

    toast({
      title: "Agent Submitted!",
      description: "Your AI agent has been submitted for review.",
    });

    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Marketplace
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                  <AvatarFallback className="bg-gray-800 text-white border border-gray-700">
                    {currentUser?.name?.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-white font-medium">{currentUser?.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Bot className="w-16 h-16 text-white mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Submit Your AI Agent</h1>
          <p className="text-gray-400">Share your AI agent with the Gaia-powered marketplace</p>
        </div>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Agent Information</CardTitle>
            <CardDescription className="text-gray-400">
              Provide details about your AI agent to help users discover and understand its capabilities.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Agent Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Smart Contract Analyzer"
                    className="bg-black border-gray-700 text-white placeholder:text-gray-500 focus:border-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-white">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger className="bg-black border-gray-700 text-white focus:border-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      <SelectItem value="WEB3" className="text-white hover:bg-gray-800">WEB3</SelectItem>
                      <SelectItem value="SHOPPING" className="text-white hover:bg-gray-800">SHOPPING</SelectItem>
                      <SelectItem value="UTILITY" className="text-white hover:bg-gray-800">UTILITY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe what your agent does and how it helps users..."
                  className="bg-black border-gray-700 text-white placeholder:text-gray-500 focus:border-white min-h-[100px]"
                  required
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label className="text-white">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="Add a tag..."
                    className="bg-black border-gray-700 text-white placeholder:text-gray-500 focus:border-white"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="sm" className="bg-white text-black hover:bg-gray-200">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-800 text-gray-300 border-gray-700">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Capabilities */}
              <div className="space-y-2">
                <Label htmlFor="capabilities" className="text-white">Key Capabilities</Label>
                <Textarea
                  id="capabilities"
                  value={formData.capabilities}
                  onChange={(e) => handleInputChange('capabilities', e.target.value)}
                  placeholder="List the main features and capabilities of your agent..."
                  className="bg-black border-gray-700 text-white placeholder:text-gray-500 focus:border-white"
                />
              </div>

              {/* Pricing */}
              <div className="space-y-2">
                <Label htmlFor="pricing" className="text-white">Pricing Model</Label>
                <Select value={formData.pricing} onValueChange={(value) => handleInputChange('pricing', value)}>
                  <SelectTrigger className="bg-black border-gray-700 text-white focus:border-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="free" className="text-white hover:bg-gray-800">Free</SelectItem>
                    <SelectItem value="freemium" className="text-white hover:bg-gray-800">Freemium</SelectItem>
                    <SelectItem value="paid" className="text-white hover:bg-gray-800">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* API Endpoint */}
              <div className="space-y-2">
                <Label htmlFor="apiEndpoint" className="text-white">API Endpoint (Optional)</Label>
                <Input
                  id="apiEndpoint"
                  value={formData.apiEndpoint}
                  onChange={(e) => handleInputChange('apiEndpoint', e.target.value)}
                  placeholder="https://api.youragent.com/v1/chat"
                  className="bg-black border-gray-700 text-white placeholder:text-gray-500 focus:border-white"
                />
              </div>

              {/* Gaia Integration Notice */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Bot className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">Gaia Integration</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Your agent will be automatically integrated with Gaia inferencing for enhanced performance and reliability.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="flex-1 border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-white text-black hover:bg-gray-200"
                >
                  Submit Agent
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
