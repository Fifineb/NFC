
package com.smart.stock.back.controller;

import com.smart.stock.back.model.DemandeAchat;
import com.smart.stock.back.service.DemandeAchatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/demande-achat")
@CrossOrigin(origins = "http://localhost:5173")
public class DemandeAchatController {
    
    @Autowired
    private DemandeAchatService demandeAchatService;
    
    @GetMapping("/all")
    public ResponseEntity<List<DemandeAchat>> getAllDemandes() {
        return ResponseEntity.ok(demandeAchatService.getAllDemandes());
    }
    
    @GetMapping("/urgentes")
    public ResponseEntity<List<DemandeAchat>> getDemandesUrgentes() {
        return ResponseEntity.ok(demandeAchatService.getDemandesUrgentes());
    }
    
    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<DemandeAchat>> getDemandesByStatut(@PathVariable String statut) {
        return ResponseEntity.ok(demandeAchatService.getDemandesByStatut(statut));
    }
    
    @PostMapping("/create")
    public ResponseEntity<DemandeAchat> createDemandeAchat(@RequestBody DemandeAchat demande) {
        return ResponseEntity.ok(demandeAchatService.saveDemandeAchat(demande));
    }
}