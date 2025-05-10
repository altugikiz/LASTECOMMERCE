// src/main/java/com/example/backend/controller/AuthController.java
package com.example.backend.controller;

import com.example.backend.dto.AuthRequest;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.dto.AuthResponse;
import com.example.backend.entity.User;
import com.example.backend.entity.Role;
import com.example.backend.repository.RoleRepository;
import com.example.backend.service.UserService;
import com.example.backend.security.JwtUtil;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        // Gelen verilerin doğruluğunu kontrol et
        if (req.getEmail() == null || req.getEmail().trim().isEmpty() ||
            req.getPassword() == null || req.getPassword().trim().isEmpty() ||
            req.getFirstName() == null || req.getFirstName().trim().isEmpty() ||
            req.getLastName() == null || req.getLastName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("All fields (email, password, firstName, lastName) are required");
        }

        // Email zaten kullanılıyorsa hata dön
        if (userService.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use");
        }

        // USER rolünü kontrol et ve oluştur
        Role userRole = roleRepository.findByRoleName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("USER role not found"));

        User user = new User();
        user.setEmail(req.getEmail().trim());
        user.setPassword(passwordEncoder.encode(req.getPassword().trim()));
        user.setFirstName(req.getFirstName().trim());
        user.setLastName(req.getLastName().trim());
        user.setRole(userRole);
        user.setActive(true);
        user.setSellerRequested(Boolean.TRUE.equals(req.getSellerRequested()));
        user.setSellerApproved(false);

        try {
            userService.save(user);
            String token = jwtUtil.generateToken(user.getEmail());
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest req) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        String token = jwtUtil.generateToken(req.getEmail());
        return ResponseEntity.ok(new AuthResponse(token));
    }
}
