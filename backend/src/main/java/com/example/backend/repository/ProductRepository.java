package com.example.backend.repository;

import com.example.backend.entity.Category;
import com.example.backend.entity.Product;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryId(Long categoryId);
    long count();
    Optional<Product> findByName(String name);
}
