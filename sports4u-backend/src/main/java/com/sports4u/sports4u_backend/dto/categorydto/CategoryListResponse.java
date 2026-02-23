package com.sports4u.sports4u_backend.dto.categorydto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CategoryListResponse {
    private List<CategoryDTO> categories;
}

