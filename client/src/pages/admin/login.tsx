import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simple authentication check
      if (credentials.email === "admin@mamnon.com" && credentials.password === "admin123") {
        // Set admin token
        localStorage.setItem("admin-token", "admin-logged-in");
        
        toast({
          title: "Đăng nhập thành công",
          description: "Chào mừng quản trị viên!",
        });
        
        // Redirect to dashboard
        setLocation("/admin");
      } else {
        toast({
          title: "Lỗi đăng nhập",
          description: "Email hoặc mật khẩu không đúng",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi đăng nhập",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-600">
            🏫 Admin Panel
          </CardTitle>
          <CardDescription>
            Đăng nhập để quản lý website Mầm Non Thảo Nguyên Xanh
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                placeholder="admin@mamnon.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                placeholder="••••••••"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? "Đang đăng nhập..." : "🔑 Đăng nhập"}
            </Button>
          </form>
          
          <div className="mt-6 p-3 bg-blue-50 rounded-lg text-sm">
            <p className="text-blue-800 font-medium">Thông tin đăng nhập:</p>
            <p className="text-blue-600">Email: admin@mamnon.com</p>
            <p className="text-blue-600">Mật khẩu: admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}