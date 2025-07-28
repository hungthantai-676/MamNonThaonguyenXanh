import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestUsername() {
  const [username, setUsername] = useState("");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>TEST USERNAME FIELD</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* TEST 1: Basic Input */}
            <div>
              <Label htmlFor="test1">Test 1: Basic Input</Label>
              <Input id="test1" placeholder="Type here..." />
            </div>

            {/* TEST 2: Username with State */}
            <div className="bg-red-100 p-4 border-4 border-red-500">
              <Label htmlFor="username" className="text-red-800 font-bold text-xl">
                🔴 TÊN ĐĂNG NHẬP (USERNAME)
              </Label>
              <Input 
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập..." 
                className="border-4 border-red-600 bg-white text-lg p-4 mt-2"
                style={{ minHeight: '60px', fontSize: '18px' }}
              />
              <p className="text-sm text-red-800 font-bold mt-2">
                Current value: "{username}"
              </p>
            </div>

            {/* TEST 3: Multiple inputs */}
            <div>
              <Label>Test 3: Name</Label>
              <Input placeholder="Your name..." />
            </div>

            <div>
              <Label>Test 4: Email</Label>
              <Input placeholder="Your email..." />
            </div>

            <Button className="w-full">Submit Test</Button>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}