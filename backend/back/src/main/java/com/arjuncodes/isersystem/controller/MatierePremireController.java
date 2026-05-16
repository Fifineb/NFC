package com.arjuncodes.isersystem.controller;

import com.arjuncodes.isersystem.model.MatierePremiere;
import com.arjuncodes.isersystem.model.Stock;
import com.arjuncodes.isersystem.service.MatierePremiereService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/matiere-premiere")
public class MatierePremireController {

    private final MatierePremiereService matierePremiereService;

    public MatierePremireController(MatierePremiereService matierePremiereService) {
        this.matierePremiereService = matierePremiereService;
    }

    @PostMapping("/add")
    public ResponseEntity<MatierePremiere> add(@RequestBody MatierePremiere matierePremiere) {
        MatierePremiere saved = matierePremiereService.saveMatierePremiere(matierePremiere);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping("/getAll")
    public List<MatierePremiere> getAll() {
        return matierePremiereService.getAllMatieresPremieres();
    }

    @GetMapping("/get/{id}")
    public MatierePremiere getById(@PathVariable Long id) {
        return matierePremiereService.getMatierePremiereById(id);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<MatierePremiere> update(
            @PathVariable Long id,
            @RequestBody MatierePremiere details) {
        MatierePremiere existing = matierePremiereService.getMatierePremiereById(id);
        existing.setNom_PR(details.getNom_PR());
        existing.setDescription(details.getDescription());
        existing.setSeuil_minimal(details.getSeuil_minimal());
        existing.setUnite_mesure(details.getUnite_mesure());
        existing.setStatut(details.getStatut());
        existing.setActif(details.isActif());
        MatierePremiere updated = matierePremiereService.saveMatierePremiere(existing);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        matierePremiereService.deleteMatierePremiere(id);
        return ResponseEntity.ok("Matière première supprimée avec succès !");
    }

    @GetMapping("/{id}/stocks")
    public ResponseEntity<List<Stock>> getStocksByMatiere(@PathVariable Long id) {
        return ResponseEntity.ok(matierePremiereService.getStocksByMatiere(id));
    }
}