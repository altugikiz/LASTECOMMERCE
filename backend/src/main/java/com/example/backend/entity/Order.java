// src/main/java/com/example/backend/entity/Order.java
package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.Pattern;


// import org.hibernate.annotations.processing.Pattern;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long id;

    @Column(name = "order_date", nullable = false)
    private LocalDate orderDate;

    @Pattern(regexp = "PENDING|APPROVED|SHIPPED|CANCELLED", message = "Invalid order status")
    @Column(name = "order_status", length = 50, nullable = false)
    private String status;

    @Column(name = "total_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalAmount;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    // eğer Payment entity’si varsa onu da ilişkilendirebilirsin:
    // @ManyToOne
    // @JoinColumn(name = "payment_id")
    // private Payment payment;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items;

}
