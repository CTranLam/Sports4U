package com.sports4u.sports4u_backend.dto.categorydto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryRequestDTO {
    @NotBlank(message = "Tên danh mục không được để trống")
    private String categoryName;

    private Long parentId;
}
