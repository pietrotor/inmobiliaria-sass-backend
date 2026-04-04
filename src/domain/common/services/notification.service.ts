export interface SendNotificationParams {
  to: string;
  subject: string;
  body: string;
  html?: string;
}

export interface NotificationService {
  sendEmail(params: SendNotificationParams): Promise<void>;
}

export const NOTIFICATION_SERVICE = 'NOTIFICATION_SERVICE';
