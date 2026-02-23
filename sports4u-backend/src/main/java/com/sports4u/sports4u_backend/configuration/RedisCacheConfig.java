package com.sports4u.sports4u_backend.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class RedisCacheConfig {

    // Component quản lý tất cả cache
    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory factory) {

        RedisCacheConfiguration productCacheConfig =
                RedisCacheConfiguration.defaultCacheConfig()
                        .entryTtl(Duration.ofMinutes(30))
                        .serializeValuesWith(
                                RedisSerializationContext.SerializationPair
                                        .fromSerializer(new GenericJackson2JsonRedisSerializer())
                        );
        RedisCacheConfiguration dashboardCacheConfig =
                RedisCacheConfiguration.defaultCacheConfig()
                        .entryTtl(Duration.ofMinutes(10))
                        .serializeValuesWith(
                                RedisSerializationContext.SerializationPair
                                        .fromSerializer(new GenericJackson2JsonRedisSerializer())
                        );

        RedisCacheConfiguration addressCacheConfig =
                RedisCacheConfiguration.defaultCacheConfig()
                        .entryTtl(Duration.ofHours(24))
                        .serializeValuesWith(
                                RedisSerializationContext.SerializationPair
                                        .fromSerializer(new GenericJackson2JsonRedisSerializer())
                        );

        Map<String, RedisCacheConfiguration> configs = new HashMap<>();
        // Product & category caches
        configs.put("productDetail", productCacheConfig);
        configs.put("productList", productCacheConfig);
        configs.put("categoryList", productCacheConfig);

        // Dashboard caches
        configs.put("dashboardSummary", dashboardCacheConfig);
        configs.put("revenueByMonth", dashboardCacheConfig);
        configs.put("productByCategory", dashboardCacheConfig);
        configs.put("ordersLast7Days", dashboardCacheConfig);

        // Address caches
        configs.put("provinces", addressCacheConfig);
        configs.put("wards", addressCacheConfig);

        return RedisCacheManager.builder(factory)
                .withInitialCacheConfigurations(configs)
                .build();
    }
}
