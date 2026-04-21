package com.smart.stock.back.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Categorie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_categorie;

    private String nom_categorie;
    private String description;

    @ManyToMany(mappedBy = "categories")
    private List<MatierePremiere> matieres;

    public Categorie(Integer id_categorie, String nom_categorie, String description, List<MatierePremiere> matieres) {
        this.id_categorie = id_categorie;
        this.nom_categorie = nom_categorie;
        this.description = description;
        this.matieres = matieres;
    }

    public Integer getId_categorie() {
        return id_categorie;
    }

    public void setId_categorie(Integer id_categorie) {
        this.id_categorie = id_categorie;
    }

    public String getNom_categorie() {
        return nom_categorie;
    }

    public void setNom_categorie(String nom_categorie) {
        this.nom_categorie = nom_categorie;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<MatierePremiere> getMatieres() {
        return matieres;
    }

    public void setMatieres(List<MatierePremiere> matieres) {
        this.matieres = matieres;
    }

    
}