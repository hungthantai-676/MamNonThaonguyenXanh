import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Eye,
  UserCheck,
  Wallet,
  Gift,
  BarChart3,
  Settings,
  TreePine,
  CreditCard,
  UserPlus
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AffiliateTree from "@/components/affiliate-tree";

interface AffiliateMember {
  id: string;
  username: string;
  email: string;
  walletBalance: number;
  totalReferrals: number;
  totalCommissions: number;
  level: number;
  parentId?: string;
  status: 'active' | 'pending' | 'inactive';
  joinDate: string;
}

interface CommissionTransaction {
  id: string;
  memberId: string;
  amount: number;
  type: 'referral' | 'bonus' | 'milestone';
  status: 'pending' | 'confirmed' | 'paid';
  description: string;
  createdAt: string;
}

export default function AffiliateDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMember, setSelectedMember] = useState<AffiliateMember | null>(null);
  const [hiddenMembers, setHiddenMembers] = useState<Set<string>>(new Set());
  const [showHidden, setShowHidden] = useState(false);
  const [memberDetailOpen, setMemberDetailOpen] = useState(false);

  // Fetch affiliate data
  const { data: members = [], isLoading: membersLoading } = useQuery({
    queryKey: ['/api/affiliate/members'],
  });

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['/api/affiliate/transactions'],
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/affiliate/stats'],
  });

  // Mock data for development
  const mockMembers: AffiliateMember[] = [
    {
      id: "1",
      username: "user001",
      email: "user001@example.com",
      walletBalance: 4500000,
      totalReferrals: 3,
      totalCommissions: 6000000,
      level: 1,
      status: 'active',
      joinDate: "2025-01-15"
    },
    {
      id: "2", 
      username: "user002",
      email: "user002@example.com",
      walletBalance: 2000000,
      totalReferrals: 1,
      totalCommissions: 2000000,
      level: 2,
      parentId: "1",
      status: 'active',
      joinDate: "2025-01-20"
    }
  ];

  const mockTransactions: CommissionTransaction[] = [
    {
      id: "1",
      memberId: "1",
      amount: 2000000,
      type: 'referral',
      status: 'confirmed',
      description: "Hoa hồng giới thiệu học viên mới",
      createdAt: "2025-01-25"
    },
    {
      id: "2",
      memberId: "1", 
      amount: 4000000,
      type: 'bonus',
      status: 'pending',
      description: "Thưởng milestone 5 học viên",
      createdAt: "2025-01-26"
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-green-500';
      case 'paid': return 'bg-blue-500';
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const toggleMemberVisibility = (memberId: string) => {
    const newHiddenMembers = new Set(hiddenMembers);
    if (hiddenMembers.has(memberId)) {
      newHiddenMembers.delete(memberId);
      toast({
        title: "Hiển thị thành viên",
        description: "Thành viên đã được hiển thị lại",
      });
    } else {
      newHiddenMembers.add(memberId);
      toast({
        title: "Ẩn thành viên", 
        description: "Thành viên đã được ẩn khỏi danh sách",
      });
    }
    setHiddenMembers(newHiddenMembers);
  };

  const getVisibleMembers = () => {
    if (showHidden) {
      return mockMembers; // Hiển thị tất cả
    }
    return mockMembers.filter(member => !hiddenMembers.has(member.id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🔗 Quản trị Hệ thống Affiliate</h1>
            <p className="text-gray-600 mt-1">Quản lý thành viên, hoa hồng và thanh toán</p>
          </div>
          <div className="flex space-x-3">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Thêm thành viên
            </Button>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Cài đặt
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng thành viên</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMembers.length}</div>
              <p className="text-xs text-muted-foreground">+2 từ tháng trước</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng hoa hồng</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(8000000)}</div>
              <p className="text-xs text-muted-foreground">+15% từ tháng trước</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion tháng này</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">+33% từ tháng trước</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chờ thanh toán</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(4000000)}</div>
              <p className="text-xs text-muted-foreground">1 giao dịch</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">📊 Tổng quan</TabsTrigger>
            <TabsTrigger value="members">👥 Thành viên</TabsTrigger>
            <TabsTrigger value="transactions">💰 Giao dịch</TabsTrigger>
            <TabsTrigger value="genealogy">🌳 Phả hệ</TabsTrigger>
            <TabsTrigger value="payments">💳 Thanh toán</TabsTrigger>
            <TabsTrigger value="settings">⚙️ Cài đặt</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thành viên hoạt động</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{member.username}</div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(member.walletBalance)}</div>
                          <Badge className={getStatusColor(member.status)}>{member.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Giao dịch gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-gray-500">{transaction.createdAt}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(transaction.amount)}</div>
                          <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Danh sách thành viên</CardTitle>
                    <CardDescription>Quản lý tất cả thành viên trong hệ thống affiliate</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant={showHidden ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowHidden(!showHidden)}
                    >
                      {showHidden ? (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Hiển thị tất cả
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Hiển thị bị ẩn ({hiddenMembers.size})
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getVisibleMembers().map((member) => (
                    <div 
                      key={member.id} 
                      className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-all ${
                        hiddenMembers.has(member.id) ? 'opacity-50 bg-gray-100' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{member.username}</span>
                            {hiddenMembers.has(member.id) && (
                              <Badge variant="secondary" className="text-xs">Ẩn</Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                          <div className="text-xs text-gray-400">Tham gia: {member.joinDate}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-medium">Ví: {formatCurrency(member.walletBalance)}</div>
                          <div className="text-sm text-gray-500">Giới thiệu: {member.totalReferrals}</div>
                          <Badge className={getStatusColor(member.status)}>{member.status}</Badge>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleMemberVisibility(member.id)}
                            className={`text-xs ${hiddenMembers.has(member.id) ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'}`}
                          >
                            {hiddenMembers.has(member.id) ? (
                              <>
                                <Eye className="w-3 h-3 mr-1" />
                                Hiện
                              </>
                            ) : (
                              <>
                                <Eye className="w-3 h-3 mr-1" />
                                Ẩn
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedMember(member);
                              setMemberDetailOpen(true);
                            }}
                            className="text-xs border-blue-500 text-blue-600"
                          >
                            <Settings className="w-3 h-3 mr-1" />
                            Chi tiết
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Summary */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-blue-600">{mockMembers.length}</div>
                      <div className="text-sm text-gray-600">Tổng thành viên</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">{mockMembers.length - hiddenMembers.size}</div>
                      <div className="text-sm text-gray-600">Đang hiển thị</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-red-600">{hiddenMembers.size}</div>
                      <div className="text-sm text-gray-600">Đã ẩn</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Lịch sử giao dịch</CardTitle>
                <CardDescription>Tất cả giao dịch hoa hồng và thanh toán</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-gray-500">Thành viên: {transaction.memberId}</div>
                          <div className="text-xs text-gray-400">{transaction.createdAt}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(transaction.amount)}</div>
                        <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Genealogy Tab */}
          <TabsContent value="genealogy">
            <Card>
              <CardHeader>
                <CardTitle>Cây phả hệ Affiliate</CardTitle>
                <CardDescription>Sơ đồ cấu trúc mạng lưới giới thiệu tương tác</CardDescription>
              </CardHeader>
              <CardContent>
                <AffiliateTree />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý thanh toán</CardTitle>
                <CardDescription>Xử lý và theo dõi các khoản thanh toán hoa hồng</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Hệ thống thanh toán</h3>
                  <p className="text-gray-500 mb-6">Xử lý thanh toán hoa hồng và quản lý ví điện tử</p>
                  <div className="flex justify-center space-x-4">
                    <Button variant="outline">
                      Xem giao dịch chờ
                    </Button>
                    <Button>
                      Xử lý thanh toán
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt hệ thống</CardTitle>
                <CardDescription>Cấu hình các thông số của hệ thống affiliate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label htmlFor="referral-commission">Hoa hồng giới thiệu (VNĐ)</Label>
                    <Input id="referral-commission" defaultValue="2000000" />
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="milestone-bonus">Thưởng milestone (VNĐ)</Label>
                    <Input id="milestone-bonus" defaultValue="10000000" />
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="milestone-count">Số lượng milestone</Label>
                    <Input id="milestone-count" defaultValue="5" />
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="min-payout">Số tiền tối thiểu rút (VNĐ)</Label>
                    <Input id="min-payout" defaultValue="500000" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>
                    <Settings className="w-4 h-4 mr-2" />
                    Lưu cài đặt
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Member Detail Modal */}
        <Dialog open={memberDetailOpen} onOpenChange={setMemberDetailOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chi tiết thành viên</DialogTitle>
              <DialogDescription>
                Thông tin chi tiết và quản lý thành viên {selectedMember?.username}
              </DialogDescription>
            </DialogHeader>
            
            {selectedMember && (
              <div className="space-y-6">
                {/* Basic Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Thông tin cơ bản</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Tên đăng nhập</Label>
                      <div className="text-sm text-gray-700">{selectedMember.username}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <div className="text-sm text-gray-700">{selectedMember.email}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Cấp độ</Label>
                      <div className="text-sm text-gray-700">Cấp {selectedMember.level}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Trạng thái</Label>
                      <Badge className={getStatusColor(selectedMember.status)}>{selectedMember.status}</Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Ngày tham gia</Label>
                      <div className="text-sm text-gray-700">{selectedMember.joinDate}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Trạng thái hiển thị</Label>
                      <Badge variant={hiddenMembers.has(selectedMember.id) ? "destructive" : "default"}>
                        {hiddenMembers.has(selectedMember.id) ? "Đã ẩn" : "Hiển thị"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Wallet & Commissions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Thông tin tài chính</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Số dư ví</Label>
                      <div className="text-lg font-bold text-green-600">{formatCurrency(selectedMember.walletBalance)}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Tổng hoa hồng</Label>
                      <div className="text-lg font-bold text-blue-600">{formatCurrency(selectedMember.totalCommissions)}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Số lượng giới thiệu</Label>
                      <div className="text-lg font-bold text-purple-600">{selectedMember.totalReferrals}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Hoa hồng chờ</Label>
                      <div className="text-lg font-bold text-orange-600">{formatCurrency(1000000)}</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Hành động quản lý</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        onClick={() => toggleMemberVisibility(selectedMember.id)}
                        className={hiddenMembers.has(selectedMember.id) ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'}
                      >
                        {hiddenMembers.has(selectedMember.id) ? (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Hiển thị thành viên
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Ẩn thành viên
                          </>
                        )}
                      </Button>
                      <Button variant="outline">
                        <Wallet className="w-4 h-4 mr-2" />
                        Xem lịch sử ví
                      </Button>
                      <Button variant="outline">
                        <UserCheck className="w-4 h-4 mr-2" />
                        Xem mạng lưới
                      </Button>
                      <Button variant="outline">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Thống kê chi tiết
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Close Button */}
                <div className="flex justify-end">
                  <Button onClick={() => setMemberDetailOpen(false)}>
                    Đóng
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}