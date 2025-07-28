import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Copy, Download, Share2, QrCode, Link, Users, DollarSign, TreePine, 
  CreditCard, History, Wallet, TrendingUp, Eye, EyeOff, CheckCircle2, AlertCircle 
} from "lucide-react";
import QRCodeLib from "qrcode";

export default function AffiliateMemberFull() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentMember, setCurrentMember] = useState<any>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [showBalanceDetails, setShowBalanceDetails] = useState(false);

  // Get member data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('affiliate-user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentMember(user);
        
        // Generate QR code for referral link
        if (user.memberId) {
          const referralLink = `${window.location.origin}/affiliate/join?ref=${user.memberId}`;
          QRCodeLib.toDataURL(referralLink, { width: 256, margin: 2 })
            .then(setQrCodeDataUrl)
            .catch(console.error);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Fetch member tree data
  const { data: treeData } = useQuery({
    queryKey: ['/api/affiliate/tree', currentMember?.memberId],
    enabled: !!currentMember?.memberId,
  });

  // Fetch member transactions
  const { data: transactions = [] } = useQuery({
    queryKey: ['/api/affiliate/transactions', currentMember?.memberId],
    enabled: !!currentMember?.memberId,
  });

  // Fetch member rewards/earnings
  const { data: rewards = [] } = useQuery({
    queryKey: ['/api/affiliate/rewards', currentMember?.memberId],
    enabled: !!currentMember?.memberId,
  });

  // Request payment mutation
  const requestPaymentMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await apiRequest("POST", "/api/affiliate/payment-request", {
        memberId: currentMember.memberId,
        amount: amount,
        note: `Yêu cầu thanh toán từ ${currentMember.name}`,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Yêu cầu thanh toán thành công!",
        description: "Admin sẽ xử lý yêu cầu của bạn trong 24-48 giờ.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/affiliate/transactions'] });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi yêu cầu thanh toán",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Đã sao chép!",
        description: `${type} đã được sao chép vào clipboard`,
      });
    });
  };

  const downloadQRCode = () => {
    if (!qrCodeDataUrl || !currentMember) return;
    
    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = `QR-${currentMember.name.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Tải xuống thành công!",
      description: "QR Code đã được tải về máy",
    });
  };

  const shareReferralLink = () => {
    if (!currentMember) return;
    
    const referralLink = `${window.location.origin}/affiliate/join?ref=${currentMember.memberId}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Tham gia Mầm Non Thảo Nguyên Xanh',
        text: 'Hãy tham gia cùng tôi tại Mầm Non Thảo Nguyên Xanh!',
        url: referralLink,
      });
    } else {
      copyToClipboard(referralLink, "Link giới thiệu");
    }
  };

  const handlePaymentRequest = () => {
    const currentBalance = parseFloat(currentMember?.tokenBalance || "0");
    if (currentBalance < 100000) { // Minimum 100k VND
      toast({
        title: "Số dư không đủ",
        description: "Số dư tối thiểu để yêu cầu thanh toán là 100,000 VND",
        variant: "destructive",
      });
      return;
    }
    
    requestPaymentMutation.mutate(currentBalance);
  };

  if (!currentMember) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-lg">Đang tải thông tin thành viên...</p>
              <p className="text-sm text-muted-foreground mt-2">
                Nếu bạn chưa đăng nhập, vui lòng <a href="/affiliate/register" className="text-blue-600 underline">đăng ký tài khoản</a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const referralLink = `${window.location.origin}/affiliate/join?ref=${currentMember.memberId}`;
  const currentBalance = parseFloat(currentMember?.tokenBalance || "0");
  const totalEarnings = rewards.reduce((sum: number, reward: any) => sum + parseFloat(reward.amount || 0), 0);
  
  // Calculate F1, F2, F3 statistics
  const f1Count = treeData?.children?.length || 0;
  const f2Count = treeData?.children?.reduce((sum: number, child: any) => sum + (child.children?.length || 0), 0) || 0;
  const f3Count = treeData?.children?.reduce((sum: number, child: any) => 
    sum + (child.children?.reduce((childSum: number, grandChild: any) => childSum + (grandChild.children?.length || 0), 0) || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">🎯 Dashboard Affiliate</CardTitle>
            <CardDescription className="text-green-100">
              Chào mừng, <strong>{currentMember.name}</strong> ({currentMember.memberId})
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="tree">Sơ đồ cây</TabsTrigger>
            <TabsTrigger value="earnings">Thu nhập</TabsTrigger>
            <TabsTrigger value="transactions">Giao dịch</TabsTrigger>
            <TabsTrigger value="tools">Công cụ</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            
            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Số dư ví</p>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold">
                          {showBalanceDetails ? `${currentBalance.toLocaleString()} VND` : "••••••"}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowBalanceDetails(!showBalanceDetails)}
                          className="text-white hover:bg-green-700"
                        >
                          {showBalanceDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <Wallet className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">F1 (Trực tiếp)</p>
                      <p className="text-2xl font-bold text-blue-600">{f1Count}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">F2 (Cấp 2)</p>
                      <p className="text-2xl font-bold text-purple-600">{f2Count}</p>
                    </div>
                    <TreePine className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">F3 (Cấp 3)</p>
                      <p className="text-2xl font-bold text-orange-600">{f3Count}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Request Button */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Yêu cầu thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Số dư khả dụng: <span className="font-semibold">{currentBalance.toLocaleString()} VND</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Số tiền tối thiểu để yêu cầu thanh toán: 100,000 VND
                    </p>
                  </div>
                  <Button 
                    onClick={handlePaymentRequest}
                    disabled={currentBalance < 100000 || requestPaymentMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {requestPaymentMutation.isPending ? "Đang xử lý..." : "Yêu cầu thanh toán"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Member Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Thông tin thành viên
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Tên:</strong> {currentMember.name}</div>
                  <div>
                    <strong>Loại:</strong> 
                    <Badge variant="secondary" className="ml-2">
                      {currentMember.memberType === 'teacher' ? 'Giáo viên' : 'Phụ huynh'}
                    </Badge>
                  </div>
                  <div><strong>Email:</strong> {currentMember.email}</div>
                  <div><strong>SĐT:</strong> {currentMember.phone}</div>
                  <div className="col-span-2">
                    <strong>Mã thành viên:</strong> 
                    <code className="bg-gray-100 px-2 py-1 rounded ml-2">{currentMember.memberId}</code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tree Diagram Tab */}
          <TabsContent value="tree" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TreePine className="h-5 w-5" />
                  Sơ đồ cây thành viên
                </CardTitle>
              </CardHeader>
              <CardContent>
                {f1Count > 0 ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="inline-block bg-green-100 border-2 border-green-500 rounded-lg p-4">
                        <div className="font-semibold text-green-800">{currentMember.name}</div>
                        <div className="text-sm text-green-600">({currentMember.memberId})</div>
                      </div>
                    </div>
                    
                    {/* F1 Members */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {treeData?.children?.map((f1: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4 bg-blue-50">
                          <div className="font-semibold text-blue-800">F1: {f1.name}</div>
                          <div className="text-sm text-blue-600">{f1.memberId}</div>
                          <div className="text-xs text-muted-foreground">
                            F2 trực thuộc: {f1.children?.length || 0}
                          </div>
                          
                          {/* F2 Members */}
                          {f1.children && f1.children.length > 0 && (
                            <div className="mt-2 pl-4 border-l-2 border-purple-200">
                              {f1.children.map((f2: any, f2Index: number) => (
                                <div key={f2Index} className="text-xs text-purple-600 mb-1">
                                  F2: {f2.name} ({f2.memberId})
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <TreePine className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>Chưa có thành viên trực thuộc</p>
                    <p className="text-sm">Chia sẻ link giới thiệu để xây dựng đội nhóm</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Thống kê thu nhập
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{totalEarnings.toLocaleString()} VND</div>
                    <div className="text-sm text-muted-foreground">Tổng thu nhập</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{currentBalance.toLocaleString()} VND</div>
                    <div className="text-sm text-muted-foreground">Số dư hiện tại</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {(totalEarnings - currentBalance).toLocaleString()} VND
                    </div>
                    <div className="text-sm text-muted-foreground">Đã thanh toán</div>
                  </div>
                </div>

                {/* Recent Rewards */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Thu nhập gần đây</h4>
                  {rewards.length > 0 ? (
                    rewards.slice(0, 5).map((reward: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{reward.description || reward.type}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(reward.createdAt).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                        <div className="font-semibold text-green-600">
                          +{parseFloat(reward.amount).toLocaleString()} VND
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">Chưa có thu nhập nào</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Lịch sử giao dịch
                </CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length > 0 ? (
                  <div className="space-y-3">
                    {transactions.map((transaction: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            transaction.type === 'reward' ? 'bg-green-100' :
                            transaction.type === 'payment' ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                            {transaction.type === 'reward' ? 
                              <DollarSign className="h-4 w-4 text-green-600" /> :
                              <CreditCard className="h-4 w-4 text-blue-600" />
                            }
                          </div>
                          <div>
                            <div className="font-medium">{transaction.description}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(transaction.createdAt).toLocaleDateString('vi-VN')}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold ${
                            transaction.type === 'reward' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'reward' ? '+' : '-'}{parseFloat(transaction.amount).toLocaleString()} VND
                          </div>
                          <Badge variant={
                            transaction.status === 'completed' ? 'default' :
                            transaction.status === 'pending' ? 'secondary' : 'destructive'
                          } className="text-xs">
                            {transaction.status === 'completed' ? 'Hoàn thành' :
                             transaction.status === 'pending' ? 'Đang xử lý' : 'Thất bại'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>Chưa có giao dịch nào</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* QR Code */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
                    QR Code Giới Thiệu
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  {qrCodeDataUrl ? (
                    <div>
                      <img 
                        src={qrCodeDataUrl} 
                        alt="QR Code" 
                        className="w-48 h-48 mx-auto border rounded-lg shadow-sm"
                      />
                      <div className="flex gap-2 mt-4">
                        <Button onClick={downloadQRCode} variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Tải xuống
                        </Button>
                        <Button onClick={shareReferralLink} variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          Chia sẻ
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-sm text-gray-500">Đang tạo QR Code...</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Referral Link */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link className="h-5 w-5" />
                    Link Giới Thiệu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={referralLink}
                        readOnly 
                        className="flex-1 px-3 py-2 border rounded-md bg-gray-50 text-sm"
                      />
                      <Button onClick={() => copyToClipboard(referralLink, "Link giới thiệu")}>
                        <Copy className="h-4 w-4 mr-2" />
                        Sao chép
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Chia sẻ link này để mời người khác tham gia và nhận thưởng
                    </p>

                    {/* Program Information */}
                    <div className="space-y-3 mt-6">
                      <h4 className="font-semibold">🎁 Chương trình thưởng</h4>
                      {currentMember.memberType === 'teacher' ? (
                        <ul className="space-y-1 text-sm">
                          <li>✅ <strong>2,000,000 VND</strong> cho mỗi phụ huynh đăng ký thành công</li>
                          <li>🎯 <strong>10,000,000 VND</strong> thưởng mỗi khi tuyển được 5 phụ huynh</li>
                          <li>📈 Hoa hồng từ F2, F3 theo cấu trúc đa cấp</li>
                        </ul>
                      ) : (
                        <ul className="space-y-1 text-sm">
                          <li>✅ <strong>2,000 điểm</strong> cho mỗi phụ huynh giới thiệu thành công</li>
                          <li>🎯 <strong>10,000 điểm</strong> thưởng mỗi khi giới thiệu được 5 phụ huynh</li>
                          <li>🔄 Điểm có thể đổi thành tiền mặt hoặc giảm giá học phí</li>
                        </ul>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}