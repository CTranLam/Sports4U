package com.sports4u.sports4u_backend.service.impl;

import com.sports4u.sports4u_backend.converter.ReviewEntityToDTO;
import com.sports4u.sports4u_backend.dto.reviewdto.CreateReviewRequestDTO;
import com.sports4u.sports4u_backend.dto.reviewdto.ProductRatingSummaryDTO;
import com.sports4u.sports4u_backend.dto.reviewdto.ReviewDTO;
import com.sports4u.sports4u_backend.entity.ProductEntity;
import com.sports4u.sports4u_backend.entity.ReviewEntity;
import com.sports4u.sports4u_backend.entity.UserEntity;
import com.sports4u.sports4u_backend.repository.OrderRepository;
import com.sports4u.sports4u_backend.repository.ProductRepository;
import com.sports4u.sports4u_backend.repository.ReviewRepository;
import com.sports4u.sports4u_backend.repository.UserRepository;
import com.sports4u.sports4u_backend.service.IReviewService;
import com.sports4u.sports4u_backend.utils.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements IReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    @Override
    @Transactional
    public ReviewDTO createReview(String email, CreateReviewRequestDTO request) throws IllegalArgumentException {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản người dùng"));

        ProductEntity product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sản phẩm"));

        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new IllegalArgumentException("Điểm đánh giá phải từ 1 đến 5 sao");
        }

        // Kiểm tra xem user đã mua sản phẩm này chưa và đơn hàng đã COMPLETED chưa
        boolean hasPurchased = orderRepository.hasCompletedOrderWithProduct(user.getUserId(), product.getProductId());
        if (!hasPurchased) {
            throw new IllegalArgumentException("Bạn chỉ có thể đánh giá sản phẩm sau khi đã mua hàng thành công.");
        }

        ReviewEntity review = ReviewEntity.builder()
                .product(product)
                .user(user)
                .rating(request.getRating())
                .comment(request.getComment())
                .createdAt(LocalDateTime.now())
                .build();

        ReviewEntity savedReview = reviewRepository.save(review);
        return ReviewEntityToDTO.convertToReviewDTO(savedReview);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ReviewDTO> getReviewsByProduct(Long productId, int page, int size)
            throws IllegalArgumentException {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());
        Page<ReviewEntity> reviewPage = reviewRepository.findByProduct_ProductId(productId, pageable);

        List<ReviewDTO> reviews = reviewPage.getContent().stream()
                .map(ReviewEntityToDTO::convertToReviewDTO)
                .toList();

        return PageResponse.<ReviewDTO>builder()
                .content(reviews)
                .pageNumber(reviewPage.getNumber() + 1)
                .pageSize(reviewPage.getSize())
                .totalElements(reviewPage.getTotalElements())
                .totalPages(reviewPage.getTotalPages())
                .last(reviewPage.isLast())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public ProductRatingSummaryDTO getRatingSummary(Long productId) throws IllegalArgumentException {
        Double avgRating = reviewRepository.getAverageRatingByProductId(productId);
        Long totalReviews = reviewRepository.countByProduct_ProductId(productId);

        return ProductRatingSummaryDTO.builder()
                .averageRating(avgRating != null ? avgRating : 0.0)
                .totalReviews(totalReviews)
                .build();
    }
}
