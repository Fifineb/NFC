package com.arjuncodes.isersystem.controller;

import com.arjuncodes.isersystem.model.BonDeConsommation;
import com.arjuncodes.isersystem.repository.BonDeConsommationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bon-consommation")
public class BonDeConsommationController {

    @Autowired
    private BonDeConsommationRepository repository;

    @GetMapping
    public List<BonDeConsommation> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public BonDeConsommation getById(@PathVariable int id) {
        return repository.findById(id).orElse(null);
    }

    @PostMapping
    public BonDeConsommation create(@RequestBody BonDeConsommation bon) {
        return repository.save(bon);
    }

    @PutMapping("/{id}")
    public BonDeConsommation update(@PathVariable int id, @RequestBody BonDeConsommation bon) {
        BonDeConsommation existing = repository.findById(id).orElse(null);
        if (existing != null) {
            existing.setDate(bon.getDate());
            existing.setQuantite(bon.getQuantite());
            existing.setReference_bon(bon.getReference_bon());
            existing.setObservation(bon.getObservation());
            return repository.save(existing);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        repository.deleteById(id);
    }
}