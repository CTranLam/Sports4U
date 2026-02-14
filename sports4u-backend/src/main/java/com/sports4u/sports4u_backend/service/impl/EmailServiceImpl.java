package com.sports4u.sports4u_backend.service.impl;

import com.sports4u.sports4u_backend.service.IEmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class EmailServiceImpl implements IEmailService {
    private final JavaMailSender javaMailSender;

    @Override
    public void sendEmail(String to, String subject, String content) {
        if (to == null || to.isBlank()) {
            throw new IllegalArgumentException("Email người nhận không được để trống");
        }
        if (subject == null || subject.isBlank()) {
            throw new IllegalArgumentException("Tiêu đề email không được để trống");
        }
        if (content == null || content.isBlank()) {
            throw new IllegalArgumentException("Nội dung email không được để trống");
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(content);
        message.setFrom("tql213598@gmail.com");
        javaMailSender.send(message);
    }
}

