package com.arjuncodes.isersystem.controller;

import com.arjuncodes.isersystem.model.Commande;
import com.arjuncodes.isersystem.service.CommandeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/commandes")
@CrossOrigin("*")
public class CommandeController {

    private final CommandeService commandeService;

    public CommandeController(CommandeService commandeService) {
        this.commandeService = commandeService;
    }

    @GetMapping
    public List<Commande> getAllCommandes() {
        return commandeService.getAllCommandes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Commande> getCommandeById(@PathVariable Long id) {
        return ResponseEntity.ok(commandeService.getCommandeById(id));
    }

    @PostMapping
    public Commande createCommande(@RequestBody Commande commande) {
        return commandeService.saveCommande(commande);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommande(@PathVariable Long id) {
        commandeService.deleteCommande(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/valider/{id}")
    public ResponseEntity<String> validerCommande(@PathVariable Long id) {
        commandeService.validerCommande(id);
        return ResponseEntity.ok("Commande validée");
    }

    @PutMapping("/annuler/{id}")
    public ResponseEntity<String> annulerCommande(@PathVariable Long id) {
        commandeService.annulerCommande(id);
        return ResponseEntity.ok("Commande annulée");
    }

    @PutMapping("/livrer/{id}")
    public ResponseEntity<String> marquerLivree(@PathVariable Long id) {
        commandeService.marquerLivree(id);
        return ResponseEntity.ok("Commande marquée livrée");
    }
}