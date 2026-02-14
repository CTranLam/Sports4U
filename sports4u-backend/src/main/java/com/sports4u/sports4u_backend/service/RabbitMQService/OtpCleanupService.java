package com.sports4u.sports4u_backend.service.RabbitMQService;

import com.sports4u.sports4u_backend.repository.PasswordResetOtpRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class OtpCleanupService {

    private final PasswordResetOtpRepository passwordResetOtpRepository;

    @Transactional
    @Scheduled(cron = "0 0/30 * * * ?")
    public void deleteExpiredOtps() {
        passwordResetOtpRepository.deleteByExpirationTimeBefore(LocalDateTime.now());
        System.out.println("Expired OTPs cleaned at " + LocalDateTime.now());
    }
}

