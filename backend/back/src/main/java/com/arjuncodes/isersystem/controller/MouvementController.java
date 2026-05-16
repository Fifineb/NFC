package com.arjuncodes.isersystem.controller;

import com.arjuncodes.isersystem.model.*;
import com.arjuncodes.isersystem.service.MouvementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/mouvements")
public class MouvementController {

    private final MouvementService mouvementService;

    public MouvementController(MouvementService mouvementService) {
        this.mouvementService = mouvementService;
    }

    @GetMapping
    public ResponseEntity<List<Mouvement>> getAll() {
        return ResponseEntity.ok(mouvementService.getAllMouvements());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Mouvement> getById(@PathVariable Long id) {
        return ResponseEntity.ok(mouvementService.getMouvementById(id));
    }

    @PostMapping("/bon-entree")
    public ResponseEntity<BonDeEntree> createBonEntree(@RequestBody BonDeEntree bon) {
        return ResponseEntity.ok(mouvementService.createBonEntree(bon));
    }

    @PostMapping("/bon-sortie")
    public ResponseEntity<BonDeSortie> createBonSortie(@RequestBody BonDeSortie bon) {
        return ResponseEntity.ok(mouvementService.createBonSortie(bon));
    }

    @PostMapping("/bon-consommation")
    public ResponseEntity<BonDeConsommation> createBonConsommation(@RequestBody BonDeConsommation bon) {
        return ResponseEntity.ok(mouvementService.createBonConsommation(bon));
    }

    @PostMapping("/commande-achat")
    public ResponseEntity<CommandeAchat> createCommandeAchat(@RequestBody CommandeAchat commande) {
        return ResponseEntity.ok(mouvementService.createCommandeAchat(commande));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        mouvementService.deleteMouvement(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stock/{id}")
    public ResponseEntity<List<Mouvement>> getByStock(@PathVariable Long id) {
        return ResponseEntity.ok(mouvementService.getMouvementsByStock(id));
    }
}