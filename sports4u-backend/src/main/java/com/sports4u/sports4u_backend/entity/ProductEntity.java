package com.sports4u.sports4u_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="product_id")
    private Long productId;

    @Column(name = "name", nullable = false, length = 200)
    private String productName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private CategoryEntity categoryEntity;

    @Column(name="description", length = 1000)
    private String description;

    @Column(name="origin", length = 100)
    private String origin;

    @Column(name="advantages", length = 1000)
    private String advantages;

    @Column(name="price", nullable = false, precision = 15, scale = 2)
    private BigDecimal price;

    @Column(name="stock_quantity", nullable = false)
    private Long stockQuantity;

    @Column(name="image_url", length = 500)
    private String imageUrl;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @Column(name = "is_popular", nullable = false)
    private Boolean isPopular = false;

}
