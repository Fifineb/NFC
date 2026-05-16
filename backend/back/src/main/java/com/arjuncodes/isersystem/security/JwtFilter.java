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
import java.util.Collections;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws IOException, ServletException {

        String path = request.getServletPath();

        if (path.startsWith("/auth") || path.startsWith("/api/auth") ||
                path.startsWith("/api/fournisseur")) {
                chain.doFilter(request, response);
            return;
        }

        /*if (path.startsWith("/auth") || path.startsWith("/api/auth")
         || path.startsWith("/api/fournisseur")) {
          chain.doFilter(request, response);
          return;
        }*/

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

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

        chain.doFilter(request, response);
    }
}