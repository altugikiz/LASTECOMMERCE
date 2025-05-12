// src/main/java/com/example/backend/dto/OrderDto.java
package com.example.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    private Long id;
    private LocalDate orderDate;
    private String status;
    private BigDecimal totalAmount;
    private Long userId;
    private Long sellerId;
    private Long paymentId;
    private List<OrderItemDto> items;
}