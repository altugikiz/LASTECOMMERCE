package com.example.backend.config;

import com.example.backend.security.JwtAuthenticationFilter;
import com.example.backend.service.impl.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthenticationFilter     jwtAuthFilter;

    // @Bean
    // public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    //     http
    //         // CSRF kapalı, JWT stateless
    //         .csrf(csrf -> csrf.disable())
    //         .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

    //         // DaoAuthenticationProvider
    //         .authenticationProvider(authenticationProvider())

    //         // Yetkilendirme kuralları
    //         .authorizeHttpRequests(auth -> auth
    //             // Auth işlemleri açık
    //             .requestMatchers("/api/auth/**").permitAll()

    //             // Public ürün + kategori + yorum endpoint’leri
    //             .requestMatchers(HttpMethod.GET,
    //                              "/api/products",
    //                              "/api/products/**",
    //                              "/api/categories/**",
    //                              "/api/products/*/reviews")
    //               .permitAll()

    //             // Rol bazlı
    //             .requestMatchers("/api/admin/**").hasRole("ADMIN")
    //             .requestMatchers("/api/seller/**").hasRole("SELLER")
    //             .requestMatchers("/api/user/**")
    //               .hasAnyRole("USER", "ADMIN", "SELLER")

    //             // Geri kalan tüm istekler authenticated
    //             .anyRequest().authenticated()
    //         )

    //         // JWT filtresini UsernamePassword filtresinden önce ekle
    //         .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)

    //         // CORS ayarları
    //         .cors(cors -> cors.configurationSource(corsConfigurationSource()));

    //     return http.build();
    // }

    // @Bean
    // public CorsConfigurationSource corsConfigurationSource() {
    //     CorsConfiguration cfg = new CorsConfiguration();
    //     cfg.addAllowedOrigin("http://localhost:4200");
    //     cfg.addAllowedMethod("*");
    //     cfg.addAllowedHeader("*");
    //     cfg.setAllowCredentials(true);
    //     UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
    //     src.registerCorsConfiguration("/**", cfg);
    //     return src;
    // }

    // SecurityConfig.java

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/payments/**").authenticated()
                .requestMatchers("/api/orders").authenticated()// authenticated()
                .requestMatchers(HttpMethod.GET, "/api/products/**", "/api/categories/**", "/api/products/*/reviews").permitAll()


                // b) Ürünleri listeleyen GET herkes için açık
                .requestMatchers(HttpMethod.GET, "/api/products/**", "/api/categories/**").permitAll()


                // Kategori ekleme (POST) için ek satır:
                .requestMatchers(HttpMethod.POST,"/api/categories/**" , "/api/products/**").permitAll()

                // c) Rol bazlı endpoint’ler

                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/seller/**").hasRole("SELLER")
                .requestMatchers("/api/user/**").hasAnyRole("USER", "ADMIN", "SELLER")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()));
        return http.build();
    }

@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration cfg = new CorsConfiguration();
    // Angular port
    cfg.addAllowedOrigin("http://localhost:4200");
    // Tüm metodlar (GET, POST, OPTIONS…)
    cfg.addAllowedMethod("*");
    // Authorization header’ına izin ver!
    cfg.addAllowedHeader("*");
    // Gerekirse çerez/credential
    cfg.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
    src.registerCorsConfiguration("/**", cfg);
    return src;
}


    @Bean
    public AuthenticationProvider authenticationProvider() {
        var provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    /**
     * Bu bean sayesinde AuthController’da AuthenticationManager inject edilebilir.
     */
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig
    ) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
