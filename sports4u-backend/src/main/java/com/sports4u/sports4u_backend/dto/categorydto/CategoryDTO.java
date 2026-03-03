package com.sports4u.sports4u_backend.dto.categorydto;

import lombok.*;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CategoryDTO {
    private Long categoryId;
    private String categoryName;
    private Long productCount;
    private Long parentId;
}