package com.sports4u.sports4u_backend.utils;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageResponse<T> {

    private List<T> content;

    private int pageNumber;
    private int pageSize;

    private long totalElements;
    private int totalPages;

    private boolean last;
}
