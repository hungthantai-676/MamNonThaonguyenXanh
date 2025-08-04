import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, Wallet, Users, TrendingUp, QrCode, Copy, Plus, 
  Eye, Edit3, CheckCircle, Clock, AlertCircle, Download 
} from "lucide-react";

// Types
interface AffiliateMember {
  memberId: string;
  username: string;
  name: string;
  memberType: string;
  categoryName: string;
  referralLink: string;
  qrCode: string;
  walletAddress: string;
  tokenBalance: string;
  totalReferrals: number;
  level: number;
}

interface CustomerConversion {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  conversionStatus: 'potential' | 'high_conversion' | 'payment_completed';
  paymentAmount?: number;
  notes?: string;
  createdAt: string;
  confirmedAt?: string;
}

interface DashboardData {
  member: AffiliateMember;
  customers: CustomerConversion[];
  totalCommission: number;
  monthlyStats: {
    newCustomers: number;
    completedPayments: number;
    totalRevenue: number;
  };
}

// Schemas
const customerSchema = z.object({
  customerName: z.string().min(2, "Tên khách hàng phải có ít nhất 2 ký tự"),
  customerPhone: z.string().min(10, "Số điện thoại không hợp lệ"),
  customerEmail: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  notes: z.string().optional()
});

type CustomerForm = z.infer<typeof customerSchema>;

const updateCustomerSchema = z.object({
  conversionStatus: z.enum(['potential', 'high_conversion', 'payment_completed']),
  paymentAmount: z.string().optional(),
  notes: z.string().optional()
});

type UpdateCustomerForm = z.infer<typeof updateCustomerSchema>;

export default function AffiliateDashboard() {
  const [memberId, setMemberId] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerConversion | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get member ID from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const memberParam = urlParams.get('member');
    if (memberParam) {
      setMemberId(memberParam);
    }
  }, []);

  // Dashboard data query
  const { data: dashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/affiliate/dashboard", memberId],
    enabled: !!memberId,
  });

  // Add customer form
  const customerForm = useForm<CustomerForm>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      notes: ""
    }
  });

  // Update customer form
  const updateForm = useForm<UpdateCustomerForm>({
    resolver: zodResolver(updateCustomerSchema),
    defaultValues: {
      conversionStatus: 'potential',
      paymentAmount: "",
      notes: ""
    }
  });

  // Add customer mutation
  const addCustomerMutation = useMutation({
    mutationFn: async (data: CustomerForm) => {
      const response = await apiRequest("POST", "/api/affiliate/add-customer", {
        f1AgentId: memberId,
        ...data
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Thêm khách hàng thành công!",
        description: "Khách hàng đã được thêm vào hệ thống",
      });
      customerForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/affiliate/dashboard", memberId] });
    },
    onError: (error: any) => {
      toast({
        title: "Thêm khách hàng thất bại",
        description: error.message || "Có lỗi xảy ra, vui lòng thử lại",
        variant: "destructive",
      });
    }
  });

  // Update customer mutation
  const updateCustomerMutation = useMutation({
    mutationFn: async (data: UpdateCustomerForm & { customerId: string }) => {
      const { customerId, ...updateData } = data;
      const response = await apiRequest("PUT", `/api/affiliate/update-customer/${customerId}`, updateData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Cập nhật thành công!",
        description: "Thông tin khách hàng đã được cập nhật",
      });
      setSelectedCustomer(null);
      queryClient.invalidateQueries({ queryKey: ["/api/affiliate/dashboard", memberId] });
    },
    onError: (error: any) => {
      toast({
        title: "Cập nhật thất bại",
        description: error.message || "Có lỗi xảy ra, vui lòng thử lại",
        variant: "destructive",
      });
    }
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Đã sao chép!",
      description: "Nội dung đã được sao chép vào clipboard",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'potential': return 'bg-red-100 text-red-800';
      case 'high_conversion': return 'bg-yellow-100 text-yellow-800';
      case 'payment_completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'potential': return <AlertCircle className="w-4 h-4" />;
      case 'high_conversion': return <Clock className="w-4 h-4" />;
      case 'payment_completed': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'potential': return 'Tiềm năng';
      case 'high_conversion': return 'Có thể chuyển đổi';
      case 'payment_completed': return 'Đã thanh toán';
      default: return 'Không xác định';
    }
  };

  const onAddCustomer = (data: CustomerForm) => {
    addCustomerMutation.mutate(data);
  };

  const onUpdateCustomer = (data: UpdateCustomerForm) => {
    if (selectedCustomer) {
      updateCustomerMutation.mutate({
        customerId: selectedCustomer.customerId,
        ...data,
        paymentAmount: data.paymentAmount ? parseInt(data.paymentAmount) : undefined
      });
    }
  };

  if (!memberId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Vui lòng đăng nhập</h2>
            <p className="text-gray-600 mb-4">Bạn cần đăng nhập để truy cập dashboard</p>
            <Button onClick={() => window.location.href = '/affiliate-login'}>
              Đăng nhập
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-green border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Không tìm thấy dữ liệu</h2>
            <p className="text-gray-600 mb-4">Vui lòng thử lại sau</p>
            <Button onClick={() => window.location.reload()}>
              Tải lại
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary-green to-green-600 text-white rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                  <User className="w-6 h-6" />
                  Dashboard Affiliate
                </h1>
                <p className="mt-1">Chào mừng, <strong>{dashboardData.member.name}</strong> ({dashboardData.member.memberId})</p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {dashboardData.member.memberType === 'teacher' ? 'Giáo viên' : 'Phụ huynh'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-blue-600 mb-2">
                <Users className="w-8 h-8 mx-auto" />
              </div>
              <div className="text-2xl font-bold">{dashboardData.member.totalReferrals}</div>
              <div className="text-gray-600">Tổng giới thiệu</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-green-600 mb-2">
                <Wallet className="w-8 h-8 mx-auto" />
              </div>
              <div className="text-2xl font-bold">{parseFloat(dashboardData.member.tokenBalance).toFixed(2)}</div>
              <div className="text-gray-600">Số dư token</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-purple-600 mb-2">
                <TrendingUp className="w-8 h-8 mx-auto" />
              </div>
              <div className="text-2xl font-bold">{dashboardData.monthlyStats.newCustomers}</div>
              <div className="text-gray-600">KH mới tháng này</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-orange-600 mb-2">
                <CheckCircle className="w-8 h-8 mx-auto" />
              </div>
              <div className="text-2xl font-bold">{dashboardData.monthlyStats.completedPayments}</div>
              <div className="text-gray-600">Đã chuyển đổi</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="customers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="customers">Quản lý khách hàng</TabsTrigger>
            <TabsTrigger value="tools">Công cụ marketing</TabsTrigger>
            <TabsTrigger value="wallet">Ví điện tử</TabsTrigger>
          </TabsList>

          {/* Customer Management */}
          <TabsContent value="customers" className="space-y-6">
            {/* Add Customer Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Thêm khách hàng mới
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...customerForm}>
                  <form onSubmit={customerForm.handleSubmit(onAddCustomer)} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={customerForm.control}
                        name="customerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tên khách hàng *</FormLabel>
                            <FormControl>
                              <Input placeholder="Nhập tên khách hàng" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={customerForm.control}
                        name="customerPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Số điện thoại *</FormLabel>
                            <FormControl>
                              <Input placeholder="Nhập số điện thoại" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={customerForm.control}
                        name="customerEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Nhập email (không bắt buộc)" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={customerForm.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ghi chú</FormLabel>
                            <FormControl>
                              <Input placeholder="Ghi chú thêm" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="bg-primary-green hover:bg-green-600"
                      disabled={addCustomerMutation.isPending}
                    >
                      {addCustomerMutation.isPending ? "Đang thêm..." : "Thêm khách hàng"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Customer List */}
            <Card>
              <CardHeader>
                <CardTitle>Danh sách khách hàng</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.customers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Chưa có khách hàng nào</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.customers.map((customer) => (
                      <div key={customer.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold">{customer.customerName}</h3>
                              <Badge className={getStatusColor(customer.conversionStatus)}>
                                {getStatusIcon(customer.conversionStatus)}
                                <span className="ml-1">{getStatusText(customer.conversionStatus)}</span>
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>📞 {customer.customerPhone}</p>
                              {customer.customerEmail && <p>📧 {customer.customerEmail}</p>}
                              {customer.notes && <p>📝 {customer.notes}</p>}
                              {customer.paymentAmount && (
                                <p>💰 {customer.paymentAmount.toLocaleString()} VND</p>
                              )}
                              <p>📅 {new Date(customer.createdAt).toLocaleDateString('vi-VN')}</p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedCustomer(customer)}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Marketing Tools */}
          <TabsContent value="tools" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* QR Code */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="w-5 h-5" />
                    QR Code giới thiệu
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  {dashboardData.member.qrCode && (
                    <div className="space-y-4">
                      <img 
                        src={dashboardData.member.qrCode} 
                        alt="QR Code" 
                        className="mx-auto w-48 h-48 border rounded-lg"
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = dashboardData.member.qrCode;
                          link.download = `QR-${dashboardData.member.memberId}.png`;
                          link.click();
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Tải QR Code
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Referral Link */}
              <Card>
                <CardHeader>
                  <CardTitle>Link giới thiệu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Input
                      value={dashboardData.member.referralLink}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      onClick={() => copyToClipboard(dashboardData.member.referralLink)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">💡 Cách sử dụng</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Chia sẻ link hoặc QR code với khách hàng</li>
                      <li>• Khách hàng truy cập website qua link của bạn</li>
                      <li>• Thêm thông tin khách hàng vào hệ thống</li>
                      <li>• Theo dõi tiến trình chuyển đổi</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Wallet */}
          <TabsContent value="wallet" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Ví điện tử cá nhân
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Địa chỉ ví:</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono flex-1 break-all">
                        {dashboardData.member.walletAddress}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(dashboardData.member.walletAddress)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Số dư token:</label>
                    <div className="text-2xl font-bold text-green-600 mt-1">
                      {parseFloat(dashboardData.member.tokenBalance).toFixed(8)}
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">🏆 Hệ thống thưởng</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {dashboardData.member.memberType === 'teacher' ? (
                      <>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">2,000,000 VND</div>
                          <div className="text-sm text-gray-600">Mỗi học sinh</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">10,000,000 VND</div>
                          <div className="text-sm text-gray-600">Bonus mỗi 5 học sinh</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">2,000 điểm</div>
                          <div className="text-sm text-gray-600">Mỗi học sinh</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-600">10,000 điểm</div>
                          <div className="text-sm text-gray-600">Bonus mỗi 5 học sinh</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Update Customer Modal/Form */}
        {selectedCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Cập nhật khách hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...updateForm}>
                  <form onSubmit={updateForm.handleSubmit(onUpdateCustomer)} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Khách hàng:</label>
                      <p className="font-semibold">{selectedCustomer.customerName}</p>
                    </div>

                    <FormField
                      control={updateForm.control}
                      name="conversionStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trạng thái</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={selectedCustomer.conversionStatus}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="potential">Tiềm năng (Đỏ)</SelectItem>
                              <SelectItem value="high_conversion">Có thể chuyển đổi (Vàng)</SelectItem>
                              <SelectItem value="payment_completed">Đã thanh toán (Xanh)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={updateForm.control}
                      name="paymentAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số tiền thanh toán (VND)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Nhập số tiền" 
                              {...field}
                              defaultValue={selectedCustomer.paymentAmount?.toString() || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={updateForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ghi chú</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Ghi chú cập nhật" 
                              {...field}
                              defaultValue={selectedCustomer.notes || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2 pt-4">
                      <Button
                        type="submit"
                        className="flex-1 bg-primary-green hover:bg-green-600"
                        disabled={updateCustomerMutation.isPending}
                      >
                        {updateCustomerMutation.isPending ? "Đang cập nhật..." : "Cập nhật"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setSelectedCustomer(null)}
                      >
                        Hủy
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}