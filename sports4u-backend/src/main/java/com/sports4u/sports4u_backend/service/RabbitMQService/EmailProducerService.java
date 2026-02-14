package com.sports4u.sports4u_backend.service.RabbitMQService;

import com.sports4u.sports4u_backend.configuration.RabbitMQConfig;
import com.sports4u.sports4u_backend.dto.userdto.EmailMessageDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailProducerService {

    private final RabbitTemplate rabbitTemplate;

    @Async
    public void sendEmailAsync(EmailMessageDTO emailMessageDTO) {
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.MAIL_EXCHANGE,
                RabbitMQConfig.MAIL_ROUTING_KEY,
                emailMessageDTO
        );
    }
}