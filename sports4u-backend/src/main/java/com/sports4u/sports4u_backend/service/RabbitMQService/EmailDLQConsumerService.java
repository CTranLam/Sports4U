package com.sports4u.sports4u_backend.service.RabbitMQService;

import com.sports4u.sports4u_backend.configuration.RabbitMQConfig;
import com.sports4u.sports4u_backend.dto.EmailMessageDTO;
import com.sports4u.sports4u_backend.enums.OtpStatus;
import com.sports4u.sports4u_backend.repository.PasswordResetOtpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class EmailDLQConsumerService {

    private final PasswordResetOtpRepository passwordResetOtpRepository;

    @RabbitListener(queues = RabbitMQConfig.MAIL_DLQ)
    public void handleDLQ(EmailMessageDTO dto) {
        // Set status = fail
        System.out.println("Handling email dlq received from " + dto.getTo());
        passwordResetOtpRepository.findById(dto.getOtpId())
                .ifPresent(otp -> {
                    otp.setStatus(OtpStatus.FAILED);
                    passwordResetOtpRepository.save(otp);
                });

    }
}

