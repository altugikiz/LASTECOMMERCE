// src/main/java/com/example/backend/service/OrderService.java
package com.example.backend.service;

import com.example.backend.entity.Order;

import java.util.List;
import java.util.Optional;

public interface OrderService {
    List<Order> findAll();
    Optional<Order> findById(Long id);
    Order save(Order order);
    void deleteById(Long id);
}
