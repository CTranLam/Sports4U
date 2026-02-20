package com.sports4u.sports4u_backend.dto.admindto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrdersLast7DaysDTO {
    private String date;
    private long count;
}
