package com.arjuncodes.isersystem.controller;

import com.arjuncodes.isersystem.model.Fournisseur;
import com.arjuncodes.isersystem.service.FournisseurService;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fournisseur")
public class FournisseurController {

    private final FournisseurService fournisseurService;

    public FournisseurController(FournisseurService fournisseurService) {
        this.fournisseurService = fournisseurService;
    }

    @PostMapping("/add")
    public Map<String, Object> add(@RequestBody Fournisseur fournisseur) {
        Fournisseur saved = fournisseurService.saveFournisseur(fournisseur);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Fournisseur ajouté avec succès !");
        response.put("fournisseur", saved);
        return response;
    }

    @GetMapping("/getAll")
    public List<Fournisseur> getAll() {
        return fournisseurService.getAllFournisseurs();
    }

    @GetMapping("/get/{id}")
    public Fournisseur getById(@PathVariable Long id) {
        return fournisseurService.getFournisseurById(id);
    }

    @GetMapping("/getByEmail/{email}")
    public Fournisseur getByEmail(@PathVariable String email) {
        return fournisseurService.getFournisseurByEmail(email);
    }

    @PutMapping("/update/{id}")
    public Map<String, Object> update(@PathVariable Long id,
                                      @RequestBody Fournisseur details) {
        Fournisseur updated = fournisseurService.updateFournisseur(id, details);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Fournisseur modifié avec succès !");
        response.put("fournisseur", updated);
        return response;
    }

    @DeleteMapping("/delete/{id}")
    public Map<String, Object> delete(@PathVariable Long id) {
        fournisseurService.deleteFournisseur(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Fournisseur supprimé avec succès !");
        return response;
    }

    @GetMapping("/search/{nom}")
    public List<Fournisseur> searchByNom(@PathVariable String nom) {
        return fournisseurService.searchFournisseurByNom(nom);
    }

    @GetMapping("/actifs")
    public List<Fournisseur> getActifs() {
        return fournisseurService.getFournisseursActifs();
    }

    @GetMapping("/inactifs")
    public List<Fournisseur> getInactifs() {
        return fournisseurService.getFournisseursInactifs();
    }

    @PutMapping("/activer/{id}")
    public Map<String, Object> activer(@PathVariable Long id) {
        Fournisseur f = fournisseurService.activerFournisseur(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Fournisseur activé !");
        response.put("fournisseur", f);
        return response;
    }

    @PutMapping("/desactiver/{id}")
    public Map<String, Object> desactiver(@PathVariable Long id) {
        Fournisseur f = fournisseurService.desactiverFournisseur(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Fournisseur désactivé !");
        response.put("fournisseur", f);
        return response;
    }
}