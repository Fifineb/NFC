package com.arjuncodes.isersystem.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "matiere_premiere")
public class MatierePremiere {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pr")
    private Long id;

    @Column(name = "nom_pr")
    private String nomPR;

    @Column(name = "description")
    private String description;

    @Column(name = "seuil_minimal")
    private Double seuilMinimal;

    @Column(name = "unite_mesure")
    private String uniteMesure;

    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    @Column(name = "date_modification")
    private LocalDateTime dateModification;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut")
    private StatutMatiere statut;

    @Column(name = "actif")
    private boolean actif;

    @OneToMany(mappedBy = "matierePremiere", cascade = CascadeType.ALL)
    private List<Stock> stocks = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "matiere_categorie",
            joinColumns = @JoinColumn(name = "matiere_id"),
            inverseJoinColumns = @JoinColumn(name = "categorie_id")
    )
    private List<Categorie> categories = new ArrayList<>();

    @OneToMany(mappedBy = "matierePremiere", cascade = CascadeType.ALL)
    private List<Alerte> alertes = new ArrayList<>();

    @OneToMany(mappedBy = "matierePremiere", cascade = CascadeType.ALL)
    private List<Commande> commandes = new ArrayList<>();

    public MatierePremiere() {}

    public MatierePremiere(String nomPR, String description, Double seuilMinimal,
                           String uniteMesure, StatutMatiere statut, boolean actif) {
        this.nomPR = nomPR;
        this.description = description;
        this.seuilMinimal = seuilMinimal;
        this.uniteMesure = uniteMesure;
        this.statut = statut;
        this.actif = actif;
        this.dateCreation = LocalDateTime.now();
        this.dateModification = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.dateModification = LocalDateTime.now();
    }

    public boolean estEnRupture() { return this.statut == StatutMatiere.RUPTURE; }
    public void modifierSeuil(double s) { this.seuilMinimal = s; }
    public boolean verifierSeuil() { return this.statut != StatutMatiere.RUPTURE; }

    // ===== GETTERS & SETTERS =====
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    // Getters avec les DEUX noms pour compatibilité controllers
    public String getNomPR() { return nomPR; }
    public void setNomPR(String nomPR) { this.nomPR = nomPR; }
    public String getNom_PR() { return nomPR; }
    public void setNom_PR(String nomPR) { this.nomPR = nomPR; }  // ← pour MatierePremierController

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getSeuilMinimal() { return seuilMinimal; }
    public void setSeuilMinimal(Double seuilMinimal) { this.seuilMinimal = seuilMinimal; }
    public double getSeuil_minimal() { return seuilMinimal; }
    public void setSeuil_minimal(double seuilMinimal) { this.seuilMinimal = seuilMinimal; } // ← controller

    public String getUniteMesure() { return uniteMesure; }
    public void setUniteMesure(String uniteMesure) { this.uniteMesure = uniteMesure; }
    public String getUnite_mesure() { return uniteMesure; }
    public void setUnite_mesure(String uniteMesure) { this.uniteMesure = uniteMesure; } // ← controller

    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }

    public LocalDateTime getDateModification() { return dateModification; }
    public void setDateModification(LocalDateTime dateModification) {
        this.dateModification = dateModification;
    }

    public StatutMatiere getStatut() { return statut; }
    public void setStatut(StatutMatiere statut) { this.statut = statut; }

    public boolean isActif() { return actif; }
    public void setActif(boolean actif) { this.actif = actif; }

    public List<Stock> getStocks() { return stocks; }
    public void setStocks(List<Stock> stocks) { this.stocks = stocks; }

    public List<Categorie> getCategories() { return categories; }
    public void setCategories(List<Categorie> categories) { this.categories = categories; }

    public List<Alerte> getAlertes() { return alertes; }
    public void setAlertes(List<Alerte> alertes) { this.alertes = alertes; }

    public List<Commande> getCommandes() { return commandes; }
    public void setCommandes(List<Commande> commandes) { this.commandes = commandes; }
}