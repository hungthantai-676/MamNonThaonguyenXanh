import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminAccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary-green">
            🔧 Truy cập Admin
          </CardTitle>
          <CardDescription>
            Trang quản trị Mầm Non Thảo Nguyên Xanh
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-gray-600">
            <p className="mb-2">Thông tin đăng nhập:</p>
            <div className="bg-gray-100 p-3 rounded">
              <p><strong>Tên đăng nhập:</strong> admin</p>
              <p><strong>Mật khẩu:</strong> admin123</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Link href="/admin/login" className="w-full">
              <Button className="w-full bg-primary-green hover:bg-green-600">
                🔓 Đăng nhập Admin
              </Button>
            </Link>
            
            <Link href="/admin/dashboard" className="w-full">
              <Button variant="outline" className="w-full">
                📊 Truy cập Dashboard trực tiếp
              </Button>
            </Link>
            
            <Link href="/" className="w-full">
              <Button variant="ghost" className="w-full">
                🏠 Về trang chủ
              </Button>
            </Link>
          </div>
          
          <div className="text-xs text-gray-500 text-center">
            <p>Nếu gặp vấn đề, hãy liên hệ hỗ trợ kỹ thuật</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}