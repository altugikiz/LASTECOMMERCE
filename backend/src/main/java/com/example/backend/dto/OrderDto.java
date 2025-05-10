// src/main/java/com/example/backend/dto/OrderDto.java
package com.example.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record OrderDto(
    Long id,
    LocalDate orderDate,
    String status,
    BigDecimal totalAmount,
    Long userId,
    List<OrderItemDto> items
) {}
