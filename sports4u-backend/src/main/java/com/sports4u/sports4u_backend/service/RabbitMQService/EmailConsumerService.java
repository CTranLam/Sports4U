package com.sports4u.sports4u_backend.service.RabbitMQService;

import com.sports4u.sports4u_backend.configuration.RabbitMQConfig;
import com.sports4u.sports4u_backend.dto.EmailMessageDTO;
import com.sports4u.sports4u_backend.entity.PasswordResetOTPEntity;
import com.sports4u.sports4u_backend.enums.OtpStatus;
import com.sports4u.sports4u_backend.repository.PasswordResetOtpRepository;
import com.sports4u.sports4u_backend.service.IEmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class EmailConsumerService {

    private final IEmailService emailService;
    private final PasswordResetOtpRepository passwordResetOtpRepository;

    @RabbitListener(
            queues = RabbitMQConfig.MAIL_QUEUE,
            containerFactory = "mailListenerFactory"
    )
    public void handleEmailMessage(EmailMessageDTO dto) {

        try {

            emailService.sendEmail(
                    dto.getTo(),
                    dto.getSubject(),
                    dto.getContent()
            );

            passwordResetOtpRepository.findById(dto.getOtpId())
                    .ifPresent(otp -> {
                        otp.setStatus(OtpStatus.SENT);
                        passwordResetOtpRepository.save(otp);
                    });

            System.out.println("Sent email to " + dto.getTo());

        } catch (Exception e) {
            System.out.println("Error sending email to " + dto.getTo());
            throw new RuntimeException("Email sending failed", e);
        }
    }
}
