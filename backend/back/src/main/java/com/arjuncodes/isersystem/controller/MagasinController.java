package com.arjuncodes.isersystem.controller;

import com.arjuncodes.isersystem.model.Magasin;
import com.arjuncodes.isersystem.service.MagasinService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/magasin")
public class MagasinController {
    @Autowired
    private MagasinService magasinService;

    @PostMapping("/add")
    public String add(@RequestBody Magasin magasin) {
        magasinService.saveMagasin(magasin);
        return "Magasin ajouté !";
    }

    @GetMapping("/getAll")
    public List<Magasin> getAllMagasins() {
        return magasinService.getAllMagasins();
    }

    @GetMapping("/get/{id_magasin}")
    public Magasin getMagasinById(@PathVariable int id_magasin) {
        return magasinService.getMagasinById(id_magasin);
    }

    @PutMapping("/update/{id_magasin}")
    public String updateMagasin(@PathVariable int id_magasin, @RequestBody Magasin magasinDetails) {
        Magasin existingMagasin = magasinService.getMagasinById(id_magasin);
        existingMagasin.setNom(magasinDetails.getNom());
        existingMagasin.setAdresse(magasinDetails.getAdresse());
        existingMagasin.setRegion(magasinDetails.getRegion());
        magasinService.saveMagasin(existingMagasin);
        return "Magasin modifié avec succès !";
    }

    @DeleteMapping("/delete/{id_magasin}")
    public String deleteMagasin(@PathVariable int id_magasin) {
        magasinService.deleteMagasin(id_magasin);
        return "Magasin supprimé avec succès !";
    }
}