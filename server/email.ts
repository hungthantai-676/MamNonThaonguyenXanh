import nodemailer from 'nodemailer';
import type { ServiceRegistration } from '@shared/schema';

// Email configuration using Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'Mamnonthaonguyenxanh2019@gmail.com',
      pass: process.env.EMAIL_APP_PASSWORD // Gmail App Password
    }
  });
};

export async function sendServiceRegistrationEmail(registration: ServiceRegistration) {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'Mamnonthaonguyenxanh2019@gmail.com',
      to: 'Mamnonthaonguyenxanh2019@gmail.com',
      subject: `🔔 Đăng ký dịch vụ mới: ${registration.serviceName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2E7D32; text-align: center; margin-bottom: 30px;">
            🔔 Đăng ký dịch vụ mới từ phụ huynh
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #1976D2; margin-top: 0;">📋 Thông tin đăng ký</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #666;">Tên phụ huynh:</td>
                <td style="padding: 8px 0; color: #333;">${registration.parentName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #666;">Số điện thoại:</td>
                <td style="padding: 8px 0; color: #333;">${registration.parentPhone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #666;">Email:</td>
                <td style="padding: 8px 0; color: #333;">${registration.parentEmail}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #666;">Dịch vụ:</td>
                <td style="padding: 8px 0; color: #333; font-weight: bold;">${registration.serviceName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #666;">Thời gian mong muốn:</td>
                <td style="padding: 8px 0; color: #333;">${registration.preferredTime}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #666;">Thời gian đăng ký:</td>
                <td style="padding: 8px 0; color: #333;">${new Date(registration.createdAt).toLocaleString('vi-VN')}</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #F57C00; margin-top: 0;">💬 Ghi chú từ phụ huynh</h3>
            <p style="color: #333; line-height: 1.5; margin: 0; font-style: italic;">
              "${registration.notes}"
            </p>
          </div>
          
          <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; text-align: center;">
            <h3 style="color: #2E7D32; margin-top: 0;">⚡ Hành động cần thực hiện</h3>
            <p style="color: #333; margin-bottom: 15px;">
              Vui lòng liên hệ phụ huynh trong vòng 24h để sắp xếp lịch tư vấn
            </p>
            <p style="color: #666; font-size: 14px; margin: 0;">
              Bạn có thể quản lý đăng ký này tại: 
              <a href="https://your-domain.com/admin" style="color: #1976D2;">Admin Dashboard</a>
            </p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('📧 Email notification sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('❌ Failed to send email notification:', error);
    return false;
  }
}

// Send password reset email function
export async function sendPasswordResetEmail(userEmail: string, tempPassword: string, username: string) {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'Mamnonthaonguyenxanh2019@gmail.com',
      to: userEmail,
      subject: '🔑 Lấy lại mật khẩu - Mầm Non Thảo Nguyên Xanh',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2E7D32; text-align: center; margin-bottom: 30px;">
            🔑 Lấy lại mật khẩu tài khoản Affiliate
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #1976D2; margin-top: 0;">📋 Thông tin đăng nhập mới</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #666;">Tên đăng nhập:</td>
                <td style="padding: 8px 0; color: #333; font-weight: bold;">${username}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #666;">Mật khẩu tạm thời:</td>
                <td style="padding: 8px 0; color: #d32f2f; font-weight: bold; font-size: 18px;">${tempPassword}</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #F57C00; margin-top: 0;">⚠️ Lưu ý quan trọng</h3>
            <ul style="color: #333; line-height: 1.6;">
              <li>Mật khẩu này chỉ có hiệu lực trong 24 giờ</li>
              <li>Vui lòng đăng nhập và đổi mật khẩu mới ngay</li>
              <li>Không chia sẻ thông tin này với ai khác</li>
            </ul>
          </div>
          
          <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; text-align: center;">
            <h3 style="color: #2E7D32; margin-top: 0;">🚀 Đăng nhập ngay</h3>
            <p style="color: #333; margin-bottom: 15px;">
              Nhấn vào link dưới để đăng nhập với mật khẩu tạm thời
            </p>
            <a href="${process.env.NODE_ENV === 'production' ? 'https://mamnonthaonguyenxanh.com' : 'http://localhost:5000'}/affiliate-login" 
               style="display: inline-block; background-color: #2E7D32; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Đăng nhập ngay
            </a>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              Email này được gửi từ hệ thống Mầm Non Thảo Nguyên Xanh<br>
              Thời gian: ${new Date().toLocaleString('vi-VN')}
            </p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('📧 Password reset email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    return false;
  }
}

// Test email function
export async function sendTestEmail() {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'Mamnonthaonguyenxanh2019@gmail.com',
      to: 'Mamnonthaonguyenxanh2019@gmail.com',
      subject: '🧪 Test Email - Hệ thống thông báo hoạt động',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2E7D32; text-align: center;">
            🧪 Email Test Thành Công!
          </h2>
          <p style="color: #333; text-align: center; font-size: 16px;">
            Hệ thống gửi email tự động đã được thiết lập thành công.<br>
            Từ giờ trở đi, mọi đăng ký dịch vụ sẽ được gửi về email này.
          </p>
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666; font-size: 14px;">
              Thời gian test: ${new Date().toLocaleString('vi-VN')}
            </p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('📧 Test email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('❌ Failed to send test email:', error);
    return false;
  }
}