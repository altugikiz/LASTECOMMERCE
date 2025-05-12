// src/main/java/com/example/backend/service/impl/OrderServiceImpl.java
package com.example.backend.service.impl;

import com.example.backend.entity.Order;
import com.example.backend.repository.OrderRepository;
import com.example.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository repo;

    @Override
    public List<Order> findAll() {
        return repo.findAll();
    }

    @Override
    public Optional<Order> findById(Long id) {
        return repo.findById(id);
    }

    @Override
    public Order save(Order order) {
        return repo.save(order);
    }

    @Override
    public void deleteById(Long id) {
        repo.deleteById(id);
    }

    @Override
    public List<Order> findByUserId(Long userId) {
        return repo.findByUserId(userId);
    }

    @Override
    public List<Order> findBySellerId(Long sellerId) {
        return repo.findBySellerId(sellerId);
    }

    @Override
    public List<Order> findBySellerIdAndStatus(Long sellerId, String status) {
        return repo.findBySellerIdAndStatus(sellerId, status);
    }
}
