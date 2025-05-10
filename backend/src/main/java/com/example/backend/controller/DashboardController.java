package com.example.backend.controller;

import com.example.backend.service.UserService;
import com.example.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class DashboardController {

    private final UserService userService;
    private final ProductService productService; // ProductService eklendi

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardData() {
        try {
            Map<String, Object> dashboardData = new HashMap<>();
            dashboardData.put("totalUsers", userService.countAllUsers());
            dashboardData.put("totalSellers", userService.countSellers());
            dashboardData.put("pendingSellerRequests", userService.countPendingSellerRequests());
            dashboardData.put("totalProducts", productService.countAllProducts()); // Toplam ürün sayısı eklendi
            return ResponseEntity.ok(dashboardData);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching dashboard data: " + e.getMessage());
        }
    }
}