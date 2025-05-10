package com.example.backend.controller;

import com.example.backend.dto.OrderDto;
import com.example.backend.dto.OrderItemDto;
import com.example.backend.entity.Order;
import com.example.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public List<OrderDto> listAll() {
        return orderService.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getById(@PathVariable Long id) {
        return orderService.findById(id)
                .map(order -> ResponseEntity.ok(toDto(order)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public OrderDto create(@RequestBody Order order) {
        // Back-reference’i set et
        if (order.getItems() != null) {
            order.getItems().forEach(item -> item.setOrder(order));
        }
        Order saved = orderService.save(order);
        return toDto(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderDto> update(@PathVariable Long id,
                                           @RequestBody Order order) {
        return orderService.findById(id)
                .map(existing -> {
                    order.setId(id);
                    if (order.getItems() != null) {
                        order.getItems().forEach(item -> item.setOrder(order));
                    }
                    Order saved = orderService.save(order);
                    return ResponseEntity.ok(toDto(saved));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!orderService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        orderService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private OrderDto toDto(Order order) {
        List<OrderItemDto> items = order.getItems() == null
                ? List.of()
                : order.getItems().stream()
                    .map(i -> new OrderItemDto(
                        i.getId(),
                        i.getOrderedProductPrice(),
                        i.getQuantity(),
                        i.getItemStatus(),
                        i.getProduct().getId()
                    ))
                    .collect(Collectors.toList());

        return new OrderDto(
            order.getId(),
            order.getOrderDate(),
            order.getStatus(),
            order.getTotalAmount(),
            order.getUser().getId(),
            items
        );
    }
}
