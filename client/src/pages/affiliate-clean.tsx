import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { QrCode, UserCheck, Clock, Users, TrendingUp, Wallet, Star, Gift, ArrowDownLeft, ArrowUpRight, Phone, Mail, Eye, EyeOff, Banknote, History } from "lucide-react";
import AffiliateTree from "@/components/affiliate-tree";

// Member list component with enhanced features
const MemberList = () => {
  const [hiddenMembers, setHiddenMembers] = useState<Set<string>>(new Set());
  const [showHidden, setShowHidden] = useState(false);

  const { data: members = [] } = useQuery({
    queryKey: ['/api/affiliate/members'],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const toggleMemberVisibility = (memberId: string) => {
    setHiddenMembers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(memberId)) {
        newSet.delete(memberId);
      } else {
        newSet.add(memberId);
      }
      return newSet;
    });
  };

  const visibleMembers = showHidden 
    ? members 
    : members.filter((member: any) => !hiddenMembers.has(member.memberId));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Users className="w-5 h-5" />
          Danh sách thành viên ({visibleMembers.length})
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHidden(!showHidden)}
          >
            {showHidden ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showHidden ? "Ẩn thành viên bị ẩn" : "Hiện tất cả"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleMembers.map((member: any) => (
          <Card 
            key={member.id} 
            className={`transition-all duration-200 hover:shadow-lg ${
              hiddenMembers.has(member.memberId) ? 'opacity-50' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {member.role === 'teacher' ? '👩‍🏫' : '👨‍👩‍👧‍👦'}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{member.name}</h3>
                    <Badge variant={member.role === 'teacher' ? 'default' : 'secondary'}>
                      {member.role === 'teacher' ? 'Giáo viên' : 'Phụ huynh'}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleMemberVisibility(member.memberId)}
                >
                  {hiddenMembers.has(member.memberId) ? 
                    <EyeOff className="w-4 h-4" /> : 
                    <Eye className="w-4 h-4" />
                  }
                </Button>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-gray-400" />
                  <span className="font-mono text-xs">{member.memberId}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Số dư ví:</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(parseFloat(member.tokenBalance || "0"))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tổng kiếm:</span>
                  <span className="font-medium">
                    {formatCurrency(parseFloat(member.totalEarned || "0"))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {visibleMembers.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có thành viên</h3>
            <p className="text-gray-500">Hệ thống affiliate chưa có thành viên nào tham gia</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Transaction History Component
const TransactionHistory = () => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  
  // Fetch member list for selection
  const { data: members = [] } = useQuery({
    queryKey: ['/api/affiliate/members'],
  });

  // Fetch transaction history for selected member
  const { data: transactionHistory = [], isLoading } = useQuery({
    queryKey: ['/api/member-transaction-history', selectedMemberId],
    enabled: !!selectedMemberId,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'payment_received':
        return <ArrowDownLeft className="w-5 h-5 text-green-600" />;
      case 'commission_earned':
        return <Gift className="w-5 h-5 text-blue-600" />;
      case 'bonus_received':
        return <Star className="w-5 h-5 text-yellow-600" />;
      case 'withdrawal':
        return <ArrowUpRight className="w-5 h-5 text-red-600" />;
      default:
        return <Wallet className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTransactionDescription = (type: string) => {
    switch (type) {
      case 'payment_received':
        return 'Nhận thanh toán';
      case 'commission_earned':
        return 'Hoa hồng giới thiệu';
      case 'bonus_received':
        return 'Thưởng milestone';
      case 'withdrawal':
        return 'Rút tiền';
      default:
        return 'Giao dịch khác';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Lịch sử giao dịch (Sao kê ví)
        </h2>
      </div>

      {/* Member Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Chọn thành viên xem lịch sử</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            {members.map((member: any) => (
              <Button
                key={member.id}
                variant={selectedMemberId === member.memberId ? "default" : "outline"}
                onClick={() => setSelectedMemberId(member.memberId)}
                className="flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                {member.name}
                <Badge variant="secondary" className="ml-2">
                  {formatCurrency(parseFloat(member.tokenBalance || "0"))}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transaction History Display */}
      {selectedMemberId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Sao kê ví điện tử</span>
              <div className="text-sm text-gray-500">
                {members.find((m: any) => m.memberId === selectedMemberId)?.name}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : transactionHistory.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có giao dịch</h3>
                <p className="text-gray-500">Lịch sử giao dịch sẽ hiển thị tại đây khi có hoạt động</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-700 border-b pb-2">
                  <div>Ngày</div>
                  <div>Loại GD</div>
                  <div>Mô tả</div>
                  <div className="text-right">Số tiền</div>
                  <div className="text-right">Số dư trước</div>
                  <div className="text-right">Số dư sau</div>
                </div>
                {transactionHistory.map((transaction: any) => (
                  <div 
                    key={transaction.id} 
                    className="grid grid-cols-6 gap-4 text-sm py-3 border-b border-gray-100 hover:bg-gray-50 rounded-lg px-2"
                  >
                    <div className="text-gray-600">
                      {new Date(transaction.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="flex items-center gap-2">
                      {getTransactionIcon(transaction.type)}
                      <span className="text-xs">{getTransactionDescription(transaction.type)}</span>
                    </div>
                    <div className="text-gray-700">{transaction.description}</div>
                    <div className={`text-right font-medium ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                    </div>
                    <div className="text-right text-gray-600">
                      {formatCurrency(transaction.balanceBefore)}
                    </div>
                    <div className="text-right font-medium">
                      {formatCurrency(transaction.balanceAfter)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Statistics Overview Component
const StatsOverview = () => {
  const { data: members = [] } = useQuery({
    queryKey: ['/api/affiliate/members'],
  });

  const { data: conversions = [] } = useQuery({
    queryKey: ['/api/customer-conversions'],
  });

  const totalMembers = members.length;
  const activeMembers = members.filter((m: any) => m.tokenBalance > 0).length;
  const totalBalance = members.reduce((sum: number, m: any) => sum + parseFloat(m.tokenBalance || "0"), 0);
  const totalEarned = members.reduce((sum: number, m: any) => sum + parseFloat(m.totalEarned || "0"), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency', 
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Tổng quan hệ thống Affiliate
        </h2>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng thành viên</p>
                <p className="text-2xl font-bold text-blue-600">{totalMembers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                <p className="text-2xl font-bold text-green-600">{activeMembers}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng số dư ví</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalBalance)}</p>
              </div>
              <Wallet className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng đã kiếm</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalEarned)}</p>
              </div>
              <Star className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Member Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Phân bố thành viên theo vai trò</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Giáo viên</h4>
              {members.filter((m: any) => m.role === 'teacher').map((teacher: any) => (
                <div key={teacher.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      👩‍🏫
                    </div>
                    <div>
                      <p className="font-medium">{teacher.name}</p>
                      <p className="text-sm text-gray-600">{teacher.phone}</p>
                    </div>
                  </div>
                  <Badge variant="default">
                    {formatCurrency(parseFloat(teacher.tokenBalance || "0"))}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Phụ huynh</h4>
              {members.filter((m: any) => m.role === 'parent').slice(0, 5).map((parent: any) => (
                <div key={parent.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      👨‍👩‍👧‍👦
                    </div>
                    <div>
                      <p className="font-medium">{parent.name}</p>
                      <p className="text-sm text-gray-600">{parent.phone}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {formatCurrency(parseFloat(parent.tokenBalance || "0"))}
                  </Badge>
                </div>
              ))}
              {members.filter((m: any) => m.role === 'parent').length > 5 && (
                <p className="text-sm text-gray-500 text-center">
                  Và {members.filter((m: any) => m.role === 'parent').length - 5} phụ huynh khác...
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Withdrawal Form Component
const WithdrawalForm = ({ currentBalance, memberId }: { currentBalance: number, memberId: string }) => {
  const [amount, setAmount] = useState("");
  const [bankInfo, setBankInfo] = useState("");
  const [requestNote, setRequestNote] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createWithdrawalMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/withdrawal-requests", data);
    },
    onSuccess: () => {
      toast({
        title: "Yêu cầu rút tiền thành công",
        description: "Yêu cầu của bạn đã được gửi và đang chờ xử lý",
      });
      setIsDialogOpen(false);
      setAmount("");
      setBankInfo("");
      setRequestNote("");
      queryClient.invalidateQueries({ queryKey: ["/api/withdrawal-requests"] });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể gửi yêu cầu rút tiền",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requestAmount = parseFloat(amount);
    
    if (requestAmount <= 0) {
      toast({
        title: "Lỗi",
        description: "Số tiền rút phải lớn hơn 0",
        variant: "destructive",
      });
      return;
    }

    if (requestAmount > currentBalance) {
      toast({
        title: "Lỗi",
        description: "Số dư không đủ để thực hiện giao dịch",
        variant: "destructive",
      });
      return;
    }

    createWithdrawalMutation.mutate({
      memberId,
      amount: requestAmount.toString(),
      bankInfo,
      requestNote,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Banknote className="w-4 h-4 mr-2" />
          Yêu cầu rút tiền
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Yêu cầu rút tiền</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Số dư hiện tại</Label>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(currentBalance)}
            </div>
          </div>

          <div>
            <Label htmlFor="amount">Số tiền muốn rút *</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              max={currentBalance}
              step="1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Nhập số tiền"
              required
            />
          </div>

          <div>
            <Label htmlFor="bankInfo">Thông tin ngân hàng *</Label>
            <Textarea
              id="bankInfo"
              value={bankInfo}
              onChange={(e) => setBankInfo(e.target.value)}
              placeholder="Ví dụ: Vietcombank - 1234567890 - Nguyễn Văn A"
              required
            />
          </div>

          <div>
            <Label htmlFor="requestNote">Ghi chú</Label>
            <Textarea
              id="requestNote"
              value={requestNote}
              onChange={(e) => setRequestNote(e.target.value)}
              placeholder="Ghi chú thêm (tùy chọn)"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={createWithdrawalMutation.isPending}
          >
            {createWithdrawalMutation.isPending ? "Đang gửi..." : "Gửi yêu cầu"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Enhanced Transaction History Component with Withdrawal
const EnhancedTransactionHistory = () => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  
  const { data: members = [] } = useQuery({
    queryKey: ['/api/affiliate/members'],
  });

  const { data: transactionHistory = [], isLoading } = useQuery({
    queryKey: ['/api/transaction-history', selectedMemberId],
    enabled: !!selectedMemberId,
  });

  const { data: withdrawalRequests = [] } = useQuery({
    queryKey: ['/api/withdrawal-requests/member', selectedMemberId],
    enabled: !!selectedMemberId,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { color: "bg-yellow-100 text-yellow-800", text: "Chờ xử lý" },
      approved: { color: "bg-blue-100 text-blue-800", text: "Đã duyệt" },
      paid: { color: "bg-green-100 text-green-800", text: "Đã thanh toán" },
      rejected: { color: "bg-red-100 text-red-800", text: "Từ chối" },
    };
    const config = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  const selectedMember = members.find((m: any) => m.memberId === selectedMemberId);
  const currentBalance = selectedMember ? parseFloat(selectedMember.tokenBalance || "0") : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <History className="w-5 h-5" />
          Lịch sử giao dịch và rút tiền
        </h2>
      </div>

      {/* Member Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Chọn thành viên để xem lịch sử</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {members.map((member: any) => (
              <Button
                key={member.id}
                variant={selectedMemberId === member.memberId ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMemberId(member.memberId)}
                className="justify-start"
              >
                {member.name}
                <Badge variant="secondary" className="ml-2">
                  {formatCurrency(parseFloat(member.tokenBalance || "0"))}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal Section */}
      {selectedMemberId && currentBalance > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Rút tiền</span>
              <div className="text-sm text-gray-500">
                Số dư: {formatCurrency(currentBalance)}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WithdrawalForm currentBalance={currentBalance} memberId={selectedMemberId} />
          </CardContent>
        </Card>
      )}

      {/* Withdrawal Requests History */}
      {selectedMemberId && withdrawalRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Lịch sử yêu cầu rút tiền</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {withdrawalRequests.map((request: any) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium">
                      {formatCurrency(parseFloat(request.amount))}
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Ngày yêu cầu: {new Date(request.requestedAt).toLocaleString('vi-VN')}</div>
                    {request.bankInfo && <div>Ngân hàng: {request.bankInfo}</div>}
                    {request.requestNote && <div>Ghi chú: {request.requestNote}</div>}
                    {request.adminNote && <div>Phản hồi admin: {request.adminNote}</div>}
                    {request.processedAt && (
                      <div>Xử lý lúc: {new Date(request.processedAt).toLocaleString('vi-VN')}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transaction History */}
      {selectedMemberId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Sao kê ví điện tử</span>
              <div className="text-sm text-gray-500">
                {selectedMember?.name}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : transactionHistory.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có giao dịch</h3>
                <p className="text-gray-500">Lịch sử giao dịch sẽ hiển thị tại đây khi có hoạt động</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-700 border-b pb-2">
                  <div>Ngày</div>
                  <div>Loại GD</div>
                  <div>Mô tả</div>
                  <div className="text-right">Số tiền</div>
                  <div className="text-right">Số dư trước</div>
                  <div className="text-right">Số dư sau</div>
                </div>
                {transactionHistory.map((transaction: any) => (
                  <div 
                    key={transaction.id} 
                    className="grid grid-cols-6 gap-4 text-sm py-3 border-b border-gray-100 hover:bg-gray-50 rounded-lg px-2"
                  >
                    <div className="text-gray-600">
                      {new Date(transaction.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="flex items-center gap-2">
                      {transaction.transactionType === 'withdrawal' ? (
                        <ArrowUpRight className="w-4 h-4 text-red-500" />
                      ) : (
                        <ArrowDownLeft className="w-4 h-4 text-green-500" />
                      )}
                      <span className="text-xs">
                        {transaction.transactionType === 'withdrawal' ? 'Rút tiền' : 'Nhận thưởng'}
                      </span>
                    </div>
                    <div className="text-gray-700">{transaction.description}</div>
                    <div className={`text-right font-medium ${
                      parseFloat(transaction.amount) > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {parseFloat(transaction.amount) > 0 ? '+' : ''}{formatCurrency(parseFloat(transaction.amount))}
                    </div>
                    <div className="text-right text-gray-600">
                      {formatCurrency(parseFloat(transaction.balanceBefore))}
                    </div>
                    <div className="text-right font-medium">
                      {formatCurrency(parseFloat(transaction.balanceAfter))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Main component
export default function AffiliateClean() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Hệ thống Affiliate Marketing
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Tham gia mạng lưới giới thiệu học sinh và nhận thưởng hấp dẫn
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <UserCheck className="w-5 h-5 mr-2" />
                Đăng ký tham gia
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <QrCode className="w-5 h-5 mr-2" />
                Xem QR Code
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">📊 Tổng quan</TabsTrigger>
            <TabsTrigger value="members">👥 Thành viên</TabsTrigger>
            <TabsTrigger value="genealogy">🌳 Sơ đồ cây</TabsTrigger>
            <TabsTrigger value="transactions">💰 Giao dịch</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <StatsOverview />
          </TabsContent>

          <TabsContent value="members" className="mt-6">
            <MemberList />
          </TabsContent>

          <TabsContent value="genealogy" className="mt-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  🌳 Sơ đồ cây thành viên
                </h2>
              </div>
              <AffiliateTree />
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="mt-6">
            <EnhancedTransactionHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}