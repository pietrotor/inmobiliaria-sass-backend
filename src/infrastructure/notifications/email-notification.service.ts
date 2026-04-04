import { Injectable, Logger } from '@nestjs/common';
import {
  NotificationService,
  SendNotificationParams,
} from '@domain/common/services/notification.service';

@Injectable()
export class EmailNotificationService implements NotificationService {
  private readonly logger = new Logger(EmailNotificationService.name);

  async sendEmail(params: SendNotificationParams): Promise<void> {
    this.logger.log(
      `[EMAIL] To: ${params.to} | Subject: ${params.subject} | Body: ${params.body.substring(0, 100)}...`,
    );
    // TODO: Integrate with AWS SES or SendGrid for production
  }
}
