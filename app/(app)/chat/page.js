'use client'

import { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { connectSocket } from "@/lib/socket";
import { toast } from "sonner";
import { Loader2, Bot, User } from "lucide-react";



import { getUserConversations } from "@/services/conversationAPI";
import { useQuery } from "@tanstack/react-query";
import { ConversationList } from "@/components/ConversationList";



export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [connected, setConnected] = useState(false);
    const [replyError, setReplyError] = useState('');
    const skipHistoryRef = useRef(null);
    const scrollAreaRef = useRef(null);
    const viewportRef = useRef(null);
    const socketRef = useRef(null);
    // const [conversationId, setConversationId] = useState("current");
    const [selectedConversation, setSelectedConversation] = useState({ _id: "new" });
    const selectedConversationRef = useRef({ _id: "new" });

    // console.log("selectedConversationRef:", selectedConversationRef.current);


    // console.log("selectedConversation:", selectedConversation);


    const { data: conversations, isLoading, error, refetch } = useQuery({
        queryKey: ["conversations"],
        queryFn: async () => {
            const userId = "current";
            return await getUserConversations();
        }
    });



    useEffect(() => {
        selectedConversationRef.current = selectedConversation;
        setReplyError('');
        if (skipHistoryRef.current === selectedConversation._id) {
            skipHistoryRef.current = null;
            return;
        }
        setMessages([]);
        setIsTyping(false);
        if (selectedConversation._id !== 'new' && socketRef.current?.connected) {
            socketRef.current.emit('get-chat-history', { conversationId: selectedConversation._id });
        }
    }, [selectedConversation]);

    useEffect(() => {
        let cancelled = false;
        let activeSocket;
        const setup = async () => {
            try {
                const socket = await connectSocket();
                if (cancelled) { socket?.disconnect(); return; }
                if (!socket) { setReplyError('Sign in to use AI chat.'); return; }
                activeSocket = socket;
                socket.on('connect', () => {
                    setConnected(true);
                    const id = selectedConversationRef.current._id;
                    if (id !== 'new') socket.emit('get-chat-history', { conversationId: id });
                });
                socket.on('disconnect', () => {
                    setConnected(false);
                    setIsTyping(false);
                    setReplyError('Chat disconnected. Reconnecting…');
                });
                socket.on('new-message', payload => {
                    const current = selectedConversationRef.current._id;
                    if (String(payload.conversationId) !== current) return;
                    setMessages(previous => previous.some(item => item._id && item._id === payload._id) ? previous : [...previous, payload]);
                    setReplyError('');
                    setIsTyping(false);
                    refetch();
                });
                socket.on('ai-typing', setIsTyping);
                socket.on('chat-history', history => {
                    const current = selectedConversationRef.current._id;
                    if (current !== 'new' && (!history.length || String(history[0].conversationId) === current)) setMessages(history);
                });
                socket.on('chat-history-error', message => { setReplyError(message); setIsTyping(false); });
                socket.on('error-message', payload => {
                    const message = typeof payload === 'string' ? payload : payload.message;
                    setReplyError(message || 'Unable to complete your message. Please retry.');
                    setIsTyping(false);
                });
                socketRef.current = socket;
                setConnected(socket.connected);
            } catch {
                if (!cancelled) setReplyError('Unable to connect to chat. Refresh to reconnect.');
            }
        };
        setup();
        return () => {
            cancelled = true;
            activeSocket?.removeAllListeners();
            activeSocket?.disconnect();
            if (socketRef.current === activeSocket) socketRef.current = null;
        };
    }, []);

    useEffect(() => {
        const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) viewport.scrollTop = viewport.scrollHeight;
    }, [messages, isTyping, replyError]);

    const handleSend = event => {
        event.preventDefault();
        if (!input.trim() || isTyping) return;
        if (!socketRef.current?.connected) { setReplyError('Chat is reconnecting. Please try again in a moment.'); return; }
        const message = input.trim();
        const conversationId = selectedConversationRef.current._id;
        setReplyError('');
        setIsTyping(true);
        setMessages(previous => [...previous, { sender: 'user', message, timestamp: new Date().toISOString() }]);
        setInput('');
        socketRef.current.timeout(15000).emit('send-message', { message, conversationId }, (error, result) => {
            if (error || !result?.ok) {
                setIsTyping(false);
                setReplyError(result?.error || 'The server did not confirm your message. Check the conversation before retrying.');
                return;
            }
            if (conversationId === 'new' && selectedConversationRef.current._id === 'new') {
                skipHistoryRef.current = result.conversationId;
                selectedConversationRef.current = { _id: result.conversationId };
                setSelectedConversation({ _id: result.conversationId });
                refetch();
            }
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-foreground">Error loading conversations: {error.message}</p>
            </div>
        )
    }





    return (
        <>
        

            <div className="assistant-workspace">
                <div className="conversation-sidebar">
                    <h3 className="text-xs font-medium text-muted-foreground mb-4">Conversations</h3>
                    <ConversationList
                        conversations={conversations}
                        isLoading={isLoading}
                        onSelect={(conv) => setSelectedConversation(conv || { _id: "new" })}
                        selectedId={selectedConversation?._id}
                    />
                </div>

                <div className="conversation-main">
                    <Card className="conversation-card">
                        <ScrollArea className="min-h-0 flex-1 px-5 py-6 sm:px-8 overflow-y-auto" ref={scrollAreaRef}>
                            <div ref={viewportRef} className="space-y-4">
                                {messages.length === 0 && <div className="chat-empty"><Bot className="size-7 stroke-1" /><p className="text-xl font-medium tracking-tight">Start a conversation</p><p className="text-sm text-muted-foreground">Ask about your contacts, activity, or follow-ups.</p></div>}
                                {messages.map((msg, index) => (
                                    <ChatBubble key={index} msg={msg} />
                                ))}
                                {isTyping && <TypingIndicator />}
                                {replyError && <div role="alert" className="rounded-lg border bg-muted p-4 text-sm leading-6">{replyError}</div>}
                            </div>
                        </ScrollArea>

                        <form onSubmit={handleSend} className="message-composer">
                            <div className="flex gap-2 items-end">
                                <Textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    aria-label="Message"
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                                            event.preventDefault();
                                            event.currentTarget.form.requestSubmit();
                                        }
                                    }}
                                    placeholder="Type your message..."
                                    rows={2}
                                    className="flex-1 resize-none rounded-xl text-sm"
                                />
                                <Button type="submit" size="icon" className="rounded-lg shrink-0" aria-label="Send message" disabled={!input.trim() || isTyping || !connected}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m0 0l-6-6m6 6l-6 6" />
                                    </svg>
                                </Button>
                            </div>
                            <p className="mt-1 text-[11px] text-muted-foreground">Enter to send · Shift + Enter for a new line</p>
                        </form>
                    </Card>
                </div>
            </div>

        </>
    );
}

function ChatBubble({ msg }) {
    const isUser = msg.sender === "user";
    const bubbleStyle = isUser
        ? "bg-muted text-foreground ml-auto"
        : "text-foreground mr-auto";

    const Icon = isUser ? User : Bot;

    return (
        <div className={`flex gap-2 items-start ${isUser ? "justify-end" : "justify-start"}`}>
            {!isUser && <Icon className="w-5 h-5 mt-1 text-muted-foreground" />}
            <div
                className={`max-w-[90%] sm:max-w-[80%] px-4 py-3 rounded-xl text-sm leading-7 whitespace-pre-wrap break-words ${bubbleStyle}`}
            >
                {msg.message}
            </div>
            {isUser && <Icon className="w-5 h-5 mt-1 text-muted-foreground" />}
        </div>
    );
}

function TypingIndicator() {
    return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
            <Bot className="w-4 h-4" />
            <span>AI is typing...</span>
            <Loader2 className="w-4 h-4 animate-spin" />
        </div>
    );
}
