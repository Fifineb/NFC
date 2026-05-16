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