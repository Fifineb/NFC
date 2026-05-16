package com.arjuncodes.isersystem.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categorie")
public class Categorie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categorie")
    private Long id;

    @Column(name = "nom_categorie")
    private String nomCategorie;

    @Column(name = "description")
    private String description;

    @ManyToMany(mappedBy = "categories")
    private List<MatierePremiere> matieresPremieres = new ArrayList<>();

    public Categorie() {}

    public Categorie(String nomCategorie, String description) {
        this.nomCategorie = nomCategorie;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }


    public String getNom() { return nomCategorie; }
    public void setNom(String nom) { this.nomCategorie = nom; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<MatierePremiere> getMatieresPremieres() { return matieresPremieres; }
    public void setMatieresPremieres(List<MatierePremiere> m) { this.matieresPremieres = m; }
}