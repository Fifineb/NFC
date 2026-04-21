package com.smart.stock.back.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class MatierePremiere {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_pr;

    private String nom_pr;
    private String description;
    private Double seuil_minimal;
    private String unite_mesure;

    private LocalDateTime date_creation;
    private LocalDateTime date_modification;

    @Enumerated(EnumType.STRING)
    private StatutMatiere statut;

    private Boolean actif;


    @ManyToMany
    @JoinTable(
    name = "matiere_categorie",
    joinColumns = @JoinColumn(name = "matiere_id"),
    inverseJoinColumns = @JoinColumn(name = "categorie_id")
    )
    private List<Categorie> categories;

    
    public MatierePremiere(Integer id_pr, String nom_pr, String description, Double seuil_minimal, String unite_mesure,
            LocalDateTime date_creation, LocalDateTime date_modification, StatutMatiere statut, Boolean actif) {
        this.id_pr = id_pr;
        this.nom_pr = nom_pr;
        this.description = description;
        this.seuil_minimal = seuil_minimal;
        this.unite_mesure = unite_mesure;
        this.date_creation = date_creation;
        this.date_modification = date_modification;
        this.statut = statut;
        this.actif = actif;
    }

    public Integer getId_pr() {
        return id_pr;
    }

    public void setId_pr(Integer id_pr) {
        this.id_pr = id_pr;
    }

    public String getNom_pr() {
        return nom_pr;
    }

    public void setNom_pr(String nom_pr) {
        this.nom_pr = nom_pr;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getSeuil_minimal() {
        return seuil_minimal;
    }

    public void setSeuil_minimal(Double seuil_minimal) {
        this.seuil_minimal = seuil_minimal;
    }

    public String getUnite_mesure() {
        return unite_mesure;
    }

    public void setUnite_mesure(String unite_mesure) {
        this.unite_mesure = unite_mesure;
    }

    public LocalDateTime getDate_creation() {
        return date_creation;
    }

    public void setDate_creation(LocalDateTime date_creation) {
        this.date_creation = date_creation;
    }

    public LocalDateTime getDate_modification() {
        return date_modification;
    }

    public void setDate_modification(LocalDateTime date_modification) {
        this.date_modification = date_modification;
    }

    public StatutMatiere getStatut() {
        return statut;
    }

    public void setStatut(StatutMatiere statut) {
        this.statut = statut;
    }

    public Boolean getActif() {
        return actif;
    }

    public void setActif(Boolean actif) {
        this.actif = actif;
    }

    
}