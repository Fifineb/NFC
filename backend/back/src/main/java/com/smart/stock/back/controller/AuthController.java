package com.smart.stock.back.controller;

import com.smart.stock.back.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String motDePasse = loginRequest.get("motDePasse");
        
        
        Map<String, Object> authResult = authService.authenticate(email, motDePasse);
        
        // Vérifier si l'authentification a réussi
        if (authResult.containsKey("success") && (Boolean) authResult.get("success")) {
            return ResponseEntity.ok(authResult);
        } else {
            return ResponseEntity.status(401).body(authResult);
        }
    }
}