package com.sports4u.sports4u_backend.dto.admindto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrdersLast7DaysDTO {
    private String date;
    private long count;
}
