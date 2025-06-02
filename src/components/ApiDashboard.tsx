
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key, ArrowLeft, Copy, Eye, EyeOff, Plus, Trash2, LogOut, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  agentId: number;
  agentName: string;
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
}

interface Agent {
  id: number;
  name: string;
  category: string;
}

interface ApiDashboardProps {
  currentUser: {
    name: string;
    avatar?: string;
  } | null;
  onLogout: () => void;
}

export const ApiDashboard: React.FC<ApiDashboardProps> = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load agents from localStorage
    const storedAgents = JSON.parse(localStorage.getItem('marketplace_agents') || '[]');
    setAgents(storedAgents);

    // Load API keys from localStorage
    const storedKeys = JSON.parse(localStorage.getItem('user_api_keys') || '[]');
    setApiKeys(storedKeys);
  }, []);

  const generateApiKey = () => {
    return `mk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  };

  const handleCreateApiKey = () => {
    if (!newKeyName.trim() || !selectedAgent) {
      toast({
        title: "Error",
        description: "Please provide a name and select an agent",
        variant: "destructive",
      });
      return;
    }

    const agent = agents.find(a => a.id === parseInt(selectedAgent));
    const newKey: ApiKey = {
      id: crypto.randomUUID(),
      name: newKeyName.trim(),
      key: generateApiKey(),
      agentId: parseInt(selectedAgent),
      agentName: agent?.name || 'Unknown',
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    const updatedKeys = [...apiKeys, newKey];
    setApiKeys(updatedKeys);
    localStorage.setItem('user_api_keys', JSON.stringify(updatedKeys));

    setNewKeyName('');
    setSelectedAgent('');
    setShowCreateForm(false);

    toast({
      title: "API Key Created",
      description: `API key "${newKey.name}" has been created successfully`,
    });
  };

  const handleDeleteApiKey = (keyId: string) => {
    const updatedKeys = apiKeys.filter(key => key.id !== keyId);
    setApiKeys(updatedKeys);
    localStorage.setItem('user_api_keys', JSON.stringify(updatedKeys));

    toast({
      title: "API Key Deleted",
      description: "API key has been deleted successfully",
    });
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisibleKeys = new Set(visibleKeys);
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId);
    } else {
      newVisibleKeys.add(keyId);
    }
    setVisibleKeys(newVisibleKeys);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    });
  };

  const maskApiKey = (key: string) => {
    return `${key.substring(0, 8)}${'*'.repeat(20)}${key.substring(key.length - 4)}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-300 bg-black">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-white hover:text-white hover:bg-gray-800"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Marketplace
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                  <AvatarFallback className="bg-white text-black">{currentUser?.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <span className="text-white font-medium">{currentUser?.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="text-white hover:text-white hover:bg-gray-800"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
              <Key className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black">API Dashboard</h1>
              <p className="text-gray-600">Manage your agent API keys and access</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* API Keys List */}
            <Card className="bg-white border-gray-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-black">Your API Keys</CardTitle>
                    <CardDescription className="text-gray-600">
                      Manage API keys for accessing agent endpoints
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-black text-white hover:bg-gray-800"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Key
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {apiKeys.length === 0 ? (
                  <div className="text-center py-8">
                    <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-black mb-2">No API Keys</h3>
                    <p className="text-gray-600 mb-4">Create your first API key to start accessing agent endpoints</p>
                    <Button
                      onClick={() => setShowCreateForm(true)}
                      variant="outline"
                      className="border-gray-300 text-black hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Key
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {apiKeys.map((apiKey) => (
                      <div key={apiKey.id} className="border border-gray-300 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="text-black font-medium">{apiKey.name}</h4>
                            <p className="text-sm text-gray-600">Agent: {apiKey.agentName}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={apiKey.isActive ? 'bg-black text-white' : 'bg-gray-300 text-gray-700'}>
                              {apiKey.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteApiKey(apiKey.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 bg-gray-100 rounded p-3">
                          <code className="flex-1 text-sm text-black font-mono">
                            {visibleKeys.has(apiKey.id) ? apiKey.key : maskApiKey(apiKey.key)}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                            className="text-gray-600 hover:text-black"
                          >
                            {visibleKeys.has(apiKey.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(apiKey.key)}
                            className="text-gray-600 hover:text-black"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="mt-3 text-xs text-gray-500">
                          Created: {new Date(apiKey.createdAt).toLocaleDateString()}
                          {apiKey.lastUsed && ` • Last used: ${new Date(apiKey.lastUsed).toLocaleDateString()}`}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Create API Key Form */}
            {showCreateForm && (
              <Card className="bg-white border-gray-300">
                <CardHeader>
                  <CardTitle className="text-black">Create New API Key</CardTitle>
                  <CardDescription className="text-gray-600">
                    Generate a new API key for agent access
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="keyName" className="text-black">Key Name</Label>
                    <Input
                      id="keyName"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="e.g., Production App, Development Testing"
                      className="bg-white border-gray-300 text-black"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="agent" className="text-black">Select Agent</Label>
                    <select
                      id="agent"
                      value={selectedAgent}
                      onChange={(e) => setSelectedAgent(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-black"
                    >
                      <option value="">Choose an agent...</option>
                      {agents.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.name} ({agent.category})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      onClick={handleCreateApiKey}
                      className="bg-black text-white hover:bg-gray-800"
                    >
                      Create API Key
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateForm(false)}
                      className="border-gray-300 text-black hover:bg-gray-100"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* API Documentation */}
            <Card className="bg-white border-gray-300">
              <CardHeader>
                <CardTitle className="text-black">API Documentation</CardTitle>
                <CardDescription className="text-gray-600">
                  Learn how to integrate agent APIs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-100 rounded p-4">
                  <h4 className="text-black font-medium mb-2">Base URL</h4>
                  <code className="text-sm text-black">https://api.marketplace.ai/v1</code>
                </div>
                
                <div className="bg-gray-100 rounded p-4">
                  <h4 className="text-black font-medium mb-2">Authentication</h4>
                  <code className="text-sm text-black">Authorization: Bearer YOUR_API_KEY</code>
                </div>
                
                <Button variant="outline" className="w-full border-gray-300 text-black hover:bg-gray-100">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Full Documentation
                </Button>
              </CardContent>
            </Card>

            {/* Usage Stats */}
            <Card className="bg-white border-gray-300">
              <CardHeader>
                <CardTitle className="text-black">Usage Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Keys</span>
                  <span className="text-black font-medium">{apiKeys.filter(k => k.isActive).length}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Agents</span>
                  <span className="text-black font-medium">{new Set(apiKeys.map(k => k.agentId)).size}</span>
                </div>
                
                <Separator className="bg-gray-300" />
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    API access requires paid subscription per agent
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Start */}
            <Card className="bg-white border-gray-300">
              <CardHeader>
                <CardTitle className="text-black">Quick Start</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded p-4">
                  <pre className="text-sm text-black">
                    <code>{`curl -X POST \\
  https://api.marketplace.ai/v1/chat \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -d '{"message": "Hello"}'`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
