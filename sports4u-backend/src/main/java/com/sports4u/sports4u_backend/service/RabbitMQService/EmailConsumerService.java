package com.sports4u.sports4u_backend.service.RabbitMQService;

import com.sports4u.sports4u_backend.configuration.RabbitMQConfig;
import com.sports4u.sports4u_backend.dto.EmailMessageDTO;
import com.sports4u.sports4u_backend.service.IEmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class EmailConsumerService {

    private final IEmailService emailService;

    @RabbitListener(
            queues = RabbitMQConfig.QUEUE_NAME,
            containerFactory = "mailListenerFactory"
    )
    public void handleEmailMessage(EmailMessageDTO dto) {

        System.out.println("Received email to: " + dto.getTo());
        try {
            emailService.sendEmail(
                    dto.getTo(),
                    dto.getSubject(),
                    dto.getContent()
            );
            System.out.println("Email sent successfully!");

        } catch (Exception e) {
            System.out.println("Email failed: " + e.getMessage());
            throw new RuntimeException("Email sending failed", e);
        }
    }
}
