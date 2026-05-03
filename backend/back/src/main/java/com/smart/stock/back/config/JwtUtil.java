package com.smart.stock.back.config;

import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.*;

@Component
public class JwtUtil {

    private static final Key SECRET_KEY = Keys.hmacShaKeyFor("change_this_secret".getBytes());

    // Extraire l'email
    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // ✅ Ajouter cette méthode pour extraire le rôle
    public String extractRole(String token) {
        final Claims claims = extractAllClaims(token);
        return claims.get("role", String.class);
    }

    // Extraire une claim
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Extraire toutes les claims
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Valider le token
    public Boolean validateToken(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // ✅ Modifiez votre méthode generateToken pour inclure le rôle
    public String generateToken(String email, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        return createToken(claims, email);
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 heures
                .signWith(SECRET_KEY)
                .compact();
    }
}