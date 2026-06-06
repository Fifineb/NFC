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
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // ================= SECURITY =================
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .headers(headers -> headers.frameOptions(frame -> frame.disable()))
<<<<<<< HEAD
            
=======

>>>>>>> cdb999b (listeproduit)
            .authorizeHttpRequests(auth -> auth
                // ================= OPTIONS CORS =================
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                
                // ================= PUBLIC =================
                .requestMatchers("/", "/h2-console/**").permitAll()
                
                // ================= AUTHENTIFICATION =================
                .requestMatchers("/api/auth/**").permitAll()
<<<<<<< HEAD
                .requestMatchers(HttpMethod.GET, "/api/auth/**").permitAll()
                
                // ================= SWAGGER =================
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                
                // ================= FOURNISSEURS =================
                .requestMatchers("/api/fournisseur/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE")
                
                // ================= MATIÈRES PREMIÈRES / PRODUITS =================
                .requestMatchers("/api/matiere-premiere/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "MAGASINIER", "SUPERVISEUR")
                .requestMatchers("/api/produits/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "MAGASINIER", "SUPERVISEUR")
                .requestMatchers("/matiere/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "MAGASINIER", "SUPERVISEUR")
                
                // ================= STOCK =================
                .requestMatchers("/api/stock/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "MAGASINIER")
                .requestMatchers("/api/stock/augmenter/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "MAGASINIER")
                .requestMatchers("/api/stock/diminuer/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "MAGASINIER")
                
                // ================= BONS =================
                .requestMatchers("/api/bon-entree/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "MAGASINIER")
                .requestMatchers("/api/bon-sortie/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "MAGASINIER")
                .requestMatchers("/api/bon-consommation/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "MAGASINIER")
                
                // ================= COMMANDES =================
                .requestMatchers("/api/commandes/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE")
                
                // ================= MOUVEMENTS =================
                .requestMatchers("/api/mouvements/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "MAGASINIER", "SUPERVISEUR")
                
                // ================= ALERTES =================
                .requestMatchers("/api/alerte/**").hasAnyRole("ADMINISTRATEUR", "SUPERVISEUR")
                
                // ================= RAPPORTS =================
                .requestMatchers("/api/rapports/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "SUPERVISEUR")
                
                // ================= RÉGIONS =================
                .requestMatchers("/api/region/**").hasRole("ADMINISTRATEUR")
                
                // ================= UTILISATEURS =================
                .requestMatchers("/api/utilisateurs/**").hasRole("ADMINISTRATEUR")
                .requestMatchers("/api/utilisateurs/me").authenticated()
                
                // ================= CATÉGORIES =================
                .requestMatchers("/api/categorie/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE")
                
                // ================= MAGASINS =================
                .requestMatchers("/api/magasin/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE")
                
                // ================= RÉGIONS =================
                .requestMatchers("/api/region/**").hasRole("ADMINISTRATEUR")
                
                // ================= TOUT AUTRE ENDPOINT =================
=======
                
                // ─── 3. H2 / Swagger ────────────────────────────────────────
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

                // ⚠️ 4. STOCK - TOUS LES RÔLES CONNECTÉS
                .requestMatchers("/api/stock/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "SUPERVISEUR", "MAGASINIER")
                
                // ⚠️ 5. RÉGIONS
                .requestMatchers(HttpMethod.GET, "/api/region/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "SUPERVISEUR", "MAGASINIER")
                .requestMatchers("/api/region/**").hasRole("ADMINISTRATEUR")

                // ⚠️ 6. FOURNISSEURS
                .requestMatchers(HttpMethod.GET, "/api/fournisseur/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "SUPERVISEUR")
                .requestMatchers("/api/fournisseur/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE")

                // ⚠️ 7. MATIÈRES PREMIÈRES
                .requestMatchers(HttpMethod.GET, "/api/matiere-premiere/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "SUPERVISEUR", "MAGASINIER")
                .requestMatchers(HttpMethod.POST, "/api/matiere-premiere/add").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE")
                .requestMatchers(HttpMethod.PUT, "/api/matiere-premiere/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE")
                .requestMatchers(HttpMethod.DELETE, "/api/matiere-premiere/**").hasRole("ADMINISTRATEUR")

                // ⚠️ 8. BONS
                .requestMatchers("/api/bon-entree/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "MAGASINIER")
                .requestMatchers("/api/bon-sortie/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "MAGASINIER")
                .requestMatchers("/api/bon-consommation/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "MAGASINIER")
                .requestMatchers("/api/commande-achat/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE")

                // ─── 9. Commandes ────────────────────────────────────────────
                .requestMatchers("/api/commandes/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE")

                // ─── 10. Alertes ─────────────────────────────────────────────
                .requestMatchers("/api/alerte/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "SUPERVISEUR", "MAGASINIER")

                // ─── 11. Rapports ────────────────────────────────────────────
                .requestMatchers("/api/rapports/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "SUPERVISEUR")

                // ─── 12. Catégories ──────────────────────────────────────────
                .requestMatchers(HttpMethod.GET, "/api/categorie/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "SUPERVISEUR", "MAGASINIER")
                .requestMatchers("/api/categorie/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE")

                // ─── 13. Magasins ────────────────────────────────────────────
                .requestMatchers(HttpMethod.GET, "/api/magasin/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE", "SUPERVISEUR", "MAGASINIER")
                .requestMatchers("/api/magasin/**").hasAnyRole("ADMINISTRATEUR", "GESTIONNAIRE")

                // ─── 14. Utilisateurs ────────────────────────────────────────
                .requestMatchers("/api/utilisateurs/me").authenticated()
                .requestMatchers("/api/utilisateurs/profile").authenticated()
                .requestMatchers("/api/utilisateurs/change-password").authenticated()
                .requestMatchers("/api/utilisateurs/**").hasRole("ADMINISTRATEUR")


                // ─── 15. Mouvements ────────────────────────────────────────
.requestMatchers("/api/mouvements").permitAll()
.requestMatchers("/api/mouvements/**").permitAll()                // ─── 16. Tout le reste ────────────────────────────────────────
>>>>>>> cdb999b (listeproduit)
                .anyRequest().authenticated()
            )
            
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
