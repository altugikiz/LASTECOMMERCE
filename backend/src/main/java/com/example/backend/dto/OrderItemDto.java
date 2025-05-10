// src/main/java/com/example/backend/dto/OrderItemDto.java
package com.example.backend.dto;

import java.math.BigDecimal;

public record OrderItemDto(
    Long id,
    BigDecimal orderedProductPrice,
    Integer quantity,
    String itemStatus,
    Long productId
) {}
