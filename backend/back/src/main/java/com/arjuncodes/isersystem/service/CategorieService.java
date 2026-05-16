package com.arjuncodes.isersystem.service;

import com.arjuncodes.isersystem.model.Categorie;
import java.util.List;

public interface CategorieService {
    Categorie saveCategorie(Categorie categorie);
    List<Categorie> getAllCategories();

    Categorie getCategorieById(int id_categorie);

    void deleteCategorie(int id_categorie);
}