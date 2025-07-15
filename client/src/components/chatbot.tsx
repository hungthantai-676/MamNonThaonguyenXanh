import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Bot, X, Send, User } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  isTyping?: boolean;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Xin chào! Tôi là trợ lý AI của Mầm Non Thảo Nguyên Xanh. Tôi có thể giúp bạn:\n\n• Tư vấn về chương trình học\n• Thông tin tuyển sinh\n• Học phí và lịch học\n• Hoạt động ngoại khóa\n• Thủ tục nhập học\n\nBạn có câu hỏi gì không?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [quickReplies, setQuickReplies] = useState<string[]>([
    "Học phí các lớp như thế nào?",
    "Thủ tục tuyển sinh năm học 2024-2025",
    "Chương trình học có gì đặc biệt?",
    "Thông tin liên hệ trường",
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chatbot", { message });
      return response as { response: string; quickReplies: string[] };
    },
    onSuccess: (data) => {
      setMessages(prev => prev.filter(msg => msg.id !== "typing"));
      
      const botMessage: Message = {
        id: Date.now().toString(),
        text: data.response,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      
      if (data.quickReplies) {
        setQuickReplies(data.quickReplies);
      }
    },
    onError: (error) => {
      console.error("Chat error:", error);
      setMessages(prev => prev.filter(msg => msg.id !== "typing"));
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    },
  });

  const handleSendMessage = () => {
    const message = inputValue.trim();
    if (!message) return;
    
    console.log("Sending message:", message);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    const typingMessage: Message = {
      id: "typing",
      text: "Đang trả lời...",
      sender: "bot",
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages(prev => [...prev, typingMessage]);

    chatMutation.mutate(message);
  };

  const handleQuickReply = (reply: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: reply,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    const typingMessage: Message = {
      id: "typing",
      text: "Đang trả lời...",
      sender: "bot",
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages(prev => [...prev, typingMessage]);

    chatMutation.mutate(reply);
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

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed right-6 z-[9999]" style={{ top: '66.67vh' }}>
      {!isOpen ? (
        <div className="relative">
          <button
            onClick={toggleChat}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white w-16 h-16 rounded-full shadow-lg transition-all hover:scale-110 flex items-center justify-center cursor-pointer"
          >
            <Bot className="w-8 h-8" />
          </button>
          <div className="absolute -top-12 -left-32 bg-white shadow-lg rounded-lg p-3 max-w-xs animate-pulse pointer-events-none">
            <p className="text-sm text-gray-700 font-medium">
              🤖 Trợ lý AI Mầm Non Thảo Nguyên Xanh
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Tư vấn miễn phí 24/7
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-2xl w-96 h-[500px] flex flex-col" style={{ pointerEvents: 'all' }}>
          <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <h3 className="font-semibold">Trợ lý AI Mầm Non</h3>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:bg-white/20 p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                      ? "bg-green-500 text-white"
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
                            Đang trả lời...
                          </span>
                        ) : (
                          message.text
                        )}
                      </p>
                      <p className="text-xs opacity-70 mt-1">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-4 py-2 border-t bg-gray-50">
            <div className="flex flex-wrap gap-2">
              {quickReplies.slice(0, 3).map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply(reply)}
                  className="text-xs bg-white hover:bg-green-500 hover:text-white transition-colors px-3 py-1 rounded-full border border-gray-200"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t bg-white">
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  console.log("Input changed:", e.target.value);
                  setInputValue(e.target.value);
                }}
                onFocus={() => console.log("Input focused")}
                placeholder="Nhập câu hỏi của bạn..."
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                autoFocus
                style={{ pointerEvents: 'auto' }}
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}