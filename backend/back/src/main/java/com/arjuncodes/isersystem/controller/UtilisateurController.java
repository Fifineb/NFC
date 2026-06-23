package com.arjuncodes.isersystem.controller;

import com.arjuncodes.isersystem.model.Role;
import com.arjuncodes.isersystem.model.Utilisateur;
import com.arjuncodes.isersystem.service.UtilisateurService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.arjuncodes.isersystem.security.JwtUtil;  
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/utilisateurs")
public class UtilisateurController {

    @Autowired
    private UtilisateurService utilisateurService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil; 

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody Utilisateur utilisateur) {
        Map<String, Object> response = new HashMap<>();

        String rawPassword = utilisateur.getMotDePasse();
        if (rawPassword != null && !rawPassword.isEmpty()) {
            utilisateur.setMotDePasse(passwordEncoder.encode(rawPassword));
        }

        utilisateur.setActif(true);

        Utilisateur saved = utilisateurService.saveUtilisateur(utilisateur);

        response.put("success", true);
        response.put("message", "Utilisateur créé !");
        response.put("data", saved);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<Utilisateur>> getAll() {
        return ResponseEntity.ok(utilisateurService.getAllUtilisateurs());
    }

    @GetMapping("/{id_user}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable int id_user) {
        Map<String, Object> response = new HashMap<>();
        Utilisateur utilisateur = utilisateurService.getUtilisateurById(id_user);

        if (utilisateur == null) {
            response.put("success", false);
            response.put("message", "Utilisateur introuvable");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        response.put("success", true);
        response.put("data", utilisateur);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id_user}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable int id_user,
                                                      @RequestBody Utilisateur details) {
        Map<String, Object> response = new HashMap<>();

        if (details.getMotDePasse() != null && !details.getMotDePasse().isEmpty()) {
            details.setMotDePasse(passwordEncoder.encode(details.getMotDePasse()));
        }

        Utilisateur updated = utilisateurService.modifierProfil(id_user, details);

        if (updated == null) {
            response.put("success", false);
            response.put("message", "Utilisateur introuvable");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        response.put("success", true);
        response.put("message", "Utilisateur modifié !");
        response.put("data", updated);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id_user}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable int id_user) {
        Map<String, Object> response = new HashMap<>();
        utilisateurService.deleteUtilisateur(id_user);

        response.put("success", true);
        response.put("message", "Utilisateur supprimé !");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id_user}/permissions/{action}")
    public ResponseEntity<Map<String, Object>> checkPermission(@PathVariable int id_user,
                                                               @PathVariable String action) {
        Map<String, Object> response = new HashMap<>();

        Utilisateur utilisateur = utilisateurService.getUtilisateurById(id_user);

        if (utilisateur == null) {
            response.put("success", false);
            response.put("message", "Utilisateur introuvable");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        boolean hasPermission = hasPermission(utilisateur.getRole(), action);

        response.put("success", true);
        response.put("hasPermission", hasPermission);
        response.put("action", action);
        response.put("role", utilisateur.getRole());

        return ResponseEntity.ok(response);
    }

    // ✅ NOUVEAU ENDPOINT - Récupérer l'utilisateur connecté
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@AuthenticationPrincipal String email) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Utilisateur user = utilisateurService.getUtilisateurByEmail(email);
            response.put("success", true);
            response.put("id", user.getId());
            response.put("email", user.getEmail());
            response.put("nom", user.getNom());
            response.put("prenom", user.getPrenom());
            response.put("role", user.getRole());
            response.put("telephone", user.getTelephone());
            response.put("actif", user.isActif());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Utilisateur non trouvé");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    //  Mettre à jour le profil
@PutMapping("/profile")
public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> updates,
                                        HttpServletRequest request) {
    try {
        // 1. Récupérer l'email depuis le token
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "Token manquant"));
        }
        
        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);
        
        System.out.println(">>> EMAIL FROM TOKEN: " + email);
        
        if (email == null) {
            return ResponseEntity.status(400).body(Map.of("success", false, "message", "Email non trouvé dans le token"));
        }
        
        // 2. Trouver l'utilisateur
        Utilisateur user = utilisateurService.getUtilisateurByEmail(email);
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("success", false, "message", "Utilisateur non trouvé"));
        }
        
        // 3. Mettre à jour SEULEMENT les champs autorisés
        if (updates.containsKey("nom") && updates.get("nom") != null) {
            user.setNom(updates.get("nom"));
            System.out.println("📝 Nom mis à jour: " + updates.get("nom"));
        }
        if (updates.containsKey("prenom") && updates.get("prenom") != null) {
            user.setPrenom(updates.get("prenom"));
            System.out.println("📝 Prénom mis à jour: " + updates.get("prenom"));
        }
        if (updates.containsKey("telephone") && updates.get("telephone") != null) {
            user.setTelephone(updates.get("telephone"));
            System.out.println("📝 Téléphone mis à jour: " + updates.get("telephone"));
        }
        
        // ⚠️ NE PAS modifier l'email, le mot de passe, ou le rôle ici !
        // Le mot de passe a son propre endpoint /change-password
        // L'email ne doit pas être modifiable (ou alors avec vérification)
        
        // 4. Sauvegarder
        Utilisateur saved = utilisateurService.saveUtilisateur(user);
        
        System.out.println("✅ Profil mis à jour pour: " + email);
        
        // 5. Retourner la réponse (sans le mot de passe)
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Profil mis à jour avec succès",
            "user", Map.of(
                "id", saved.getId(),
                "nom", saved.getNom(),
                "prenom", saved.getPrenom(),
                "email", saved.getEmail(),
                "telephone", saved.getTelephone(),
                "role", saved.getRole().name()
            )
        ));
        
    } catch (Exception e) {
        e.printStackTrace();
        System.err.println("❌ ERREUR: " + e.getMessage());
        return ResponseEntity.status(500).body(Map.of(
            "success", false, 
            "message", "Erreur interne: " + e.getMessage()
        ));
    }
}

        // Changer le mot de passe
 @PutMapping("/change-password")
public ResponseEntity<?> changePassword(@RequestBody Map<String, String> passwords, 
                                         HttpServletRequest request) {
    try {
        String authHeader = request.getHeader("Authorization");
        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);
        
        Utilisateur user = utilisateurService.getUtilisateurByEmail(email);
        
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("success", false, "message", "Utilisateur non trouvé"));
        }
        
        // Vérifier l'ancien mot de passe (optionnel pour réinitialisation)
        if (passwords.containsKey("currentPassword")) {
            if (!passwordEncoder.matches(passwords.get("currentPassword"), user.getMotDePasse())) {
                return ResponseEntity.status(400).body(Map.of("success", false, "message", "Mot de passe actuel incorrect"));
            }
        }
        
        // Mettre à jour le mot de passe
        user.setMotDePasse(passwordEncoder.encode(passwords.get("newPassword")));
        utilisateurService.saveUtilisateur(user);
        
        return ResponseEntity.ok(Map.of("success", true, "message", "Mot de passe changé avec succès"));
        
    } catch (Exception e) {
        return ResponseEntity.status(500).body(Map.of("success", false, "message", e.getMessage()));
    }
}

    private boolean hasPermission(Role role, String action) {
        if (role == null) return false;

        Map<Role, Set<String>> permissionsMap = new HashMap<>();

        permissionsMap.put(Role.ADMINISTRATEUR, Set.of(
                "CREER_UTILISATEUR", "MODIFIER_UTILISATEUR", "SUPPRIMER_UTILISATEUR",
                "VOIR_STOCK", "MODIFIER_STOCK",
                "VOIR_COMMANDES", "CREER_COMMANDE",
                "VOIR_RAPPORTS", "VOIR_ALERTES",
                "GERER_BONS", "VOIR_MOUVEMENTS"
        ));

        permissionsMap.put(Role.GESTIONNAIRE, Set.of(
                "VOIR_STOCK", "MODIFIER_STOCK",
                "VOIR_COMMANDES", "CREER_COMMANDE",
                "GERER_BONS", "VOIR_MOUVEMENTS"
        ));

        permissionsMap.put(Role.SUPERVISEUR, Set.of(
                "VOIR_STOCK",
                "VOIR_RAPPORTS", "VOIR_ALERTES",
                "VOIR_MOUVEMENTS"
        ));

        permissionsMap.put(Role.MAGASINIER, Set.of(
                "VOIR_STOCK",
                "GERER_BONS", "VOIR_MOUVEMENTS"
        ));

        Set<String> actions = permissionsMap.getOrDefault(role, Set.of());
        return actions.contains(action.toUpperCase());
    }
}