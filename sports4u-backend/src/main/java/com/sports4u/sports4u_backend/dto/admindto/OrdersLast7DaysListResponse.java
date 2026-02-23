package com.sports4u.sports4u_backend.dto.admindto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrdersLast7DaysListResponse {
    private List<OrdersLast7DaysDTO> orders;
}

