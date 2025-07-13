import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function Test() {
  const [count, setCount] = useState(0);
  
  const testAlert = () => {
    alert('JavaScript is working!');
  };
  
  const testConsole = () => {
    console.log('Console log working!');
  };
  
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">JavaScript Test Page</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Counter Test</h2>
            <p className="text-lg">Count: {count}</p>
            <Button onClick={() => setCount(count + 1)} className="mr-4">
              Increment
            </Button>
            <Button onClick={() => setCount(0)} variant="outline">
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
              onClick={() => window.location.href = '/news'}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Direct Navigation to News
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}