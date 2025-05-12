package com.example.backend.controller;

import com.example.backend.dto.OrderRequest;
import com.example.backend.dto.OrderDto;
import com.example.backend.dto.OrderItemDto;
import com.example.backend.entity.Order;
import com.example.backend.entity.OrderItem;
import com.example.backend.entity.Payment;
import com.example.backend.entity.User;
import com.example.backend.entity.Product;
import com.example.backend.service.OrderService;
import com.example.backend.service.UserService;
import com.example.backend.service.ProductService;
import com.example.backend.service.PaymentService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService   orderService;
    private final UserService    userService;
    private final ProductService productService;
    private final PaymentService paymentService;

    // 1) Checkout sonrası sipariş oluşturma
    @PostMapping("/create-after-checkout")
    public ResponseEntity<OrderDto> createAfterCheckout(@RequestBody OrderRequest req) {
        // a) Buyer
        User buyer = userService.findById(req.getUserId())
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + req.getUserId()));
        // b) Payment
        Payment payment = paymentService.findById(req.getPaymentId())
            .orElseThrow(() -> new IllegalArgumentException("Payment not found: " + req.getPaymentId()));
        // c) Order inşa
        Order order = Order.builder()
            .orderDate(LocalDate.now())
            .status("PENDING_APPROVAL")
            .totalAmount(req.getItems().stream()
                .map(i -> i.getOrderedProductPrice()
                           .multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add))
            .user(buyer)
            .payment(payment)
            .build();
        // d) Kalemleri map et
        List<OrderItem> items = req.getItems().stream().map(i -> {
            Product p = productService.findById(i.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + i.getProductId()));
            return OrderItem.builder()
                .order(order)
                .product(p)
                .quantity(i.getQuantity())
                .orderedProductPrice(i.getOrderedProductPrice())
                .itemStatus("PENDING")
                .build();
        }).collect(Collectors.toList());
        order.setItems(items);
        // e) Seller ataması (ilk kalemin seller’ı)
        if (!items.isEmpty()) {
            order.setSeller(items.get(0).getProduct().getSeller());
        }
        // f) Kaydet ve DTO’ya dönüştür
        Order saved = orderService.save(order);
        return ResponseEntity.status(201).body(mapToDto(saved));
    }

    // 2) Tüm siparişleri listele
    @GetMapping
    public ResponseEntity<List<OrderDto>> listAll() {
        List<OrderDto> dtos = orderService.findAll().stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // 3) ID ile sipariş getir
    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getById(@PathVariable Long id) {
        return orderService.findById(id)
            .map(o -> ResponseEntity.ok(mapToDto(o)))
            .orElse(ResponseEntity.notFound().build());
    }

    // 4) Kullanıcı bazlı
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderDto>> listByUser(@PathVariable Long userId) {
        List<OrderDto> dtos = orderService.findByUserId(userId).stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // 5) Satıcı bazlı (isteğe bağlı status filtresi)
    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<OrderDto>> listBySeller(
            @PathVariable Long sellerId,
            @RequestParam(required = false) String status) {
        List<Order> orders = (status != null)
            ? orderService.findBySellerIdAndStatus(sellerId, status)
            : orderService.findBySellerId(sellerId);
        List<OrderDto> dtos = orders.stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // 6) Satıcı onay/red
    @PutMapping("/seller/orders/{orderId}/status")
    public ResponseEntity<OrderDto> updateStatus(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> body) {
        Order order = orderService.findById(orderId)
            .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
        order.setStatus(body.get("status"));
        Order updated = orderService.save(order);
        return ResponseEntity.ok(mapToDto(updated));
    }

    // --- Yardımcı: Entity → DTO dönüşümü
    private OrderDto mapToDto(Order order) {
        List<OrderItemDto> items = order.getItems().stream()
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
            order.getSeller() != null ? order.getSeller().getId() : null,
            order.getPayment().getId(),
            items
        );
    }
}
