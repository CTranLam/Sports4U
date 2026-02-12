package com.sports4u.sports4u_backend.service.Redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RateLimitLoginService {
    private final StringRedisTemplate redisTemplate;
    private final AccountLockService accountLockService;

    private static final int MAX_ATTEMPT = 4;
    private static final long LOCK_TIME = 15; // minutes

    public void loginFailed(String email) {
        String key = "login:fail:" + email;
        Long attempts = redisTemplate.opsForValue().increment(key);
        // set expire khi lần đầu fail
        if (attempts != null && attempts == 1) {
            redisTemplate.expire(key, LOCK_TIME, TimeUnit.MINUTES);
        }
        System.out.println("Attempts: " + attempts);
        if (attempts != null && attempts > MAX_ATTEMPT) {
            accountLockService.lockAccount(email);
        }
    }

    public void loginSucceeded(String email) {
        String key = "login:fail:" + email;
        redisTemplate.delete(key);
    }
}
