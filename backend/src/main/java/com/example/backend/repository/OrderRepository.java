// src/main/java/com/example/backend/repository/OrderRepository.java
package com.example.backend.repository;

import com.example.backend.entity.Order;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    List<Order> findBySellerId(Long sellerId);
    List<Order> findBySellerIdAndStatus(Long sellerId, String status);
}