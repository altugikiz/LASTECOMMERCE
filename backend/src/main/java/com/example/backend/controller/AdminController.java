package com.example.backend.controller;

import com.example.backend.dto.UserDto;
import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.repository.RoleRepository;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ROLE_ADMIN')") // Controller seviyesinde koruma
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final RoleRepository roleRepo;

    @GetMapping("/seller-requests")
    public List<UserDto> listPending() {
        return userService.getPendingSellerRequests().stream()
            .map(u -> new UserDto(u.getId(), u.getEmail(), u.getFirstName(), u.getLastName(),
                u.getMobileNumber(), u.getActive(), u.getRole().getId(), u.getSellerRequested(),
                u.getSellerApproved()))
            .collect(Collectors.toList());
    }

    @PostMapping("/seller-requests/{userId}/approve")
    @PreAuthorize("hasRole('ROLE_ADMIN')") // Metot seviyesinde ek koruma
    public ResponseEntity<?> approve(@PathVariable Long userId) {
        User u = userService.findById(userId)
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı: " + userId));

        if (!u.getSellerRequested()) {
            return ResponseEntity.badRequest().body("Bu kullanıcı satıcı talebinde bulunmamış.");
        }
        if (u.getSellerApproved()) {
            return ResponseEntity.badRequest().body("Bu kullanıcı zaten onaylanmış.");
        }

        u.setSellerApproved(true);
        Role sellerRole = roleRepo.findByRoleName("ROLE_SELLER")
            .orElseThrow(() -> new RuntimeException("ROLE_SELLER rolü yok"));
        u.setRole(sellerRole);

        try {
            userService.save(u);
            return ResponseEntity.ok("Satıcı onayı verildi");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Satıcı onayı sırasında hata oluştu: " + e.getMessage());
        }
    }

    @PostMapping("/seller-requests/{userId}/reject")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> reject(@PathVariable Long userId) {
        User u = userService.findById(userId)
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı: " + userId));

        if (!u.getSellerRequested()) {
            return ResponseEntity.badRequest().body("Bu kullanıcı satıcı talebinde bulunmamış.");
        }

        u.setSellerRequested(false);
        try {
            userService.save(u);
            return ResponseEntity.ok("Satıcı talebi reddedildi");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Satıcı reddi sırasında hata oluştu: " + e.getMessage());
        }
    }
}