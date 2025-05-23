package com.example.backend.controller;

import com.example.backend.dto.ProductDto;
import com.example.backend.entity.Product;
import com.example.backend.entity.User;
import com.example.backend.service.CategoryService;
import com.example.backend.service.ProductService;
import com.example.backend.service.UserService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/seller/products")
@RequiredArgsConstructor
public class SellerController {

    private final ProductService productService;
    private final UserService userService;
    private final CategoryService categoryService;

    @GetMapping
    public List<ProductDto> getSellerProducts(@RequestParam Long sellerId) {
        User seller = userService.findById(sellerId)
                .orElseThrow(() -> new EntityNotFoundException("Seller not found"));

        return productService.findBySellerId(seller.getId()).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<ProductDto> addProduct(@RequestBody ProductDto dto) {
        User seller = userService.findById(dto.sellerId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid seller ID"));

        Product p = new Product();
        p.setName(dto.name());
        p.setDescription(dto.description());
        p.setImage(dto.image());
        p.setPrice(dto.price());
        p.setStock(dto.stock());
        p.setRate(dto.rate());
        p.setReviewCount(dto.reviewCount());
        p.setSeller(seller);

        if (dto.categoryId() != null) {
            p.setCategory(categoryService.findById(dto.categoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid category")));
        }

        Product saved = productService.save(p);
        return ResponseEntity.status(201).body(toDto(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> updateProduct(@PathVariable Long id,
            @RequestBody ProductDto dto,
            @RequestParam Long sellerId) {
        // 1) Seller kontrolü
        User seller = userService.findById(sellerId)
                .orElseThrow(() -> new EntityNotFoundException("Seller not found"));

        // 2) Ürün kontrolü
        Product existing = productService.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        // 3) Yetki kontrolü
        if (!existing.getSeller().getId().equals(seller.getId())) {
            return ResponseEntity.status(403).build();
        }

        // 4) Güncelleme
        existing.setName(dto.name());
        existing.setDescription(dto.description());
        existing.setPrice(dto.price());
        existing.setStock(dto.stock());
        existing.setImage(dto.image());

        if (dto.categoryId() != null) {
            existing.setCategory(categoryService.findById(dto.categoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid category")));
        }

        Product updated = productService.save(existing);
        return ResponseEntity.ok(toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id,
            @RequestParam Long sellerId) {
        // 1) Seller doğrulama
        User seller = userService.findById(sellerId)
                .orElseThrow(() -> new EntityNotFoundException("Seller not found"));

        // 2) Ürün doğrulama
        Product product = productService.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        // 3) Yetki kontrolü
        if (!product.getSeller().getId().equals(seller.getId())) {
            return ResponseEntity.status(403).build();
        }

        productService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private ProductDto toDto(Product p) {
        return new ProductDto(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getImage(),
                p.getPrice(),
                p.getStock(),
                p.getRate(),
                p.getReviewCount(),
                p.getCategory() != null ? p.getCategory().getId() : null,
                null, // review list burada gerekli değil
                p.getSeller().getId());
    }
}