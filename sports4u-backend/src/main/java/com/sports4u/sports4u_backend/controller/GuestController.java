package com.sports4u.sports4u_backend.controller;

import com.sports4u.sports4u_backend.dto.CategoryDTO;
import com.sports4u.sports4u_backend.dto.CategoryRequestDTO;
import com.sports4u.sports4u_backend.service.ICategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class GuestController {

    private final ICategoryService categoryService;

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDTO>> getCategories() {
        List<CategoryDTO> categories = categoryService.getAllCategories();

        return ResponseEntity.ok(categories);
    }
}
