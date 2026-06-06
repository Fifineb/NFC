package com.arjuncodes.isersystem.controller;

import com.arjuncodes.isersystem.model.Role;
import com.arjuncodes.isersystem.model.Utilisateur;
import com.arjuncodes.isersystem.service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<Map<String, Object>> updateProfile(@RequestBody Map<String, String> updates,
                                                              HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                response.put("success", false);
                response.put("message", "Token manquant ou invalide");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
            String token = authHeader.substring(7);
            
            // ✅ Appel sur l'instance injectée (pas statique)
            String email = jwtUtil.extractEmail(token);
            
            System.out.println("📧 Email récupéré: " + email);
            
            Utilisateur user = utilisateurService.getUtilisateurByEmail(email);
            
            if (user == null) {
                response.put("success", false);
                response.put("message", "Utilisateur non trouvé pour l'email: " + email);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            // Mise à jour des champs
            if (updates.containsKey("nom")) {
                user.setNom(updates.get("nom"));
            }
            if (updates.containsKey("prenom")) {
                user.setPrenom(updates.get("prenom"));
            }
            if (updates.containsKey("email")) {
                user.setEmail(updates.get("email"));
            }
            if (updates.containsKey("telephone")) {
                user.setTelephone(updates.get("telephone"));
            }
            
            utilisateurService.saveUtilisateur(user);
            
            response.put("success", true);
            response.put("message", "Profil mis à jour avec succès");
            response.put("user", Map.of(
                "id", user.getId(),
                "nom", user.getNom(),
                "prenom", user.getPrenom(),
                "email", user.getEmail(),
                "telephone", user.getTelephone(),
                "role", user.getRole()
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
        // Changer le mot de passe
    @PutMapping("/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(@RequestBody Map<String, String> passwords, 
                                                               @AuthenticationPrincipal String email) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Utilisateur user = utilisateurService.getUtilisateurByEmail(email);
            
            if (!passwordEncoder.matches(passwords.get("currentPassword"), user.getMotDePasse())) {
                response.put("success", false);
                response.put("message", "Mot de passe actuel incorrect");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            user.setMotDePasse(passwordEncoder.encode(passwords.get("newPassword")));
            utilisateurService.saveUtilisateur(user);
            
            response.put("success", true);
            response.put("message", "Mot de passe changé avec succès");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
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