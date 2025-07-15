import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Minimize2, Maximize2, Send, Bot, User, X } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatbotProps {
  className?: string;
}

export default function Chatbot({ className }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Xin chào! Tôi là trợ lý AI của Mầm Non Thảo Nguyên Xanh. Tôi có thể giúp bạn:\n\n• Tư vấn về chương trình học\n• Thông tin tuyển sinh\n• Học phí và lịch học\n• Hoạt động ngoại khóa\n• Thủ tục nhập học\n\nBạn có câu hỏi gì không?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chatbot", { message });
      return response;
    },
    onSuccess: (data) => {
      setIsTyping(false);
      const botMessage: Message = {
        id: Date.now().toString(),
        text: data.response,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages(prev => prev.filter(msg => !msg.isTyping).concat(botMessage));
    },
    onError: (error) => {
      setIsTyping(false);
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau hoặc liên hệ trực tiếp qua hotline: 0856318686",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages(prev => prev.filter(msg => !msg.isTyping).concat(errorMessage));
    },
  });

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: "typing",
      text: "Đang trả lời...",
      sender: "bot",
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages(prev => [...prev, typingMessage]);

    chatMutation.mutate(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) {
    return (
      <div className={`fixed right-6 z-50 ${className}`} style={{ top: '66.67vh' }}>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-primary-green to-secondary-blue hover:from-primary-green/90 hover:to-secondary-blue/90 text-white w-16 h-16 rounded-full shadow-lg transition-all hover:scale-110 flex items-center justify-center"
        >
          <Bot className="w-8 h-8" />
        </Button>
        <div className="absolute -top-12 right-0 bg-white shadow-lg rounded-lg p-3 max-w-xs animate-pulse">
          <p className="text-sm text-gray-700 font-medium">
            🤖 Trợ lý AI Mầm Non Thảo Nguyên Xanh
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Tư vấn miễn phí 24/7
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed right-6 z-50 ${className}`} style={{ top: '66.67vh' }}>
      <Card className={`transition-all duration-300 shadow-2xl ${
        isMinimized ? "w-80 h-16" : "w-96 h-[500px]"
      }`}>
        <CardHeader className="pb-3 bg-gradient-to-r from-primary-green to-secondary-blue text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Trợ lý AI Mầm Non
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Online
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 h-full flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-4 py-2 ${
                        message.sender === "user"
                          ? "bg-primary-green text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.sender === "bot" && (
                          <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        )}
                        {message.sender === "user" && (
                          <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm whitespace-pre-line">
                            {message.isTyping ? (
                              <span className="animate-pulse">
                                {message.text}
                              </span>
                            ) : (
                              message.text
                            )}
                          </p>
                          <p className={`text-xs mt-1 ${
                            message.sender === "user" ? "text-green-100" : "text-gray-500"
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập câu hỏi của bạn..."
                  disabled={isTyping}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-primary-green hover:bg-primary-green/90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => setInputValue("Học phí các lớp như thế nào?")}
                  className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full text-gray-700"
                >
                  Học phí
                </button>
                <button
                  onClick={() => setInputValue("Tuyển sinh năm học 2024-2025")}
                  className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full text-gray-700"
                >
                  Tuyển sinh
                </button>
                <button
                  onClick={() => setInputValue("Chương trình học có gì?")}
                  className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full text-gray-700"
                >
                  Chương trình
                </button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}