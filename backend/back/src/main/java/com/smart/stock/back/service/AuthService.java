package com.smart.stock.back.service;

import com.smart.stock.back.config.JwtUtil;
import com.smart.stock.back.model.Utilisateur;
import com.smart.stock.back.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public Map<String, Object> authenticate(String email, String motDePasse) {
        Map<String, Object> response = new HashMap<>();

        Utilisateur utilisateur = utilisateurRepository.findByEmail(email);

        if (utilisateur == null) {
            response.put("success", false);
            response.put("message", "Email introuvable");
            return response;
        }

        if (!utilisateur.getMot_de_passe().equals(motDePasse)) {
            response.put("success", false);
            response.put("message", "Mot de passe incorrect");
            return response;
        }

        // ✅ 🔥 CORRECTION ICI
        String role = mapRole(utilisateur.getRole().toString());

        String token = jwtUtil.generateToken(
                utilisateur.getEmail(),
                role
        );

        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", utilisateur.getId_user());
        userMap.put("nom", utilisateur.getNom());
        userMap.put("prenom", utilisateur.getPrenom());
        userMap.put("email", utilisateur.getEmail());
        userMap.put("role", role); // ✅ utiliser le rôle corrigé

        response.put("success", true);
        response.put("message", "Connexion réussie");
        response.put("token", token);
        response.put("user", userMap);

        return response;
    }

    // ✅ 🔥 MAPPING DES ROLES
    private String mapRole(String role) {
        switch (role) {
            case "ADMIN":
                return "ADMINISTRATEUR";
            case "MANAGER":
                return "GESTIONNAIRE";
            case "MAGASINIER":
                return "MAGASINIER";
            default:
                return role;
        }
    }
}