package com.arjuncodes.isersystem.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    // ================= PASSWORD =================
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ================= AUTH MANAGER =================
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // ================= CORS =================
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:5173")
        );

        configuration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    // ================= SECURITY =================
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http

                // ACTIVE CORS
                .cors(cors -> {})

                // DESACTIVE CSRF
                .csrf(csrf -> csrf.disable())

                // JWT STATELESS
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // AUTORISATIONS
                .authorizeHttpRequests(auth -> auth

                        // OPTIONS POUR CORS
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // PUBLIC
                        .requestMatchers("/").permitAll()

                        // LOGIN AUTH

                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/auth/**").permitAll()

                        // SWAGGER
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

                        // H2
                        .requestMatchers("/h2-console/**").permitAll()

                        // FOURNISSEUR
                        .requestMatchers("/api/fournisseur/**").permitAll()

                        // ROLES
                        .requestMatchers("/api/utilisateurs/**")
                        .hasRole("ADMINISTRATEUR")

                        .requestMatchers("/api/stock/**")
                        .hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "MAGASINIER")

                        .requestMatchers("/api/alerte/**")
                        .hasAnyRole("ADMINISTRATEUR", "SUPERVISEUR")

                        .requestMatchers("/api/rapports/**")
                        .hasAnyRole("ADMINISTRATEUR", "SUPERVISEUR")

                        .requestMatchers("/api/commandes/**")
                        .hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE")

                        .requestMatchers("/api/bon-entree/**")
                        .hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "MAGASINIER")

                        .requestMatchers("/api/bon-sortie/**")
                        .hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "MAGASINIER")

                        .requestMatchers("/api/bon-consommation/**")
                        .hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "MAGASINIER")

                        .requestMatchers("/matiere/**").permitAll()

                        .requestMatchers("/api/mouvements/**")
                        .authenticated()

                        .anyRequest().authenticated()
                )

                // H2 CONSOLE
                .headers(headers ->
                        headers.frameOptions(frame -> frame.disable())
                )

                // JWT FILTER
                .addFilterBefore(jwtFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
