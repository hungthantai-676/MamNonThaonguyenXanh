import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import About from "@/pages/about";
import Programs from "@/pages/programs";
import Activities from "@/pages/activities";
import Parents from "@/pages/parents";
import Admission from "@/pages/admission";
import News from "@/pages/news";
import NewsDetail from "@/pages/news-detail";
import NewsDetailTest from "@/pages/news-detail-test";
import Test from "@/pages/test";
import Contact from "@/pages/contact";
import Affiliate from "@/pages/affiliate";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminAccess from "@/pages/admin-access";
import AdminQuick from "@/pages/admin-quick";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Chatbot from "@/components/chatbot";
import { useState } from "react";
import { Bot, X } from "lucide-react";

function Router() {
  const [chatOpen, setChatOpen] = useState(false);

  const toggleChat = () => {
    console.log("Inline chatbot clicked!");
    setChatOpen(!chatOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/programs" component={Programs} />
          <Route path="/activities" component={Activities} />
          <Route path="/parents" component={Parents} />
          <Route path="/admission" component={Admission} />
          <Route path="/news" component={News} />
          <Route path="/news/:id" component={NewsDetail} />
          <Route path="/contact" component={Contact} />
          <Route path="/affiliate" component={Affiliate} />
          <Route path="/admin-access" component={AdminAccess} />
          <Route path="/admin-quick" component={AdminQuick} />
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route path="/test" component={Test} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      
      {/* AI Chatbot */}
      <Chatbot />
      
      {/* Inline Test Chatbot */}
      <div className="fixed right-6 z-[9999]" style={{ top: '50vh' }}>
        <button
          onClick={toggleChat}
          className="bg-red-500 hover:bg-red-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center cursor-pointer"
        >
          <Bot className="w-8 h-8" />
        </button>
        {chatOpen && (
          <div className="absolute top-0 right-20 bg-white shadow-lg rounded-lg p-4 w-80">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Test Chatbot</h3>
              <button onClick={toggleChat} className="text-gray-500 hover:text-gray-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-700">
              Chatbot test hoạt động! Click X để đóng.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
