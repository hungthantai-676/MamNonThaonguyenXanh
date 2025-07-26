import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, UserCheck, Clock, Users, TrendingUp, Wallet, Star, Gift, ArrowDownLeft, ArrowUpRight, Phone, Mail, Eye, EyeOff } from "lucide-react";
import AffiliateTree from "@/components/affiliate-tree";

// Demo Management Component
const DemoManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const createDemoData = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/demo/create-affiliate-data", {});
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/affiliate/members"] });
      queryClient.invalidateQueries({ queryKey: ["/api/customer-conversions"] });
      toast({
        title: "Tạo dữ liệu demo thành công!",
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
        title: "Xóa dữ liệu demo thành công!",
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

export default function AffiliateSimple() {
  const { data: members = [] } = useQuery({ queryKey: ["/api/affiliate/members"] });
  const { data: customerConversions = [] } = useQuery({ queryKey: ["/api/customer-conversions"] });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Hệ thống Affiliate</h1>
          <p className="text-gray-600">Quản lý mạng lưới tiếp thị liên kết</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Tổng thành viên</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{Array.isArray(members) ? members.length : 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Khách hàng F1</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{Array.isArray(customerConversions) ? customerConversions.length : 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Tổng hoa hồng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">5.000.000 VND</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Chi thành toán</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">4.000.000 VND</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 gap-1">
            <TabsTrigger value="members" className="text-xs md:text-sm">Thành viên</TabsTrigger>
            <TabsTrigger value="customers" className="text-xs md:text-sm">Khách hàng F1</TabsTrigger>
            <TabsTrigger value="payments" className="text-xs md:text-sm">Thanh toán</TabsTrigger>
            <TabsTrigger value="demo" className="text-xs md:text-sm bg-yellow-100 text-yellow-800 font-bold">🧪 Demo Test</TabsTrigger>
            <TabsTrigger value="qr" className="text-xs md:text-sm">QR Code</TabsTrigger>
            <TabsTrigger value="join" className="text-xs md:text-sm">Tham gia</TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Danh sách thành viên</CardTitle>
                <CardDescription>Tất cả thành viên trong hệ thống affiliate</CardDescription>
              </CardHeader>
              <CardContent>
                {Array.isArray(members) && members.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {members.map((member: any) => (
                      <Card key={member.id} className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{member.name}</CardTitle>
                          <Badge variant="secondary">{member.memberType}</Badge>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-1 text-sm">
                            <p><strong>Email:</strong> {member.email}</p>
                            <p><strong>Phone:</strong> {member.phone}</p>
                            <p><strong>QR Code:</strong> {member.qrCode}</p>
                            <p><strong>Balance:</strong> {member.tokenBalance} VND</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Chưa có thành viên nào. Hãy tạo dữ liệu demo để test.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Khách hàng F1</CardTitle>
                <CardDescription>Danh sách khách hàng được giới thiệu</CardDescription>
              </CardHeader>
              <CardContent>
                {Array.isArray(customerConversions) && customerConversions.length > 0 ? (
                  <div className="space-y-4">
                    {customerConversions.map((customer: any) => (
                      <Card key={customer.id} className="border-l-4 border-l-green-500">
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{customer.customerName}</h4>
                              <p className="text-sm text-gray-600">{customer.customerEmail}</p>
                              <p className="text-sm text-gray-600">{customer.customerPhone}</p>
                            </div>
                            <Badge className={customer.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                              {customer.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Chưa có khách hàng F1 nào. Hãy tạo dữ liệu demo để test.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="demo" className="space-y-4">
            <DemoManagement />
          </TabsContent>

          <TabsContent value="qr" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>QR Code Test</CardTitle>
                <CardDescription>Test QR code scanning và tham gia affiliate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <QrCode className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">QR Code functionality sẽ được test ở đây</p>
                  <Button 
                    className="mt-4"
                    onClick={() => window.open('/affiliate-join?ref=DEMO_QR_001', '_blank')}
                  >
                    Test QR Join Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý thanh toán</CardTitle>
                <CardDescription>Xử lý thanh toán hoa hồng cho thành viên</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Chức năng thanh toán sẽ hiển thị ở đây
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="join" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tham gia Affiliate</CardTitle>
                <CardDescription>Form đăng ký thành viên affiliate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Form tham gia affiliate sẽ hiển thị ở đây
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}