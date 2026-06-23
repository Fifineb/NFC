// security/JwtFilter.java — VERSION CORRIGÉE
package com.arjuncodes.isersystem.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        
        // ✅ CRUCIAL : Ne PAS bloquer les endpoints d'authentification
        if (path.startsWith("/api/auth/")) {
            System.out.println("🔓 Auth endpoint - bypass JWT: " + path);
            chain.doFilter(request, response);
            return;
        }

        // Laisser passer les requêtes OPTIONS (pre-flight CORS)
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        // Pas de token → pas d'authentification
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("⚠️ Pas de token pour: " + path);
            chain.doFilter(request, response);  // Laisse passer, SecurityConfig décidera
            return;
        }

        String token = authHeader.substring(7);

        try {
            String email = jwtUtil.extractEmail(token);
            String role = jwtUtil.extractRole(token);

            if (email != null && role != null && jwtUtil.validateToken(token)) {
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(email, null, List.of(authority));

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);

                System.out.println("✅ JWT OK - email: " + email + " | role: ROLE_" + role);
            }
        } catch (Exception e) {
            SecurityContextHolder.clearContext();
            System.err.println("❌ JWT invalide : " + e.getMessage());
        }

        chain.doFilter(request, response);
    }

}