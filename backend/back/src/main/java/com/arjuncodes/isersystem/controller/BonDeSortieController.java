package com.arjuncodes.isersystem.controller;

import com.arjuncodes.isersystem.model.BonDeSortie;
import com.arjuncodes.isersystem.repository.BonDeSortieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bon-sortie")
public class BonDeSortieController {

    @Autowired
    private BonDeSortieRepository repository;

    @GetMapping
    public List<BonDeSortie> getAll() {
        return repository.findAll();
    }


    @GetMapping("/{id}")
    public BonDeSortie getById(@PathVariable int id) {
        return repository.findById(id).orElse(null);
    }

    @PostMapping
    public BonDeSortie create(@RequestBody BonDeSortie bon) {
        return repository.save(bon);
    }

    @PutMapping("/{id}")
    public BonDeSortie update(@PathVariable int id, @RequestBody BonDeSortie bon) {
        BonDeSortie existing = repository.findById(id).orElse(null);
        if (existing != null) {
            existing.setDepartement(bon.getDepartement());
            existing.setCode_machine(bon.getCode_machine());
            existing.setCompte_analytique(bon.getCompte_analytique());
            existing.setDestinataire(bon.getDestinataire());
            existing.setDate(bon.getDate());
            existing.setQuantite(bon.getQuantite());
            existing.setReferenceBon(bon.getReferenceBon());
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