import { WebClient } from "@slack/web-api";
import type { ServiceRegistration } from "@shared/schema";

// Slack notification system
export class NotificationService {
  private slack?: WebClient;

  constructor() {
    if (process.env.SLACK_BOT_TOKEN) {
      this.slack = new WebClient(process.env.SLACK_BOT_TOKEN);
    }
  }

  async sendServiceRegistrationNotification(registration: ServiceRegistration) {
    const notifications = [];

    // Send Slack notification if configured
    if (this.slack && process.env.SLACK_CHANNEL_ID) {
      try {
        const message = this.formatSlackMessage(registration);
        await this.slack.chat.postMessage({
          channel: process.env.SLACK_CHANNEL_ID,
          ...message
        });
        notifications.push('Slack notification sent');
      } catch (error) {
        console.error('Failed to send Slack notification:', error);
      }
    }

    // Log to console (always available)
    console.log('🔔 NEW SERVICE REGISTRATION:');
    console.log(`Parent: ${registration.parentName}`);
    console.log(`Phone: ${registration.parentPhone}`);
    console.log(`Service: ${registration.serviceName}`);
    console.log(`Time: ${registration.preferredTime || 'Not specified'}`);
    console.log(`Notes: ${registration.notes || 'None'}`);
    console.log(`Registered at: ${registration.createdAt}`);
    console.log('---');

    return notifications;
  }

  private formatSlackMessage(registration: ServiceRegistration) {
    return {
      text: `🔔 Đăng ký dịch vụ mới từ phụ huynh`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🔔 ĐĂNG KÝ DỊCH VỤ MỚI'
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*👨‍👩‍👧‍👦 Phụ huynh:*\n${registration.parentName}`
            },
            {
              type: 'mrkdwn',
              text: `*📞 Số điện thoại:*\n${registration.parentPhone}`
            },
            {
              type: 'mrkdwn',
              text: `*🎯 Dịch vụ:*\n${registration.serviceName}`
            },
            {
              type: 'mrkdwn',
              text: `*⏰ Thời gian mong muốn:*\n${registration.preferredTime || 'Không chỉ định'}`
            }
          ]
        },
        ...(registration.parentEmail ? [{
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*📧 Email:*\n${registration.parentEmail}`
            }
          ]
        }] : []),
        ...(registration.notes ? [{
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*💬 Ghi chú:*\n${registration.notes}`
          }
        }] : []),
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `📅 Đăng ký lúc: ${new Date(registration.createdAt).toLocaleString('vi-VN')}`
            }
          ]
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '📞 Gọi lại ngay'
              },
              style: 'primary',
              url: `tel:${registration.parentPhone}`
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '✅ Đánh dấu đã liên hệ'
              },
              style: 'primary',
              value: `mark_contacted_${registration.id}`
            }
          ]
        }
      ]
    };
  }
}

export const notificationService = new NotificationService();