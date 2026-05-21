// SecurityConfig.java - VERSION CORRIGÉE
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
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .headers(headers -> headers
                .frameOptions(frame -> frame.disable()))

            .authorizeHttpRequests(auth -> auth

                // ─── 1. OPTIONS (pre-flight CORS) ───────────────────────────
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // ─── 2. Auth publique ────────────────────────────────────────
                .requestMatchers("/api/auth/**").permitAll()

                // ─── 3. H2 / Swagger ────────────────────────────────────────
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

                // ─── 4. TOUT LE RESTE = authentifié (JWT valide requis) ──────
                // Les rôles sont vérifiés dans les controllers avec @PreAuthorize
                // OU on les garde ici par resource :

                // Matières premières - tous les rôles connectés
                .requestMatchers("/api/matiere-premiere/**")
                    .hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "SUPERVISEUR", "MAGASINIER")

                // Stock - tous les rôles connectés
                .requestMatchers("/api/stock/**")
                    .hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "SUPERVISEUR", "MAGASINIER")

                // Mouvements - tous les rôles connectés
                .requestMatchers("/api/mouvements/**")
                    .hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "SUPERVISEUR", "MAGASINIER")

                // Bons
                .requestMatchers("/api/bon-entree/**")
                    .hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "MAGASINIER")
                .requestMatchers("/api/bon-sortie/**")
                    .hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "MAGASINIER")
                .requestMatchers("/api/bon-consommation/**")
                    .hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "MAGASINIER")
                .requestMatchers("/api/commande-achat/**")
                    .hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE")

                // Commandes
                .requestMatchers("/api/commandes/**")
                    .hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE")

                // Alertes
                .requestMatchers("/api/alerte/**")
                    .hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "SUPERVISEUR", "MAGASINIER")

                // Rapports
                .requestMatchers("/api/rapports/**")
                    .hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "SUPERVISEUR")

                // Régions - admin seulement
                .requestMatchers(HttpMethod.GET, "/api/region/**")
                    .hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "SUPERVISEUR", "MAGASINIER")
                .requestMatchers("/api/region/**")
                    .hasRole("ADMINISTRATEUR")

                // Catégories
                .requestMatchers(HttpMethod.GET, "/api/categorie/**")
                    .hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "SUPERVISEUR", "MAGASINIER")
                .requestMatchers("/api/categorie/**")
                    .hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE")

                // Magasins
                .requestMatchers(HttpMethod.GET, "/api/magasin/**")
                    .hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "SUPERVISEUR", "MAGASINIER")
                .requestMatchers("/api/magasin/**")
                    .hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE")

                // Fournisseurs
                .requestMatchers(HttpMethod.GET, "/api/fournisseur/**")
                    .hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "SUPERVISEUR")
                .requestMatchers("/api/fournisseur/**")
                    .hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE")

                // Utilisateurs
                .requestMatchers("/api/utilisateurs/me").authenticated()
                .requestMatchers("/api/utilisateurs/profile").authenticated()
                .requestMatchers("/api/utilisateurs/change-password").authenticated()
                .requestMatchers("/api/utilisateurs/**").hasRole("ADMINISTRATEUR")

                // Tout le reste : authentifié
                .anyRequest().authenticated()
            )

            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}