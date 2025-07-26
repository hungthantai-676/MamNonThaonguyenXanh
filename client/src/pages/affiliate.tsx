import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QrCode, Wallet, TreePine, Users, DollarSign, Gift, Star, Crown, Shield, UserCheck, Phone, Mail, Calendar, DollarSign as Money, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle } from "lucide-react";

// Demo Management Component
const DemoManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const createDemoData = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/demo/create-affiliate-data", {});
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/affiliate/members"] });
      queryClient.invalidateQueries({ queryKey: ["/api/customer-conversions"] });
      toast({
        title: "Tạo dữ liệu demo thành công! 🎉",
        description: `Đã tạo ${data.count} bản ghi demo để test các tính năng`,
      });
      setIsCreating(false);
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi tạo dữ liệu demo",
        description: error.message || "Không thể tạo dữ liệu demo",
        variant: "destructive",
      });
      setIsCreating(false);
    },
  });

  const clearDemoData = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/demo/clear-affiliate-data", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/affiliate/members"] });
      queryClient.invalidateQueries({ queryKey: ["/api/customer-conversions"] });
      toast({
        title: "Xóa dữ liệu demo thành công! 🗑️",
        description: "Tất cả dữ liệu demo đã được xóa khỏi hệ thống",
      });
      setIsClearing(false);
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi xóa dữ liệu demo",
        description: error.message || "Không thể xóa dữ liệu demo",
        variant: "destructive",
      });
      setIsClearing(false);
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Quản lý dữ liệu Demo Test
        </h2>
      </div>

      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-800 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Khu vực Test Demo
          </CardTitle>
          <CardDescription className="text-yellow-700">
            Tạo dữ liệu demo để test tất cả tính năng affiliate. Có thể xóa bất kỳ lúc nào.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Create Demo Data */}
            <Card className="border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-green-700 flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  Tạo dữ liệu Demo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-2">Sẽ tạo:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• 3 thành viên affiliate (teacher + parent)</li>
                      <li>• 2 khách hàng conversion demo</li>
                      <li>• Dữ liệu ví và giao dịch mẫu</li>
                      <li>• QR codes và wallet addresses</li>
                    </ul>
                  </div>
                  <Button 
                    onClick={() => {
                      setIsCreating(true);
                      createDemoData.mutate();
                    }}
                    disabled={isCreating || createDemoData.isPending}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isCreating || createDemoData.isPending ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Đang tạo...
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4 mr-2" />
                        Tạo dữ liệu Demo
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Clear Demo Data */}
            <Card className="border-red-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-red-700 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Xóa dữ liệu Demo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-2">Sẽ xóa:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Tất cả thành viên demo</li>
                      <li>• Khách hàng conversion demo</li>
                      <li>• Giao dịch và lịch sử demo</li>
                      <li>• Không ảnh hưởng dữ liệu thật</li>
                    </ul>
                  </div>
                  <Button 
                    onClick={() => {
                      if (confirm('Bạn có chắc muốn xóa tất cả dữ liệu demo?')) {
                        setIsClearing(true);
                        clearDemoData.mutate();
                      }
                    }}
                    disabled={isClearing || clearDemoData.isPending}
                    variant="destructive"
                    className="w-full"
                  >
                    {isClearing || clearDemoData.isPending ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Đang xóa...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Xóa tất cả Demo
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Demo Status Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Hướng dẫn test demo
            </h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>1. Nhấn "Tạo dữ liệu Demo" để có dữ liệu test</p>
              <p>2. Chuyển qua các tab để xem thành viên, giao dịch, thanh toán</p>
              <p>3. Test tất cả tính năng với dữ liệu demo</p>
              <p>4. Nhấn "Xóa tất cả Demo" khi hoàn tất test</p>
            </div>
          </div>
        </CardContent>
      </Card>
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
        return <Money className="w-5 h-5 text-gray-600" />;
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
                    <div className="flex items-center gap-2">
                      <div className="text-xs">
                        {new Date(transaction.createdAt).toLocaleDateString('vi-VN')}
                        <br />
                        <span className="text-gray-500">
                          {new Date(transaction.createdAt).toLocaleTimeString('vi-VN', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTransactionIcon(transaction.transactionType)}
                      <span className="text-xs">
                        {getTransactionDescription(transaction.transactionType)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-600">
                        {transaction.description}
                      </span>
                    </div>
                    <div className="text-right flex items-center justify-end">
                      <span className={`font-medium ${
                        parseFloat(transaction.amount) > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {parseFloat(transaction.amount) > 0 ? '+' : ''}
                        {formatCurrency(parseFloat(transaction.amount))}
                      </span>
                    </div>
                    <div className="text-right flex items-center justify-end text-gray-500">
                      {formatCurrency(parseFloat(transaction.balanceBefore))}
                    </div>
                    <div className="text-right flex items-center justify-end">
                      <span className="font-semibold text-blue-600">
                        {formatCurrency(parseFloat(transaction.balanceAfter))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Current Balance Summary */}
      {selectedMemberId && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Số dư hiện tại</h3>
                <p className="text-sm text-gray-600">
                  Tài khoản: {members.find((m: any) => m.memberId === selectedMemberId)?.name}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">
                  {formatCurrency(parseFloat(
                    members.find((m: any) => m.memberId === selectedMemberId)?.tokenBalance || "0"
                  ))}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Đã xác minh
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const affiliateSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(10, "Số điện thoại phải có ít nhất 10 số"),
  memberType: z.enum(["teacher", "parent"]),
  sponsorId: z.string().optional(),
});

const customerConversionSchema = z.object({
  customerName: z.string().min(1, "Tên khách hàng không được để trống"),
  customerPhone: z.string().min(10, "Số điện thoại phải có ít nhất 10 số"),
  customerEmail: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  f1AgentId: z.string(),
  f0ReferrerId: z.string().optional(),
  notes: z.string().optional(),
});

type AffiliateFormData = z.infer<typeof affiliateSchema>;
type CustomerConversionFormData = z.infer<typeof customerConversionSchema>;

export default function AffiliatePage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedAgentForCustomers, setSelectedAgentForCustomers] = useState<string>("");
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["/api/affiliate/members"],
  });

  const { data: teacherMembers = [] } = useQuery({
    queryKey: ["/api/affiliate/members/teacher"],
  });

  const { data: parentMembers = [] } = useQuery({
    queryKey: ["/api/affiliate/members/parent"],
  });

  const { data: customerConversions = [] } = useQuery({
    queryKey: ["/api/customer-conversions"],
  });

  const { data: agentCustomers = [] } = useQuery({
    queryKey: ["/api/customer-conversions/agent", selectedAgentForCustomers],
    enabled: !!selectedAgentForCustomers,
  });

  const form = useForm<AffiliateFormData>({
    resolver: zodResolver(affiliateSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      memberType: "parent",
      sponsorId: "",
    },
  });

  const customerForm = useForm<CustomerConversionFormData>({
    resolver: zodResolver(customerConversionSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      f1AgentId: "",
      notes: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: AffiliateFormData) => {
      const response = await apiRequest("POST", "/api/affiliate/register", data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/affiliate/members"] });
      toast({
        title: "Đăng ký thành công! 🎉",
        description: "Bạn đã trở thành thành viên affiliate. Hãy kiểm tra ví Web3 và QR code của bạn.",
      });
      setShowRegistrationForm(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Đăng ký thất bại",
        description: error.message || "Có lỗi xảy ra khi đăng ký",
        variant: "destructive",
      });
    },
  });

  const addCustomerMutation = useMutation({
    mutationFn: async (data: CustomerConversionFormData) => {
      const response = await apiRequest("POST", "/api/customer-conversions", data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customer-conversions"] });
      toast({
        title: "Thêm khách hàng thành công! 📋",
        description: "Khách hàng đã được thêm vào danh sách theo dõi.",
      });
      setShowCustomerForm(false);
      customerForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Thêm khách hàng thất bại",
        description: error.message || "Có lỗi xảy ra khi thêm khách hàng",
        variant: "destructive",
      });
    },
  });

  const updateCustomerStatusMutation = useMutation({
    mutationFn: async ({ id, status, paymentAmount }: { id: number; status: string; paymentAmount?: string }) => {
      const response = await apiRequest("PUT", `/api/customer-conversions/${id}`, {
        conversionStatus: status,
        paymentAmount: paymentAmount ? parseFloat(paymentAmount) : undefined,
      });
      return response;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/customer-conversions"] });
      if (variables.status === "payment_completed") {
        toast({
          title: "Xác nhận thanh toán thành công! 💰",
          description: "Hoa hồng đã được tự động phân phối cho F1 và F0.",
        });
      } else {
        toast({
          title: "Cập nhật trạng thái thành công!",
          description: "Trạng thái khách hàng đã được cập nhật.",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Cập nhật thất bại",
        description: error.message || "Có lỗi xảy ra khi cập nhật trạng thái",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AffiliateFormData) => {
    registerMutation.mutate(data);
  };

  const onCustomerSubmit = (data: CustomerConversionFormData) => {
    addCustomerMutation.mutate(data);
  };

  const handleStatusUpdate = (customerId: number, status: string, paymentAmount?: string) => {
    updateCustomerStatusMutation.mutate({ id: customerId, status, paymentAmount });
  };

  const getMemberTypeColor = (memberType: string) => {
    return memberType === "teacher" ? "bg-green-500" : "bg-purple-500";
  };

  const getMemberTypeIcon = (memberType: string) => {
    return memberType === "teacher" ? <Shield className="w-4 h-4" /> : <Crown className="w-4 h-4" />;
  };

  const formatWalletAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTokenBalance = (balance: string) => {
    const num = parseFloat(balance);
    return num.toLocaleString('vi-VN', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  const getReferralLink = (member: any) => {
    return `${window.location.origin}/affiliate/join?ref=${member.memberId}`;
  };

  const handleCopyLink = (member: any) => {
    const link = getReferralLink(member);
    navigator.clipboard.writeText(link);
    toast({
      title: "Đã sao chép!",
      description: "Link giới thiệu đã được sao chép vào clipboard",
    });
  };

  // Helper function to calculate correct rewards based on conversions
  const calculateCorrectReward = (confirmedStudents: number, memberType: "teacher" | "parent") => {
    if (memberType === "teacher") {
      // Teachers: 2M VND per student + 10M VND bonus every 5 students
      const baseReward = confirmedStudents * 2000000;
      const milestonesCompleted = Math.floor(confirmedStudents / 5);
      const milestoneBonus = milestonesCompleted * 10000000;
      return {
        baseReward,
        milestoneBonus,
        totalReward: baseReward + milestoneBonus,
        unit: "VND",
        nextMilestone: Math.ceil(confirmedStudents / 5) * 5,
        progressToMilestone: confirmedStudents % 5
      };
    } else {
      // Parents: 2000 points per student + 10000 points bonus every 5 students
      const baseReward = confirmedStudents * 2000;
      const milestonesCompleted = Math.floor(confirmedStudents / 5);
      const milestoneBonus = milestonesCompleted * 10000;
      return {
        baseReward,
        milestoneBonus,
        totalReward: baseReward + milestoneBonus,
        unit: "điểm",
        nextMilestone: Math.ceil(confirmedStudents / 5) * 5,
        progressToMilestone: confirmedStudents % 5
      };
    }
  };

  const formatReward = (amount: number, unit: string) => {
    if (unit === "VND") {
      return `${amount.toLocaleString('vi-VN')} VND`;
    } else {
      return `${amount.toLocaleString('vi-VN')} ${unit}`;
    }
  };



  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">🌟 Hệ thống Affiliate Mầm Non Thảo Nguyên Xanh</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tham gia chương trình affiliate của chúng tôi để nhận token, xây dựng mạng lưới và giao dịch trên sàn phi tập trung (DEX)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Shield className="w-5 h-5" />
                Chăm sóc phụ huynh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Dành cho giáo viên và nhân viên trường học
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">
                  {teacherMembers.length}
                </span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Thành viên
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Crown className="w-5 h-5" />
                Đại sứ thương hiệu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Dành cho phụ huynh và người quan tâm
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-purple-600">
                  {parentMembers.length}
                </span>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Thành viên
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <DollarSign className="w-5 h-5" />
                Tổng Thưởng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Thưởng theo quy tắc mới
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-blue-600">
                    Giáo viên: {formatReward(
                      teacherMembers.reduce((sum: number, member: any) => {
                        const confirmedStudents = customerConversions.filter((c: any) => 
                          c.agentMemberId === member.memberId && c.conversionStatus === "payment_completed"
                        ).length;
                        const reward = calculateCorrectReward(confirmedStudents, "teacher");
                        return sum + reward.totalReward;
                      }, 0), 
                      "VND"
                    )}
                  </div>
                  <div className="text-sm font-bold text-purple-600">
                    Phụ huynh: {formatReward(
                      parentMembers.reduce((sum: number, member: any) => {
                        const confirmedStudents = customerConversions.filter((c: any) => 
                          c.referrerId === member.memberId && c.conversionStatus === "payment_completed"
                        ).length;
                        const reward = calculateCorrectReward(confirmedStudents, "parent");
                        return sum + reward.totalReward;
                      }, 0), 
                      "điểm"
                    )}
                  </div>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Theo quy tắc
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="members">Thành viên</TabsTrigger>
            <TabsTrigger value="teachers">Giáo viên</TabsTrigger>
            <TabsTrigger value="parents">Phụ huynh</TabsTrigger>
            <TabsTrigger value="customers">Khách hàng F1</TabsTrigger>
            <TabsTrigger value="history">Lịch sử GD</TabsTrigger>
            <TabsTrigger value="demo">Demo Test</TabsTrigger>
            <TabsTrigger value="join">Tham gia</TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Tất cả thành viên</h2>
              <Button onClick={() => setShowRegistrationForm(true)}>
                Đăng ký ngay
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member: any) => (
                <Card key={member.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <Badge className={getMemberTypeColor(member.memberType)}>
                        {getMemberTypeIcon(member.memberType)}
                        {member.categoryName}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-mono">
                          {formatWalletAddress(member.walletAddress)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-semibold">
                          {(() => {
                            const confirmedStudents = customerConversions.filter((c: any) => 
                              (c.agentMemberId === member.memberId || c.referrerId === member.memberId) && 
                              c.conversionStatus === "payment_completed"
                            ).length;
                            const reward = calculateCorrectReward(confirmedStudents, member.categoryName === "Giáo viên" ? "teacher" : "parent");
                            return formatReward(reward.totalReward, reward.unit);
                          })()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          {member.totalReferrals} giới thiệu
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TreePine className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          Cấp {member.level}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <QrCode className="w-4 h-4" />
                            QR Code
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>QR Code giới thiệu</DialogTitle>
                          </DialogHeader>
                          <div className="text-center">
                            <img 
                              src={member.qrCode} 
                              alt="QR Code" 
                              className="mx-auto mb-4"
                              style={{ maxWidth: '200px' }}
                            />
                            <p className="text-sm text-gray-600 mb-2">
                              Chia sẻ QR code này để mời người khác tham gia
                            </p>
                            <div className="bg-gray-100 p-2 rounded text-xs font-mono break-all mb-3">
                              {getReferralLink(member)}
                            </div>
                            <div className="space-y-2">
                              <Button
                                onClick={() => handleCopyLink(member)}
                                size="sm"
                                className="w-full"
                              >
                                Sao chép link
                              </Button>
                              <div className="text-center">
                                <p className="text-sm font-semibold text-green-600">
                                  Mã giới thiệu: {member.memberId}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Người khác có thể nhập mã này khi đăng ký
                                </p>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedMember(member)}
                      >
                        <TreePine className="w-4 h-4 mr-1" />
                        Cây phả hệ
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="teachers" className="space-y-4">
            <h2 className="text-xl font-semibold">Chăm sóc phụ huynh</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teacherMembers.map((member: any) => (
                <Card key={member.id} className="border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <Shield className="w-5 h-5" />
                      {member.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">{member.email}</p>
                      <p className="text-sm text-gray-600">{member.phone}</p>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-semibold">
                          {(() => {
                            const confirmedStudents = customerConversions.filter((c: any) => 
                              c.agentMemberId === member.memberId && 
                              c.conversionStatus === "payment_completed"
                            ).length;
                            const reward = calculateCorrectReward(confirmedStudents, "teacher");
                            return formatReward(reward.totalReward, reward.unit);
                          })()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-gray-500">
                          {(() => {
                            const confirmedStudents = customerConversions.filter((c: any) => 
                              c.agentMemberId === member.memberId && 
                              c.conversionStatus === "payment_completed"
                            ).length;
                            const reward = calculateCorrectReward(confirmedStudents, "teacher");
                            return `Đã xác nhận: ${confirmedStudents} học sinh | Tiến độ milestone: ${reward.progressToMilestone}/5`;
                          })()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-500" />
                        <span className="text-sm">
                          {member.totalReferrals} giới thiệu
                        </span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full flex items-center gap-1">
                            <QrCode className="w-4 h-4" />
                            Xem mã giới thiệu
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>QR Code giới thiệu - {member.name}</DialogTitle>
                          </DialogHeader>
                          <div className="text-center">
                            <img 
                              src={member.qrCode} 
                              alt="QR Code" 
                              className="mx-auto mb-4"
                              style={{ maxWidth: '200px' }}
                            />
                            <p className="text-sm text-gray-600 mb-2">
                              Chia sẻ QR code này để mời người khác tham gia
                            </p>
                            <div className="bg-gray-100 p-2 rounded text-xs font-mono break-all mb-3">
                              {getReferralLink(member)}
                            </div>
                            <div className="space-y-2">
                              <Button
                                onClick={() => handleCopyLink(member)}
                                size="sm"
                                className="w-full"
                              >
                                Sao chép link
                              </Button>
                              <div className="text-center">
                                <p className="text-sm font-semibold text-green-600">
                                  Mã giới thiệu: {member.memberId}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Người khác có thể nhập mã này khi đăng ký
                                </p>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="parents" className="space-y-4">
            <h2 className="text-xl font-semibold">Đại sứ thương hiệu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {parentMembers.map((member: any) => (
                <Card key={member.id} className="border-purple-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-purple-700">
                      <Crown className="w-5 h-5" />
                      {member.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">{member.email}</p>
                      <p className="text-sm text-gray-600">{member.phone}</p>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-purple-500" />
                        <span className="text-sm font-semibold">
                          {(() => {
                            const confirmedStudents = customerConversions.filter((c: any) => 
                              c.referrerId === member.memberId && 
                              c.conversionStatus === "payment_completed"
                            ).length;
                            const reward = calculateCorrectReward(confirmedStudents, "parent");
                            return formatReward(reward.totalReward, reward.unit);
                          })()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4 text-purple-500" />
                        <span className="text-xs text-gray-500">
                          {(() => {
                            const confirmedStudents = customerConversions.filter((c: any) => 
                              c.referrerId === member.memberId && 
                              c.conversionStatus === "payment_completed"
                            ).length;
                            const reward = calculateCorrectReward(confirmedStudents, "parent");
                            return `Đã xác nhận: ${confirmedStudents} học sinh | Tiến độ milestone: ${reward.progressToMilestone}/5`;
                          })()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">
                          {member.totalReferrals} giới thiệu
                        </span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full flex items-center gap-1">
                            <QrCode className="w-4 h-4" />
                            Xem mã giới thiệu
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>QR Code giới thiệu - {member.name}</DialogTitle>
                          </DialogHeader>
                          <div className="text-center">
                            <img 
                              src={member.qrCode} 
                              alt="QR Code" 
                              className="mx-auto mb-4"
                              style={{ maxWidth: '200px' }}
                            />
                            <p className="text-sm text-gray-600 mb-2">
                              Chia sẻ QR code này để mời người khác tham gia
                            </p>
                            <div className="bg-gray-100 p-2 rounded text-xs font-mono break-all mb-3">
                              {getReferralLink(member)}
                            </div>
                            <div className="space-y-2">
                              <Button
                                onClick={() => handleCopyLink(member)}
                                size="sm"
                                className="w-full"
                              >
                                Sao chép link
                              </Button>
                              <div className="text-center">
                                <p className="text-sm font-semibold text-purple-600">
                                  Mã giới thiệu: {member.memberId}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Người khác có thể nhập mã này khi đăng ký
                                </p>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                Theo dõi khách hàng F1
              </h2>
              <Button onClick={() => setShowCustomerForm(true)}>
                Thêm khách hàng
              </Button>
            </div>
            
            <div className="mb-4">
              <Label htmlFor="agentSelect">Chọn F1 Agent để xem khách hàng:</Label>
              <select
                id="agentSelect"
                value={selectedAgentForCustomers}
                onChange={(e) => setSelectedAgentForCustomers(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="">-- Chọn agent --</option>
                {members.map((member: any) => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.categoryName})
                  </option>
                ))}
              </select>
            </div>

            {selectedAgentForCustomers && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agentCustomers.map((customer: any) => {
                  const getStatusColor = (status: string) => {
                    switch (status) {
                      case "potential_info": return "bg-red-100 text-red-800 border-red-200";
                      case "high_conversion": return "bg-yellow-100 text-yellow-800 border-yellow-200";
                      case "payment_completed": return "bg-green-100 text-green-800 border-green-200";
                      default: return "bg-gray-100 text-gray-800 border-gray-200";
                    }
                  };

                  const getStatusText = (status: string) => {
                    switch (status) {
                      case "potential_info": return "Thông tin tiềm năng";
                      case "high_conversion": return "Khả năng cao";
                      case "payment_completed": return "Đã thanh toán";
                      default: return "Chưa xác định";
                    }
                  };

                  return (
                    <Card key={customer.id} className="border-blue-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between">
                          <span className="text-lg">{customer.customerName}</span>
                          <Badge className={getStatusColor(customer.conversionStatus)}>
                            {getStatusText(customer.conversionStatus)}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{customer.customerPhone}</span>
                          </div>
                          {customer.customerEmail && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-500" />
                              <span className="text-sm">{customer.customerEmail}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">
                              {new Date(customer.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                          {customer.paymentAmount && (
                            <div className="flex items-center gap-2">
                              <Money className="w-4 h-4 text-green-500" />
                              <span className="text-sm font-semibold text-green-600">
                                {customer.paymentAmount.toLocaleString('vi-VN')} VNĐ
                              </span>
                            </div>
                          )}
                          {customer.notes && (
                            <p className="text-sm text-gray-600 italic">{customer.notes}</p>
                          )}
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant={customer.conversionStatus === "potential_info" ? "default" : "outline"}
                              className="flex-1 text-xs"
                              onClick={() => handleStatusUpdate(customer.id, "potential_info")}
                            >
                              🔴 Tiềm năng
                            </Button>
                            <Button
                              size="sm"
                              variant={customer.conversionStatus === "high_conversion" ? "default" : "outline"}
                              className="flex-1 text-xs"
                              onClick={() => handleStatusUpdate(customer.id, "high_conversion")}
                            >
                              🟡 Khả năng cao
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            variant={customer.conversionStatus === "payment_completed" ? "default" : "outline"}
                            className="w-full text-xs"
                            onClick={() => {
                              const amount = prompt("Nhập số tiền thanh toán (VNĐ):");
                              if (amount) {
                                handleStatusUpdate(customer.id, "payment_completed", amount);
                              }
                            }}
                          >
                            🟢 Xác nhận thanh toán
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {selectedAgentForCustomers && agentCustomers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Agent này chưa có khách hàng nào</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <TransactionHistory />
          </TabsContent>

          <TabsContent value="demo" className="space-y-4">
            <DemoManagement />
          </TabsContent>

          <TabsContent value="join" className="space-y-4">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-center">
                  <Gift className="w-6 h-6 mx-auto mb-2" />
                  Tham gia Affiliate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Họ và tên</Label>
                    <Input
                      id="name"
                      {...form.register("name")}
                      placeholder="Nhập họ và tên"
                    />
                    {form.formState.errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register("email")}
                      placeholder="Nhập email"
                    />
                    {form.formState.errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      {...form.register("phone")}
                      placeholder="Nhập số điện thoại"
                    />
                    {form.formState.errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Loại thành viên</Label>
                    <RadioGroup
                      defaultValue="parent"
                      onValueChange={(value) => form.setValue("memberType", value as "teacher" | "parent")}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="teacher" id="teacher" />
                        <Label htmlFor="teacher" className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-green-600" />
                          Chăm sóc phụ huynh (Giáo viên)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="parent" id="parent" />
                        <Label htmlFor="parent" className="flex items-center gap-2">
                          <Crown className="w-4 h-4 text-purple-600" />
                          Đại sứ thương hiệu (Phụ huynh)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="sponsorId">Mã giới thiệu (tùy chọn)</Label>
                    <Input
                      id="sponsorId"
                      {...form.register("sponsorId")}
                      placeholder="Nhập mã giới thiệu nếu có"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Đang đăng ký..." : "Đăng ký ngay"}
                  </Button>
                </form>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">🎁 Lợi ích khi tham gia:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Nhận 1,000 TNG token khi đăng ký</li>
                    <li>• Tự động tạo ví Web3 cá nhân</li>
                    <li>• QR code giới thiệu độc quyền</li>
                    <li>• Hoa hồng từ mạng lưới giới thiệu</li>
                    <li>• Giao dịch trên sàn DEX</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Registration Modal */}
        <Dialog open={showRegistrationForm} onOpenChange={setShowRegistrationForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">
                <Gift className="w-6 h-6 mx-auto mb-2" />
                Tham gia Affiliate
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="modal-name">Họ và tên</Label>
                <Input
                  id="modal-name"
                  {...form.register("name")}
                  placeholder="Nhập họ và tên"
                />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="modal-email">Email</Label>
                <Input
                  id="modal-email"
                  type="email"
                  {...form.register("email")}
                  placeholder="Nhập email"
                />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="modal-phone">Số điện thoại</Label>
                <Input
                  id="modal-phone"
                  {...form.register("phone")}
                  placeholder="Nhập số điện thoại"
                />
                {form.formState.errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Loại thành viên</Label>
                <RadioGroup
                  defaultValue="parent"
                  onValueChange={(value) => form.setValue("memberType", value as "teacher" | "parent")}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="teacher" id="modal-teacher" />
                    <Label htmlFor="modal-teacher" className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      Chăm sóc phụ huynh (Giáo viên)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="parent" id="modal-parent" />
                    <Label htmlFor="modal-parent" className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-purple-600" />
                      Đại sứ thương hiệu (Phụ huynh)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="modal-sponsorId">Mã giới thiệu (tùy chọn)</Label>
                <Input
                  id="modal-sponsorId"
                  {...form.register("sponsorId")}
                  placeholder="Nhập mã giới thiệu nếu có"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? "Đang đăng ký..." : "Đăng ký ngay"}
              </Button>
            </form>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">🎁 Lợi ích khi tham gia:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Nhận 1,000 TNG token khi đăng ký</li>
                <li>• Tự động tạo ví Web3 cá nhân</li>
                <li>• QR code giới thiệu độc quyền</li>
                <li>• Hoa hồng từ mạng lưới giới thiệu</li>
                <li>• Giao dịch trên sàn DEX</li>
              </ul>
            </div>
          </DialogContent>
        </Dialog>

        {/* Customer Form Modal */}
        <Dialog open={showCustomerForm} onOpenChange={setShowCustomerForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">
                <UserCheck className="w-6 h-6 mx-auto mb-2" />
                Thêm khách hàng F1
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={customerForm.handleSubmit(onCustomerSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="customerName">Tên khách hàng</Label>
                <Input
                  id="customerName"
                  {...customerForm.register("customerName")}
                  placeholder="Nhập tên khách hàng"
                />
                {customerForm.formState.errors.customerName && (
                  <p className="text-red-500 text-sm mt-1">
                    {customerForm.formState.errors.customerName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="customerPhone">Số điện thoại</Label>
                <Input
                  id="customerPhone"
                  {...customerForm.register("customerPhone")}
                  placeholder="Nhập số điện thoại"
                />
                {customerForm.formState.errors.customerPhone && (
                  <p className="text-red-500 text-sm mt-1">
                    {customerForm.formState.errors.customerPhone.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="customerEmail">Email (tùy chọn)</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  {...customerForm.register("customerEmail")}
                  placeholder="Nhập email nếu có"
                />
                {customerForm.formState.errors.customerEmail && (
                  <p className="text-red-500 text-sm mt-1">
                    {customerForm.formState.errors.customerEmail.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="f1AgentId">F1 Agent</Label>
                <select
                  id="f1AgentId"
                  {...customerForm.register("f1AgentId")}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="">-- Chọn F1 Agent --</option>
                  {members.map((member: any) => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.categoryName})
                    </option>
                  ))}
                </select>
                {customerForm.formState.errors.f1AgentId && (
                  <p className="text-red-500 text-sm mt-1">
                    {customerForm.formState.errors.f1AgentId.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="notes">Ghi chú</Label>
                <Input
                  id="notes"
                  {...customerForm.register("notes")}
                  placeholder="Ghi chú thêm thông tin..."
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={addCustomerMutation.isPending}
              >
                {addCustomerMutation.isPending ? "Đang thêm..." : "Thêm khách hàng"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}