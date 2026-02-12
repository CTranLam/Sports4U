package com.sports4u.sports4u_backend.service.Redis;

import com.sports4u.sports4u_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AccountLockService {
    private final UserRepository userRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void lockAccount(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            user.setStatus(0L);
            userRepository.save(user);
        });
    }
}

