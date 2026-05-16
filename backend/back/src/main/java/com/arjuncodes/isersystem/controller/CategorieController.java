package com.arjuncodes.isersystem.controller;

import com.arjuncodes.isersystem.model.Categorie;
import com.arjuncodes.isersystem.service.CategorieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categorie")
public class CategorieController {

    @Autowired
    private CategorieService categorieService;

    @PostMapping("/add")
    public String add(@RequestBody Categorie categorie) {
        categorieService.saveCategorie(categorie);
        return "Catégorie ajoutée !";
    }

    @GetMapping("/getAll")
    public List<Categorie> getAllCategories() {
        return categorieService.getAllCategories();
    }

    @GetMapping("/get/{id_categorie}")
    public Categorie getCategorieById(@PathVariable int id_categorie) {
        return categorieService.getCategorieById(id_categorie);
    }

    @PutMapping("/update/{id_categorie}")
    public String updateCategorie(@PathVariable int id_categorie, @RequestBody Categorie categorieDetails) {
        Categorie existingCategorie = categorieService.getCategorieById(id_categorie);
        existingCategorie.setNom(categorieDetails.getNom());
        existingCategorie.setDescription(categorieDetails.getDescription());
        categorieService.saveCategorie(existingCategorie);
        return "Catégorie modifiée avec succès !";
    }

    @DeleteMapping("/delete/{id_categorie}")
    public String deleteCategorie(@PathVariable int id_categorie) {
        categorieService.deleteCategorie(id_categorie);
        return "Catégorie supprimée avec succès !";
    }
}