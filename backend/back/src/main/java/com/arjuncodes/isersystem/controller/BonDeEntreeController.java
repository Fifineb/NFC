package com.arjuncodes.isersystem.controller;

import com.arjuncodes.isersystem.model.BonDeEntree;
import com.arjuncodes.isersystem.repository.BonDeEntreeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bon-entree")
public class BonDeEntreeController {

    @Autowired
    private BonDeEntreeRepository repository;

    @GetMapping
    public List<BonDeEntree> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public BonDeEntree getById(@PathVariable int id) {
        return repository.findById(id).orElse(null);
    }

    @PostMapping
    public BonDeEntree create(@RequestBody BonDeEntree bon) {
        return repository.save(bon);
    }

    @PutMapping("/{id}")
    public BonDeEntree update(@PathVariable int id, @RequestBody BonDeEntree bon) {
        BonDeEntree existing = repository.findById(id).orElse(null);
        if (existing != null) {
            existing.setNumFacture(bon.getNumFacture());
            existing.setQuantiteConforme(bon.getQuantiteConforme());
            existing.setQuantiteRefusee(bon.getQuantiteRefusee());
            existing.setPrixUnitaireAchat(bon.getPrixUnitaireAchat());
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
