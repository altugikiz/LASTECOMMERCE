// src/main/java/com/example/backend/repository/OrderItemRepository.java
package com.example.backend.repository;

import com.example.backend.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> { }
