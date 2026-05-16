package com.arjuncodes.isersystem.controller;

import com.arjuncodes.isersystem.model.Alerte;
import com.arjuncodes.isersystem.model.StatutAlerte;
import com.arjuncodes.isersystem.service.AlerteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/alerte")
public class AlerteController {

    private final AlerteService alerteService;

    public AlerteController(AlerteService alerteService) {
        this.alerteService = alerteService;
    }

    @PostMapping("/add")
    public ResponseEntity<Alerte> addAlerte(@RequestBody Alerte alerte) {
        Alerte savedAlerte = alerteService.createAlerte(alerte);
        return new ResponseEntity<>(savedAlerte, HttpStatus.CREATED);
    }

    @GetMapping("/getAll")
    public List<Alerte> getAllAlertes() {
        return alerteService.getAllAlertes();
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Alerte> getAlerteById(@PathVariable Long id) {
        Alerte alerte = alerteService.getAlerteById(id);
        return ResponseEntity.ok(alerte);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAlerte(@PathVariable Long id) {
        alerteService.deleteAlerte(id);
        return ResponseEntity.ok("Alerte supprimée avec succès !");
    }

    @PutMapping("/activer/{id}")
    public ResponseEntity<Alerte> activerAlerte(@PathVariable Long id) {
        Alerte alerte = alerteService.activerAlerte(id);
        return ResponseEntity.ok(alerte);
    }

    @PutMapping("/desactiver/{id}")
    public ResponseEntity<Alerte> desactiverAlerte(@PathVariable Long id) {
        Alerte alerte = alerteService.desactiverAlerte(id);
        return ResponseEntity.ok(alerte);
    }

    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<Alerte>> getAlertesByStatut(@PathVariable StatutAlerte statut) {
        return ResponseEntity.ok(alerteService.getAlertesByStatut(statut));
    }

    @GetMapping("/matiere/{id}")
    public ResponseEntity<List<Alerte>> getAlertesByMatiere(@PathVariable Long id) {
        return ResponseEntity.ok(alerteService.getAlertesByMatiere(id));
    }
}