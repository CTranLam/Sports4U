package com.sports4u.sports4u_backend.service;

public interface IEmailService {
    void sendEmail(String to, String subject, String content) throws RuntimeException;
}
