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
import TestUsername from "@/pages/test-username";
import Contact from "@/pages/contact";
import AffiliateFixed from "@/pages/affiliate-fixed";
import AffiliateJoin from "@/pages/affiliate-join";
import AffiliateJoinNew from "@/pages/affiliate-join-new";
import AffiliateRegisterSimple from "@/pages/affiliate-register-simple";
import AdminLogin from "@/pages/admin/login";
import AdminDashboardFixed from "@/pages/admin/dashboard-fixed";
import AffiliateDashboard from "@/pages/admin/affiliate-dashboard";
import AffiliateAdmin from "@/pages/admin/affiliate-admin";
import AffiliateTest from "@/pages/affiliate-test";
import AffiliateMemberInfo from "@/pages/affiliate-member-info";
import ContentManagement from "@/pages/admin/content-management";
import FullContentManager from "@/pages/admin/full-content-manager";
import HomepageStructureManager from "@/pages/admin/homepage-structure-manager";
import MainMenuSimple from "@/pages/admin/main-menu-simple";
import AdminAccess from "@/pages/admin-access";
import AdminQuick from "@/pages/admin-quick";
import Header from "@/components/header";
import Footer from "@/components/footer";
import SimpleChatbot from "@/components/chatbot-simple";

function Router() {
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
          <Route path="/affiliate" component={AffiliateFixed} />
          <Route path="/affiliate/join" component={AffiliateRegisterSimple} />
          <Route path="/affiliate/join-old" component={AffiliateJoin} />
          <Route path="/affiliate/test" component={AffiliateTest} />
          <Route path="/affiliate/member" component={AffiliateMemberInfo} />
          <Route path="/admin-access" component={AdminAccess} />
          <Route path="/admin-quick" component={AdminQuick} />
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin/dashboard" component={AdminDashboardFixed} />
          <Route path="/admin/affiliate-old" component={AffiliateDashboard} />
          <Route path="/admin/affiliate" component={AffiliateAdmin} />
          <Route path="/admin/content" component={ContentManagement} />
          <Route path="/admin/full-content" component={FullContentManager} />
          <Route path="/admin/homepage" component={HomepageStructureManager} />
          <Route path="/admin/main-menu" component={MainMenuSimple} />
          <Route path="/test" component={Test} />
          <Route path="/test-username" component={TestUsername} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      
      {/* AI Chatbot */}
      <SimpleChatbot />
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
