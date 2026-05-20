// SecurityConfig.java - Version complète et corrigée
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

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .headers(headers -> headers.frameOptions(frame -> frame.disable()))
            
            .authorizeHttpRequests(auth -> auth
                // ================= 1. OPTIONS CORS =================
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                
                // ================= 2. PUBLIC =================
                .requestMatchers("/", "/h2-console/**").permitAll()
                
                // ================= 3. AUTHENTIFICATION =================
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/auth/**").permitAll()
                
                // ================= 4. SWAGGER =================
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                
                // ================= 5. FOURNISSEURS =================
                .requestMatchers("/api/fournisseur/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE")
                
                // ================= 6. MATIÈRES PREMIÈRES =================
                .requestMatchers("/api/matiere-premiere/**").permitAll()
                
                // ================= 7. STOCK =================
                .requestMatchers("/api/stock/**").permitAll()

                // ================= 8. MOUVEMENTS =================
                .requestMatchers("/api/mouvements/**").permitAll()
                
                // ================= 9. BONS =================
                .requestMatchers("/api/bon-entree/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "MAGASINIER")
                .requestMatchers("/api/bon-sortie/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "MAGASINIER")
                .requestMatchers("/api/bon-consommation/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "MAGASINIER")
                
                // ================= 10. COMMANDES =================
                .requestMatchers("/api/commandes/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE")
                
                // ================= 11. ALERTES =================
                .requestMatchers("/api/alerte/**").hasAnyRole("ADMINISTRATEUR", "SUPERVISEUR")
                
                // ================= 12. RAPPORTS =================
                .requestMatchers("/api/rapports/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "SUPERVISEUR")
                
                // ================= 13. RÉGIONS =================
                .requestMatchers("/api/region/**").hasRole("ADMINISTRATEUR")
                
                // ================= 14. CATÉGORIES =================
                .requestMatchers("/api/categorie/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE")
                
                // ================= 15. MAGASINS =================
                .requestMatchers("/api/magasin/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE")
                
                // ================= 16. UTILISATEURS =================
                .requestMatchers("/api/utilisateurs/me").authenticated()
                .requestMatchers("/api/utilisateurs/profile").authenticated()
                .requestMatchers("/api/utilisateurs/change-password").authenticated()
                .requestMatchers("/api/utilisateurs/**").hasRole("ADMINISTRATEUR")
                
                // ================= 17. TOUT LE RESTE =================
                .anyRequest().authenticated()
            )
            
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}