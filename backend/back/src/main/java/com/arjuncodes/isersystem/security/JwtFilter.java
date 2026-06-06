package com.arjuncodes.isersystem.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
<<<<<<< HEAD
import java.util.Collections;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;
=======
import java.util.List;
@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }
>>>>>>> cdb999b (listeproduit)

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws IOException, ServletException {

<<<<<<< HEAD
        String path = request.getServletPath();

        if (path.startsWith("/auth") || path.startsWith("/api/auth") ||
                path.startsWith("/api/fournisseur")) {
                chain.doFilter(request, response);
=======
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
>>>>>>> cdb999b (listeproduit)
            return;
        }

        /*if (path.startsWith("/auth") || path.startsWith("/api/auth")
         || path.startsWith("/api/fournisseur")) {
          chain.doFilter(request, response);
          return;
        }*/

        String authHeader = request.getHeader("Authorization");

<<<<<<< HEAD
=======
        // Pas de token → pas d'authentification
>>>>>>> cdb999b (listeproduit)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("⚠️ Pas de token pour: " + path);
            chain.doFilter(request, response);  // Laisse passer, SecurityConfig décidera
            return;
        }

        String token = authHeader.substring(7);

<<<<<<< HEAD
        if (!jwtUtil.validateToken(token)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"success\":false,\"message\":\"Token invalide ou expiré\"}");
            return;
        }

        String email = jwtUtil.extractEmail(token);
        String role  = jwtUtil.extractRole(token);

        SimpleGrantedAuthority authority =
                new SimpleGrantedAuthority("ROLE_" + role);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                        email,
                        null,
                        Collections.singletonList(authority)
                );

        SecurityContextHolder.getContext().setAuthentication(auth);
=======
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
>>>>>>> cdb999b (listeproduit)

        chain.doFilter(request, response);
    }

}