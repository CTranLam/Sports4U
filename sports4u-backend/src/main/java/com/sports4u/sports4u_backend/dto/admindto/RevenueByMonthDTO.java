package com.sports4u.sports4u_backend.dto.admindto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class RevenueByMonthDTO {
    private int month;
    private BigDecimal revenue;
}
