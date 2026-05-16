package com.arjuncodes.isersystem.service;

import com.arjuncodes.isersystem.model.Categorie;
import com.arjuncodes.isersystem.repository.CategorieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategorieServiceImpl implements CategorieService {

    @Autowired
    private CategorieRepository categorieRepository;

    @Override
    public Categorie saveCategorie(Categorie categorie) {
        return categorieRepository.save(categorie);
    }

    @Override
    public List<Categorie> getAllCategories() {
        return categorieRepository.findAll();
    }

    @Override
    public Categorie getCategorieById(int id_categorie) {
        return categorieRepository.findById(id_categorie)
                .orElseThrow(() -> new RuntimeException("Catégorie non trouvée avec l'id : " + id_categorie));
    }

    @Override
    public void deleteCategorie(int id_categorie) {
        categorieRepository.deleteById(id_categorie);
    }
}