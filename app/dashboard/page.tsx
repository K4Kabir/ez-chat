'use client'
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import React, { useEffect, useState } from 'react'
import { useUserContext } from '@/context/UserContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
    Search,
    MoreVertical,
    Send,
    Smile,
    Paperclip,
    Phone,
    Video,
    Info,
    MessageSquare,
    Settings,
    LogOut
} from 'lucide-react';

const mockChats = [
    {
        id: 1,
        name: "Alice Johnson",
        lastMessage: "Hey! How's the project going?",
        timestamp: "2 min ago",
        unreadCount: 2,
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
        online: true
    },
    {
        id: 2,
        name: "Team Frontend",
        lastMessage: "Sarah: The new components are ready for review",
        timestamp: "15 min ago",
        unreadCount: 5,
        avatar: null,
        online: false,
        isGroup: true
    },
    {
        id: 3,
        name: "Mike Chen",
        lastMessage: "Thanks for the feedback!",
        timestamp: "1 hour ago",
        unreadCount: 0,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        online: false
    },
    {
        id: 4,
        name: "Emma Wilson",
        lastMessage: "Let's schedule the meeting for tomorrow",
        timestamp: "3 hours ago",
        unreadCount: 1,
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        online: true
    },
    {
        id: 5,
        name: "Design Team",
        lastMessage: "John: New mockups uploaded to Figma",
        timestamp: "Yesterday",
        unreadCount: 0,
        avatar: null,
        online: false,
        isGroup: true
    }
];

// Mock messages for selected chat
const mockMessages = [
    {
        id: 1,
        sender: "Alice Johnson",
        content: "Hey! How's the project going?",
        timestamp: "10:30 AM",
        isOwn: false,
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150"
    },
    {
        id: 2,
        sender: "You",
        content: "Going well! Just finished the authentication flow. Working on the chat interface now.",
        timestamp: "10:32 AM",
        isOwn: true
    },
    {
        id: 3,
        sender: "Alice Johnson",
        content: "That's awesome! Can't wait to see it. The design looks really clean in the mockups.",
        timestamp: "10:35 AM",
        isOwn: false,
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150"
    },
    {
        id: 4,
        sender: "You",
        content: "Thanks! I'm particularly proud of the responsive design. It works great on mobile too.",
        timestamp: "10:37 AM",
        isOwn: true
    },
    {
        id: 5,
        sender: "Alice Johnson",
        content: "Perfect! When do you think we can do a quick demo?",
        timestamp: "10:38 AM",
        isOwn: false,
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150"
    }
];


const page = () => {
    const { user } = useUser()
    const checkUser = useMutation(api.user.CheckUser)
    const { setUser } = useUserContext();
    const [selectedChat, setSelectedChat] = useState(mockChats[0]);
    const [searchQuery, setSearchQuery] = useState("");
    const [newMessage, setNewMessage] = useState("");

    const filteredChats = mockChats.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            // In a real app, this would send the message
            console.log("Sending message:", newMessage);
            setNewMessage("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    useEffect(() => {
        if (user) {
            checkUser({
                id: user.id,
                userName: user.fullName || "Anonymous"
            }).then((res) => {
                setUser(res);
            })
        }
    }, [user, checkUser, setUser])

    return (
        <div className="flex h-screen bg-background">
            {/* Left Sidebar - Chat List */}
            <div className="w-80 border-r border-border flex flex-col bg-card">
                {/* Header */}
                <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-semibold">Messages</h1>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                                <Settings className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Chat List */}
                <ScrollArea className="flex-1">
                    <div className="p-2">
                        {filteredChats.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => setSelectedChat(chat)}
                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent ${selectedChat.id === chat.id ? 'bg-accent' : ''
                                    }`}
                            >
                                <div className="relative">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={chat.avatar} />
                                        <AvatarFallback>
                                            {chat.isGroup ? (
                                                <MessageSquare className="h-5 w-5" />
                                            ) : (
                                                chat.name.split(' ').map(n => n[0]).join('')
                                            )}
                                        </AvatarFallback>
                                    </Avatar>
                                    {chat.online && (
                                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-medium text-sm truncate">{chat.name}</h3>
                                        <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                                </div>

                                {chat.unreadCount > 0 && (
                                    <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                                        {chat.unreadCount}
                                    </Badge>
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Right Side - Chat Conversation */}
            <div className="flex-1 flex flex-col">
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-border bg-card">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={selectedChat.avatar} />
                                            <AvatarFallback>
                                                {selectedChat.isGroup ? (
                                                    <MessageSquare className="h-5 w-5" />
                                                ) : (
                                                    selectedChat.name.split(' ').map(n => n[0]).join('')
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                        {selectedChat.online && (
                                            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="font-semibold">{selectedChat.name}</h2>
                                        <p className="text-sm text-muted-foreground">
                                            {selectedChat.online ? 'Online' : 'Last seen recently'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon">
                                        <Phone className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <Video className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <Info className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                {mockMessages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex gap-3 ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {!message.isOwn && (
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={message.avatar} />
                                                <AvatarFallback>
                                                    {message.sender.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                        )}

                                        <div className={`max-w-xs lg:max-w-md ${message.isOwn ? 'order-first' : ''}`}>
                                            <div
                                                className={`rounded-lg px-4 py-2 ${message.isOwn
                                                    ? 'bg-primary text-primary-foreground ml-auto'
                                                    : 'bg-muted'
                                                    }`}
                                            >
                                                <p className="text-sm">{message.content}</p>
                                            </div>
                                            <p className={`text-xs text-muted-foreground mt-1 ${message.isOwn ? 'text-right' : 'text-left'
                                                }`}>
                                                {message.timestamp}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        {/* Message Input */}
                        <div className="p-4 border-t border-border bg-card">
                            <div className="flex items-end gap-2">
                                <Button variant="ghost" size="icon">
                                    <Paperclip className="h-4 w-4" />
                                </Button>

                                <div className="flex-1 relative">
                                    <Input
                                        placeholder="Type a message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="pr-10"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-1 top-1/2 transform -translate-y-1/2"
                                    >
                                        <Smile className="h-4 w-4" />
                                    </Button>
                                </div>

                                <Button
                                    onClick={handleSendMessage}
                                    size="icon"
                                    disabled={!newMessage.trim()}
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-muted/20">
                        <div className="text-center">
                            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Welcome to Chat</h3>
                            <p className="text-muted-foreground">Select a conversation to start messaging</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default page
