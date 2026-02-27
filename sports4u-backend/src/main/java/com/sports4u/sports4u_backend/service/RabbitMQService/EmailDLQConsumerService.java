package com.sports4u.sports4u_backend.service.RabbitMQService;

import com.sports4u.sports4u_backend.configuration.RabbitMQConfig;
import com.sports4u.sports4u_backend.dto.userdto.EmailMessageDTO;
import com.sports4u.sports4u_backend.enums.OtpStatus;
import com.sports4u.sports4u_backend.repository.PasswordResetOtpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class EmailDLQConsumerService {

    private final PasswordResetOtpRepository passwordResetOtpRepository;

    @RabbitListener(queues = RabbitMQConfig.MAIL_DLQ, containerFactory = "mailListenerFactory")
    public void handleDLQ(EmailMessageDTO dto) {
        // Set status = fail
        System.out.println("DLQ: Email failed for " + dto.getTo() + ", OTP ID: " + dto.getOtpId());
        passwordResetOtpRepository.findById(dto.getOtpId())
                .ifPresent(otp -> {
                    otp.setStatus(OtpStatus.FAILED);
                    passwordResetOtpRepository.save(otp);
                });

    }
}

