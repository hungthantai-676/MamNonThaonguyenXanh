import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function Test() {
  const [count, setCount] = useState(0);
  
  const testAlert = () => {
    console.log('Alert button clicked!');
    alert('JavaScript is working!');
  };
  
  const testConsole = () => {
    console.log('Console button clicked!');
    console.log('Console log working!');
  };
  
  const handleIncrement = () => {
    console.log('Increment button clicked!');
    setCount(prev => prev + 1);
  };
  
  const handleReset = () => {
    console.log('Reset button clicked!');
    setCount(0);
  };
  
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">JavaScript Test Page</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Counter Test</h2>
            <p className="text-lg">Count: {count}</p>
            <Button onClick={handleIncrement} className="mr-4">
              Increment
            </Button>
            <Button onClick={handleReset} variant="outline">
              Reset
            </Button>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Alert Test</h2>
            <Button onClick={testAlert} className="mr-4">
              Test Alert
            </Button>
            <Button onClick={testConsole} variant="outline">
              Test Console
            </Button>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Navigation Test</h2>
            <Link href="/news">
              <Button variant="outline">Go to News</Button>
            </Link>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Direct Navigation Test</h2>
            <button 
              onClick={() => {
                console.log('Direct navigation button clicked!');
                window.location.href = '/news';
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Direct Navigation to News
            </button>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Raw HTML Test</h2>
            <button 
              onclick="alert('Raw HTML onclick works!')"
              className="bg-red-500 text-white px-4 py-2 rounded mr-4"
            >
              Raw HTML onclick
            </button>
            <div 
              onclick="console.log('Raw div clicked!')"
              className="inline-block bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
            >
              Raw HTML div click
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}