import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function Test() {
  const [count, setCount] = useState(0);
  const [clickResults, setClickResults] = useState<string[]>([]);
  
  const addResult = (message: string) => {
    setClickResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };
  
  const testAlert = () => {
    addResult('Alert button clicked!');
    alert('JavaScript is working!');
  };
  
  const testConsole = () => {
    addResult('Console button clicked!');
    console.log('Console log working!');
  };
  
  const handleIncrement = () => {
    addResult('Increment button clicked!');
    setCount(prev => prev + 1);
  };
  
  const handleReset = () => {
    addResult('Reset button clicked!');
    setCount(0);
  };
  
  const testNewsNavigation = () => {
    addResult('News navigation button clicked!');
    window.location.href = '/news';
  };
  
  const testNewsDetail = () => {
    addResult('News detail navigation button clicked!');
    window.location.href = '/news/2';
  };
  
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Kiểm tra chức năng Website</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">1. Kiểm tra JavaScript</h2>
              <p className="text-lg mb-4">Số đếm: {count}</p>
              <div className="space-x-4">
                <Button onClick={handleIncrement} className="bg-green-500 hover:bg-green-600">
                  Tăng số
                </Button>
                <Button onClick={handleReset} variant="outline">
                  Reset
                </Button>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">2. Kiểm tra Alert</h2>
              <Button onClick={testAlert} className="bg-yellow-500 hover:bg-yellow-600">
                Hiện thông báo
              </Button>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">3. Kiểm tra Navigation</h2>
              <div className="space-y-2">
                <div>
                  <Button onClick={testNewsNavigation} className="bg-blue-500 hover:bg-blue-600 mr-4">
                    Đi đến Tin tức
                  </Button>
                </div>
                <div>
                  <Button onClick={testNewsDetail} className="bg-purple-500 hover:bg-purple-600">
                    Đi đến Chi tiết tin tức
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">4. Kiểm tra Link Component</h2>
              <Link href="/news">
                <Button variant="outline" className="border-2 border-blue-500 text-blue-500 hover:bg-blue-50">
                  Link Component Test
                </Button>
              </Link>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Kết quả Test</h2>
            <div className="bg-gray-100 p-4 rounded-lg min-h-[400px]">
              <h3 className="font-semibold mb-2">Lịch sử click:</h3>
              {clickResults.length === 0 ? (
                <p className="text-gray-500">Chưa có thao tác nào</p>
              ) : (
                <ul className="space-y-1">
                  {clickResults.map((result, index) => (
                    <li key={index} className="text-sm bg-white p-2 rounded">
                      {result}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">Hướng dẫn kiểm tra:</h3>
              <ul className="text-sm space-y-1">
                <li>1. Click "Tăng số" - số đếm phải tăng</li>
                <li>2. Click "Hiện thông báo" - phải có popup</li>
                <li>3. Click "Đi đến Tin tức" - phải chuyển trang</li>
                <li>4. Click "Đi đến Chi tiết tin tức" - phải vào chi tiết</li>
                <li>5. Tất cả click phải hiện trong "Lịch sử click"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}