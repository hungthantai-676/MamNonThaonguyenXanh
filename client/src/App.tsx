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
import Contact from "@/pages/contact";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import Header from "@/components/header";
import Footer from "@/components/footer";

function Router() {
  return (
    <Switch>
      {/* Admin routes without header/footer */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      
      {/* Main site routes with header/footer */}
      <Route>
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
              <Route path="/contact" component={Contact} />
              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />
          
          {/* Chat Widget */}
          <div className="fixed bottom-6 right-6 z-50">
            <div className="bg-primary-green hover:bg-primary-green/90 text-white w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all hover:scale-110">
              <i className="fas fa-comments text-xl"></i>
            </div>
          </div>
        </div>
      </Route>
    </Switch>
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
