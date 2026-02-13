package com.sports4u.sports4u_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="category_id")
    private Long categoryId;

    @Column(name = "name", nullable = false, length = 100)
    private String categoryName;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

}
