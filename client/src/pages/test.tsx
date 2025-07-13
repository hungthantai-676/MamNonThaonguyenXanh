import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function Test() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('Chưa có thao tác nào');
  
  const updateMessage = (text: string) => {
    setMessage(`${new Date().toLocaleTimeString()}: ${text}`);
  };
  
  const testAlert = () => {
    updateMessage('Popup alert hoạt động!');
    alert('JavaScript hoạt động tốt!');
  };
  
  const handleIncrement = () => {
    updateMessage('Tăng số thành công!');
    setCount(prev => prev + 1);
  };
  
  const handleReset = () => {
    updateMessage('Reset thành công!');
    setCount(0);
  };
  
  const testNewsNavigation = () => {
    updateMessage('Chuyển đến trang tin tức...');
    window.location.href = '/news';
  };
  
  const testNewsDetail = () => {
    updateMessage('Chuyển đến chi tiết tin tức...');
    window.location.href = '/news/2';
  };
  
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">🔍 Kiểm tra Website</h1>
        
        <div className="space-y-8">
          {/* Status Message */}
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <h3 className="font-semibold mb-2">Trạng thái:</h3>
            <p className="text-lg">{message}</p>
          </div>
          
          {/* Test Buttons */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">1. Kiểm tra JavaScript</h2>
                <p className="text-lg mb-4">Số đếm: <span className="font-bold text-green-600">{count}</span></p>
                <div className="space-x-4">
                  <Button onClick={handleIncrement} className="bg-green-500 hover:bg-green-600 text-white">
                    ➕ Tăng số
                  </Button>
                  <Button onClick={handleReset} className="bg-red-500 hover:bg-red-600 text-white">
                    🔄 Reset
                  </Button>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">2. Kiểm tra Popup</h2>
                <Button onClick={testAlert} className="bg-yellow-500 hover:bg-yellow-600 text-white">
                  ⚠️ Hiện thông báo
                </Button>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">3. Kiểm tra Navigation</h2>
                <div className="space-y-4">
                  <Button onClick={testNewsNavigation} className="bg-blue-500 hover:bg-blue-600 text-white w-full">
                    📰 Đi đến Tin tức
                  </Button>
                  <Button onClick={testNewsDetail} className="bg-purple-500 hover:bg-purple-600 text-white w-full">
                    📄 Đi đến Chi tiết tin tức
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">4. Kiểm tra Link</h2>
                <Link href="/news">
                  <Button className="bg-gray-600 hover:bg-gray-700 text-white w-full">
                    🔗 Link Component Test
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-4 text-xl">📋 Hướng dẫn kiểm tra:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="space-y-2">
                <li>✅ Click "Tăng số" - số đếm phải tăng</li>
                <li>✅ Click "Hiện thông báo" - phải có popup</li>
              </ul>
              <ul className="space-y-2">
                <li>✅ Click "Đi đến Tin tức" - phải chuyển trang</li>
                <li>✅ Click "Link Component Test" - phải vào tin tức</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}