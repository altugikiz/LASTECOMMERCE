// package com.example.backend.security;

// import com.example.backend.entity.User;
// import com.example.backend.repository.UserRepository;
// import io.jsonwebtoken.*;
// import io.jsonwebtoken.security.Keys;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.stereotype.Component;

// import jakarta.persistence.EntityNotFoundException;
// import java.security.Key;
// import java.util.Collections;
// import java.util.Date;
// import java.util.List;

// @Component
// public class JwtUtil {

//     @Value("${jwt.secret}")
//     private String jwtSecret;

//     @Value("${jwt.expiration}")
//     private long jwtExpiration;

//     private final UserRepository userRepository;

//     public JwtUtil(UserRepository userRepository) {
//         this.userRepository = userRepository;
//     }

//     private Key getSigningKey() {
//         return Keys.hmacShaKeyFor(jwtSecret.getBytes());
//     }

//     /**
//      * @param username email veya kullanıcı adı
//      * @return JWT içinde "roles" claim’i olarak user.getRole().getRoleName() dizisini içerir.
//      */
//     public String generateToken(String username) {
//         Date now = new Date();
//         Date expiryDate = new Date(now.getTime() + jwtExpiration);

//         // DB'den user'ı çek ve rolünü al
//         User user = userRepository.findByEmail(username)
//             .orElseThrow(() -> new EntityNotFoundException("User not found: " + username));
//         String roleName = user.getRole().getRoleName(); // örn. "ROLE_ADMIN"

//         // Roller tekli olsa da dizi içinde gönderiyoruz
//         List<String> roles = Collections.singletonList(roleName);

//         return Jwts.builder()
//                 .setSubject(username)
//                 .setIssuedAt(now)
//                 .setExpiration(expiryDate)
//                 // tek tek claim eklemek yerine doğrudan role dizisini gömüyoruz
//                 .claim("roles", roles)
//                 .signWith(getSigningKey(), SignatureAlgorithm.HS256)
//                 .compact();
//     }

//     public String extractUsername(String token) {
//         return parseClaims(token).getSubject();
//     }

//     public boolean validateToken(String token) {
//         try {
//             parseClaims(token);
//             return true;
//         } catch (JwtException | IllegalArgumentException e) {
//             return false;
//         }
//     }

//     private Claims parseClaims(String token) {
//         return Jwts.parserBuilder()
//                 .setSigningKey(getSigningKey())
//                 .build()
//                 .parseClaimsJws(token)
//                 .getBody();
//     }

//     public Long extractUserId(String token) {
//         String username = extractUsername(token);
//         User user = userRepository.findByEmail(username)
//                    .orElseThrow(() -> new EntityNotFoundException("User not found: " + username));
//         return user.getId();
//     }
// }

package com.example.backend.security;

import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.persistence.EntityNotFoundException;
import java.security.Key;
import java.util.Collections;
import java.util.Date;
import java.util.List;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    private final UserRepository userRepository;

    public JwtUtil(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + username));

        String roleName = user.getRole().getRoleName(); // örn. "ROLE_USER"
        List<String> roles = Collections.singletonList(roleName);

        // Stripe Customer ID'yi al
        String stripeCustomerId = user.getStripeCustomerId(); // null olabilir, sorun değil

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .claim("roles", roles)
                .claim("stripeCustomerId", stripeCustomerId) // 🌟 burası eklendi
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return parseClaims(token).getSubject();
    }

    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public Long extractUserId(String token) {
        String username = extractUsername(token);
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + username));
        return user.getId();
    }
}