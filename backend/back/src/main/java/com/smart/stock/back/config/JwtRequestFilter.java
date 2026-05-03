package com.smart.stock.back.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Collections;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    
    @Autowired
    private JwtUtil jwtUtil;
@Override
protected void doFilterInternal(@NonNull HttpServletRequest request,
                               @NonNull HttpServletResponse response,
                               @NonNull FilterChain chain)
        throws ServletException, IOException {

    // ✅ CORRECTION CRITIQUE (CORS)
    if (request.getMethod().equals("OPTIONS")) {
        chain.doFilter(request, response);
        return;
    }

    String path = request.getServletPath();

    if (path.equals("/auth/login") || path.equals("/auth/register")) {
        chain.doFilter(request, response);
        return;
    }

    final String authorizationHeader = request.getHeader("Authorization");

    if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
        System.out.println("❌ Token manquant pour: " + path);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        return;
    }

    String jwt = authorizationHeader.substring(7);

    if (!jwtUtil.validateToken(jwt)) {
        System.out.println("❌ Token invalide pour: " + path);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        return;
    }

    String email = jwtUtil.extractEmail(jwt);
    String role = jwtUtil.extractRole(jwt);

    System.out.println("✅ Utilisateur: " + email + " | Role: " + role);

    UsernamePasswordAuthenticationToken authToken =
            new UsernamePasswordAuthenticationToken(
                    email,
                    null,
                    Collections.singletonList(new SimpleGrantedAuthority(role))
            );

    SecurityContextHolder.getContext().setAuthentication(authToken);

    chain.doFilter(request, response);
}

}
