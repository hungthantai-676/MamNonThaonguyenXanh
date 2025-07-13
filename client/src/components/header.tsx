import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const navigation = [
  { name: "Trang chủ", href: "/" },
  { name: "Giới thiệu", href: "/about" },
  { name: "Chương trình học", href: "/programs" },
  { name: "Hoạt động", href: "/activities" },
  { name: "Thư viện phụ huynh", href: "/parents" },
  { name: "Tuyển sinh", href: "/admission" },
  { name: "Tin tức", href: "/news" },
  { name: "Liên hệ", href: "/contact" },
  { name: "Test", href: "/test" },
  { name: "Quản trị", href: "/admin/login" },
];

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <img 
                src="/images/logo.png" 
                alt="Mầm Non Thảo Nguyên Xanh Logo" 
                className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <h1 className="font-bold text-xl text-dark-gray">Mầm Non Thảo Nguyên Xanh</h1>
              <p className="text-sm text-gray-600">Giáo dục bằng trái tim</p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-dark-gray hover:text-primary-green transition-colors font-medium",
                  location === item.href && "text-primary-green",
                  item.name === "Quản trị" && "bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600",
                  item.name === "Test" && "bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                )}
              >
                {item.name === "Quản trị" ? "🔧 Quản trị" : item.name === "Test" ? "🔍 Test" : item.name}
              </Link>
            ))}

          </nav>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "text-dark-gray hover:text-primary-green transition-colors font-medium py-2",
                      location === item.href && "text-primary-green",
                      item.name === "Quản trị" && "bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600",
                      item.name === "Test" && "bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name === "Quản trị" ? "🔧 Quản trị" : item.name === "Test" ? "🔍 Test" : item.name}
                  </Link>
                ))}

              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
