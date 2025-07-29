import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAdmissionFormSchema, type InsertAdmissionForm } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function AdmissionForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<InsertAdmissionForm>({
    resolver: zodResolver(insertAdmissionFormSchema),
    defaultValues: {
      parentName: "",
      parentPhone: "",
      parentEmail: "",
      childName: "",
      childAge: "",
      desiredClass: "",
      notes: "",
    },
  });

  const submitAdmission = useMutation({
    mutationFn: async (data: InsertAdmissionForm) => {
      const response = await apiRequest("POST", "/api/admission-forms", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Đăng ký thành công!",
        description: "Chúng tôi sẽ liên hệ qua Zalo 0856318686 hoặc email Mamnonthaonguyenxanh2019@gmail.com",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/admission-forms"] });
    },
    onError: () => {
      toast({
        title: "Có lỗi xảy ra",
        description: "Vui lòng thử lại sau.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertAdmissionForm) => {
    submitAdmission.mutate(data);
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg">
      <h3 className="font-semibold text-2xl text-dark-gray mb-6">Đăng ký tuyển sinh</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="parentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ tên phụ huynh</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập họ tên" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parentPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Nhập số điện thoại" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="parentEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Nhập email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="childName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên con</FormLabel>
                  <FormControl>
                    <Input placeholder="Tên con" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="childAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tuổi</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tuổi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="6-12 tháng">6-12 tháng</SelectItem>
                      <SelectItem value="1-2 tuổi">1-2 tuổi</SelectItem>
                      <SelectItem value="2-3 tuổi">2-3 tuổi</SelectItem>
                      <SelectItem value="3-4 tuổi">3-4 tuổi</SelectItem>
                      <SelectItem value="4-5 tuổi">4-5 tuổi</SelectItem>
                      <SelectItem value="5-6 tuổi">5-6 tuổi</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="desiredClass"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lớp muốn đăng ký</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn lớp" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Lớp nhà trẻ">Lớp nhà trẻ</SelectItem>
                    <SelectItem value="Lớp mẫu giáo">Lớp mẫu giáo</SelectItem>
                    <SelectItem value="Lớp lớn">Lớp lớn</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ghi chú</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Ghi chú thêm (nếu có)" 
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full bg-primary-green hover:bg-primary-green/90 text-white"
            disabled={submitAdmission.isPending}
          >
            {submitAdmission.isPending ? "Đang gửi..." : "Đăng ký ngay"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
