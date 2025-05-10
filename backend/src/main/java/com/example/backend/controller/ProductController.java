package com.example.backend.controller;

import com.example.backend.dto.ProductDto;
import com.example.backend.dto.ReviewDto;
import com.example.backend.entity.Category;
import com.example.backend.entity.Product;
import com.example.backend.service.CategoryService;
import com.example.backend.service.ProductService;
import com.example.backend.service.ReviewService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final CategoryService categoryService;
    private final ReviewService reviewService;

    @GetMapping
    public List<ProductDto> getAll() {
        return productService.findAll().stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    @GetMapping("/api/products")
    public List<ProductDto> listProducts(
        @RequestParam(name = "categoryId", required = false) Long categoryId
    ) {
        Stream<Product> stream = (categoryId != null)
            ? productService.getByCategoryId(categoryId).stream()
            : productService.findAll().stream();
    
        return stream
            .map(this::toDto)
            .collect(Collectors.toList());
    }


    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getById(@PathVariable Long id) {
        return productService.findById(id)
            .map(p -> ResponseEntity.ok(toDto(p)))
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ProductDto create(@RequestBody ProductDto dto) {
        Product created = productService.save(toEntity(dto));
        return toDto(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> update(@PathVariable Long id,
                                             @RequestBody ProductDto dto) {
        return productService.findById(id)
            .map(existing -> {
                Product toSave = toEntity(dto);
                toSave.setId(id);
                return ResponseEntity.ok(toDto(productService.save(toSave)));
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (productService.findById(id).isEmpty())
            return ResponseEntity.notFound().build();
        productService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /** DTO'ya yorum listesini de ekliyoruz */
    private ProductDto toDto(Product p) {
        List<ReviewDto> reviews = reviewService.findByProductId(p.getId());
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
            reviews
        );
    }

    private Product toEntity(ProductDto d) {
        Product p = new Product();
        p.setName(d.name());
        p.setDescription(d.description());
        p.setImage(d.image());
        p.setPrice(d.price());
        p.setStock(d.stock());
        p.setRate(d.rate());
        p.setReviewCount(d.reviewCount());
        if (d.categoryId() != null) {
            Category c = categoryService.findById(d.categoryId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid category"));
            p.setCategory(c);
        }
        return p;
    }
}
