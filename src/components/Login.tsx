
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Bot, Sparkles } from 'lucide-react';

const demoUsers = [
  {
    id: 1,
    name: 'Alex Chen',
    email: 'alex@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    role: 'Developer',
    bio: 'AI enthusiast and blockchain developer'
  },
  {
    id: 2,
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    role: 'Product Manager',
    bio: 'Building the future of AI-powered commerce'
  },
  {
    id: 3,
    name: 'Marcus Johnson',
    email: 'marcus@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    role: 'Data Scientist',
    bio: 'Specializing in utility AI agents'
  },
  {
    id: 4,
    name: 'Emma Davis',
    email: 'emma@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    role: 'UX Designer',
    bio: 'Designing intuitive AI experiences'
  }
];

export const Login = ({ onLogin }) => {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleLogin = () => {
    if (selectedUser) {
      onLogin(selectedUser);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Bot className="w-12 h-12 text-black" />
              <Sparkles className="w-6 h-6 text-gray-600 absolute -top-1 -right-1" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-black mb-2">AI Agent Marketplace</h1>
          <p className="text-gray-600 text-lg">Powered by Gaia Inferencing • Choose your demo profile</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {demoUsers.map((user) => (
            <Card 
              key={user.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedUser?.id === user.id 
                  ? 'bg-black text-white border-black shadow-lg' 
                  : 'bg-white border-gray-300 hover:border-black'
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <CardHeader className="text-center pb-2">
                <Avatar className="w-16 h-16 mx-auto mb-2">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-gray-200 text-black">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <CardTitle className={`text-lg ${selectedUser?.id === user.id ? 'text-white' : 'text-black'}`}>
                  {user.name}
                </CardTitle>
                <CardDescription className={`${selectedUser?.id === user.id ? 'text-gray-300' : 'text-gray-600'}`}>
                  {user.role}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className={`text-sm text-center ${selectedUser?.id === user.id ? 'text-gray-300' : 'text-gray-500'}`}>
                  {user.bio}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={handleLogin}
            disabled={!selectedUser}
            className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enter Marketplace
          </Button>
        </div>
      </div>
    </div>
  );
};
