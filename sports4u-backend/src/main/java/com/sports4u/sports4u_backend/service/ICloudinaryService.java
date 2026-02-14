package com.sports4u.sports4u_backend.service;

import org.springframework.web.multipart.MultipartFile;

public interface ICloudinaryService {
    String upload(MultipartFile file) throws RuntimeException;
}
