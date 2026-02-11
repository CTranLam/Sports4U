package com.sports4u.sports4u_backend.service.RabbitMQService;

import com.sports4u.sports4u_backend.configuration.RabbitMQConfig;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class MessageConsumer {

    @RabbitListener(queues = RabbitMQConfig.MAIL_QUEUE)
    public void receiveMessage(String message) {
        System.out.println("Message received from " + RabbitMQConfig.MAIL_EXCHANGE + " : " + message);
    }
}