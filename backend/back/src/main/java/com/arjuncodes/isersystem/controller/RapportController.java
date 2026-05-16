package com.arjuncodes.isersystem.controller;

import com.arjuncodes.isersystem.model.Rapport;
import com.arjuncodes.isersystem.service.RapportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/rapports")
public class RapportController {

    private final RapportService rapportService;

    public RapportController(RapportService rapportService) {
        this.rapportService = rapportService;
    }

    @GetMapping
    public ResponseEntity<List<Rapport>> getAll() {
        return ResponseEntity.ok(rapportService.getAllRapports());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rapport> getById(@PathVariable Long id) {
        return ResponseEntity.ok(rapportService.getRapportById(id));
    }

    @PostMapping
    public ResponseEntity<Rapport> create(@RequestBody Rapport rapport) {
        return ResponseEntity.ok(rapportService.createRapport(rapport));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        rapportService.deleteRapport(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Rapport>> getByType(@PathVariable String type) {
        return ResponseEntity.ok(rapportService.getByType(type));
    }
}