'use client'

import { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { connectSocket } from "@/lib/socket";
import toast from "react-hot-toast";
import { Loader2, Bot, User } from "lucide-react";



import { getUserConversations } from "@/services/conversationAPI";
import { useQuery } from "@tanstack/react-query";
import { ConversationList } from "@/components/ConversationList";



export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
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

        if (
            !selectedConversation ||
            !socketRef.current ||
            !socketRef.current.connected
        ) {
            return;
        }

        selectedConversationRef.current = selectedConversation;

        console.log("Selected conversation changed:", selectedConversation);


        if (selectedConversation?._id === "new") {
            console.log("New conversation selected, clearing messages.");
            setMessages([]);
            return;
        }

        setMessages([]);

        // console.log("Requesting chat history for conversation ID:", selectedConversation._id);

        socketRef.current.emit("get-chat-history", {
            conversationId: selectedConversation._id
        });
    }, [selectedConversation]);



    useEffect(() => {
        const setup = async () => {
            try {
                const socketInstance = await connectSocket((socket) => {
                    socketRef.current = socket;
                });

                console.log("Socket instance:", socketInstance);

                if (!socketInstance) return;

                socketInstance.on("new-message", async (payload) => {
                    const currentConversation = selectedConversationRef.current

                    console.log("Received new message:", payload);
                    console.log("Current conversation ID:", currentConversation?._id);
                    console.log("Payload conversation ID:", payload.conversationId);

                    if (!currentConversation?._id) {
                        toast.error("No active conversation selected");
                        return;
                    }

                    if (
                        currentConversation._id === 'new' &&
                        payload.conversationId &&
                        currentConversation._id !== payload.conversationId
                    ) {
                        await refetch();
                        setSelectedConversation({ _id: payload.conversationId });
                    }
                    setMessages((prev) => [...prev, payload]);
                });


                socketInstance.on("ai-typing", setIsTyping);
                socketInstance.on("chat-history", (history) => {
                    console.log("Receved chiat history:", history);
                    setMessages(history);
                });

                socketInstance.on("error-message", (msg) =>
                    toast({
                        title: "Error",
                        description: msg,
                        variant: "destructive",
                    })
                );
            } catch (error) {
                console.error("❌ Error during socket setup:", error.message);
            }
        };

        setup();
    }, []);




    useEffect(() => {
        if (!viewportRef.current) return;
        viewportRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages, isTyping]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = {
            sender: "user",
            message: input,
            timestamp: new Date().toISOString(),
        };

        // console.log("Sending message:", userMsg);

        setMessages((prev) => [...prev, userMsg]);
        setInput("");

        console.log("Sending message via socket:", input);
        console.log("Selected conversation ID:", selectedConversation?._id);

        if (socketRef.current) {
            socketRef.current.emit("send-message", { message: input, conversationId: selectedConversation._id });
            console.log("conversationId:", selectedConversation._id);
        } else {
            toast({ title: "Not connected", description: "Socket not ready." });
        }
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
                <p className="text-red-500">Error loading conversations: {error.message}</p>
            </div>
        )
    }





    return (
        <>
        

            <main className="flex-1 flex bg-muted px-2 sm:px-6 py-4 overflow-hidden">
                <div className="border-r w-full sm:w-[350px] p-2">
                    <h3 className="text-lg font-semibold mb-2">Conversations</h3>
                    <ConversationList
                        conversations={conversations}
                        isLoading={isLoading}
                        onSelect={(conv) => setSelectedConversation(conv || { _id: "new" })}
                        selectedId={selectedConversation?._id}
                    />
                </div>

                <div className="flex-1 flex justify-center items-center px-4">
                    <Card className="w-full max-w-2xl h-[85vh] flex flex-col shadow-xl rounded-2xl overflow-hidden">
                        <ScrollArea className="flex-1 px-4 py-2 overflow-y-auto" ref={scrollAreaRef}>
                            <div ref={viewportRef} className="space-y-4">
                                {messages.map((msg, index) => (
                                    <ChatBubble key={index} msg={msg} />
                                ))}
                                {isTyping && <TypingIndicator />}
                            </div>
                        </ScrollArea>

                        <form onSubmit={handleSend} className="p-4 border-t bg-background">
                            <div className="flex gap-2 items-end">
                                <Textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your message..."
                                    rows={2}
                                    className="flex-1 resize-none rounded-xl text-sm"
                                />
                                <Button type="submit" size="icon" className="rounded-full">
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
                        </form>
                    </Card>
                </div>
            </main>

        </>
    );
}

function ChatBubble({ msg }) {
    const isUser = msg.sender === "user";
    const bubbleStyle = isUser
        ? "bg-primary text-primary-foreground ml-auto"
        : "bg-muted text-muted-foreground mr-auto";

    const Icon = isUser ? User : Bot;

    return (
        <div className={`flex gap-2 items-start ${isUser ? "justify-end" : "justify-start"}`}>
            {!isUser && <Icon className="w-5 h-5 mt-1 text-muted-foreground" />}
            <div
                className={`max-w-[75%] px-4 py-2 rounded-xl text-sm whitespace-pre-wrap ${bubbleStyle}`}
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
