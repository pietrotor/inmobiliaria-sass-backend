import { Global, Module } from '@nestjs/common';
import { EmailNotificationService } from './email-notification.service';
import { NOTIFICATION_SERVICE } from '@domain/common/services/notification.service';

@Global()
@Module({
  providers: [
    {
      provide: NOTIFICATION_SERVICE,
      useClass: EmailNotificationService,
    },
  ],
  exports: [NOTIFICATION_SERVICE],
})
export class NotificationsModule {}
