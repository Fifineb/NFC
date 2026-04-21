package com.smart.stock.back.controller;

import com.smart.stock.back.model.BonEntree;
import com.smart.stock.back.service.BonEntreeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bon-entree")
@CrossOrigin(origins = "http://localhost:5173")
public class BonEntreeController {
    
    @Autowired
    private BonEntreeService bonEntreeService;
    
    @GetMapping("/all")
    public ResponseEntity<List<BonEntree>> getAllBonEntree() {
        return ResponseEntity.ok(bonEntreeService.getAllBonEntree());
    }
    
    @GetMapping("/recent")
    public ResponseEntity<List<BonEntree>> getRecentBonEntree() {
        return ResponseEntity.ok(bonEntreeService.getRecentBonEntree());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BonEntree> getBonEntreeById(@PathVariable Integer id) {
        return ResponseEntity.ok(bonEntreeService.getBonEntreeById(id));
    }
    
    @PostMapping("/create")
    public ResponseEntity<BonEntree> createBonEntree(@RequestBody BonEntree bonEntree) {
        return ResponseEntity.ok(bonEntreeService.saveBonEntree(bonEntree));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBonEntree(@PathVariable Integer id) {
        bonEntreeService.deleteBonEntree(id);
        return ResponseEntity.ok().build();
    }
}