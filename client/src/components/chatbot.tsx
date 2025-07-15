import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bot, X } from "lucide-react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    console.log("Chatbot toggle clicked!", isOpen);
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed right-6 z-[9999] bg-red-500 p-2" style={{ top: '66.67vh' }}>
      {!isOpen ? (
        <div className="relative bg-yellow-500 p-2">
          <button
            onClick={toggleChat}
            onMouseEnter={() => console.log("Mouse entered chatbot button")}
            onMouseLeave={() => console.log("Mouse left chatbot button")}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white w-16 h-16 rounded-full shadow-lg transition-all hover:scale-110 flex items-center justify-center cursor-pointer"
            style={{ pointerEvents: 'all' }}
          >
            <Bot className="w-8 h-8" />
          </button>
          <div className="absolute -top-12 right-0 bg-white shadow-lg rounded-lg p-3 max-w-xs">
            <p className="text-sm text-gray-700 font-medium">
              🤖 Trợ lý AI Mầm Non Thảo Nguyên Xanh
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Tư vấn miễn phí 24/7
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-2xl w-96 h-[500px] flex flex-col">
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
          <div className="flex-1 p-4 bg-gray-50">
            <div className="bg-white rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-700">
                Xin chào! Tôi là trợ lý AI của Mầm Non Thảo Nguyên Xanh. Tôi có thể giúp bạn:
              </p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>• Tư vấn về chương trình học</li>
                <li>• Thông tin tuyển sinh</li>
                <li>• Học phí và lịch học</li>
                <li>• Hoạt động ngoại khóa</li>
              </ul>
            </div>
            <div className="space-y-2">
              <button className="w-full text-left p-2 bg-green-50 hover:bg-green-100 rounded-lg text-sm">
                Học phí các lớp như thế nào?
              </button>
              <button className="w-full text-left p-2 bg-green-50 hover:bg-green-100 rounded-lg text-sm">
                Thủ tục tuyển sinh năm học 2024-2025
              </button>
              <button className="w-full text-left p-2 bg-green-50 hover:bg-green-100 rounded-lg text-sm">
                Thông tin liên hệ trường
              </button>
            </div>
          </div>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập câu hỏi của bạn..."
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}