package com.arjuncodes.isersystem.controller;

import com.arjuncodes.isersystem.model.Utilisateur;
import com.arjuncodes.isersystem.model.Role;
import com.arjuncodes.isersystem.security.JwtUtil;
import com.arjuncodes.isersystem.service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UtilisateurService utilisateurService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Utilisateur user) {

        Map<String, Object> response = new HashMap<>();

        Utilisateur existing = utilisateurService.getUtilisateurByEmail(user.getEmail());
        if (existing != null) {
            response.put("success", false);
            response.put("message", "Email déjà utilisé");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        if (user.getRole() == null) {
            user.setRole(Role.MAGASINIER);
        }

        user.setActif(true);
        user.setMotDePasse(passwordEncoder.encode(user.getMotDePasse()));

        Utilisateur saved = utilisateurService.saveUtilisateur(user);
        String token = jwtUtil.generateToken(saved.getEmail(), saved.getRole().name());

        response.put("success", true);
        response.put("message", "Utilisateur créé avec succès");
        response.put("userId", saved.getId());
        response.put("email", saved.getEmail());
        response.put("nom", saved.getNom());
        response.put("prenom", saved.getPrenom());
        response.put("role", saved.getRole());
        response.put("token", token);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
/* @GetMapping("/generate-hash")
public ResponseEntity<String> generateHash() {
    String hash = passwordEncoder.encode("oussama123456");
    return ResponseEntity.ok(hash);
} */




    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) {

        Map<String, Object> response = new HashMap<>();
        String email    = request.get("email");
        String password = request.get("motDePasse");

        Utilisateur user = utilisateurService.getUtilisateurByEmail(email);
        if (user == null) {
            response.put("success", false);
            response.put("message", "Utilisateur introuvable");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        if (!user.isActif()) {
            response.put("success", false);
            response.put("message", "Compte désactivé");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }

        if (!passwordEncoder.matches(password, user.getMotDePasse())) {
            response.put("success", false);
            response.put("message", "Mot de passe incorrect");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        response.put("success", true);
        response.put("token", token);
        response.put("role", user.getRole());
        response.put("userId", user.getId());
        response.put("email", user.getEmail());
        response.put("nom", user.getNom());
        response.put("prenom", user.getPrenom());
        response.put("message", "Connexion réussie");

        return ResponseEntity.ok(response);
    }
}