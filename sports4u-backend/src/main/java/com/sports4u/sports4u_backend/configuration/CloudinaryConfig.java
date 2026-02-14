package com.sports4u.sports4u_backend.configuration;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(Map.of(
                "cloud_name", "dfnsu6tf4",
                "api_key", "662197253735923",
                "api_secret", "9A-4UmwbDFeEia2oa1pbP5iPRTQ"
        ));
    }
}
