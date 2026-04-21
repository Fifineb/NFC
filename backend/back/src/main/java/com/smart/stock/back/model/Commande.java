package com.smart.stock.back.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class Commande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_cm;

    private LocalDateTime date_commande;
    private LocalDate date_livraison_prevue;
    private LocalDate date_livraison_reelle;

    private Double quantite_commandee;

    @Enumerated(EnumType.STRING)
    private StatutCommande statut;

    @ManyToOne
    @JoinColumn(name = "fournisseur_id")
    private Fournisseur fournisseur;

    @ManyToOne
    @JoinColumn(name = "matiere_id")
    private MatierePremiere matiere;
    
    public Commande(Integer id_cm, LocalDateTime date_commande, LocalDate date_livraison_prevue,
            LocalDate date_livraison_reelle, Double quantite_commandee, StatutCommande statut, Fournisseur fournisseur,
            MatierePremiere matiere) {
        this.id_cm = id_cm;
        this.date_commande = date_commande;
        this.date_livraison_prevue = date_livraison_prevue;
        this.date_livraison_reelle = date_livraison_reelle;
        this.quantite_commandee = quantite_commandee;
        this.statut = statut;
        this.fournisseur = fournisseur;
        this.matiere = matiere;
    }

    public Integer getId_cm() {
        return id_cm;
    }

    public void setId_cm(Integer id_cm) {
        this.id_cm = id_cm;
    }

    public LocalDateTime getDate_commande() {
        return date_commande;
    }

    public void setDate_commande(LocalDateTime date_commande) {
        this.date_commande = date_commande;
    }

    public LocalDate getDate_livraison_prevue() {
        return date_livraison_prevue;
    }

    public void setDate_livraison_prevue(LocalDate date_livraison_prevue) {
        this.date_livraison_prevue = date_livraison_prevue;
    }

    public LocalDate getDate_livraison_reelle() {
        return date_livraison_reelle;
    }

    public void setDate_livraison_reelle(LocalDate date_livraison_reelle) {
        this.date_livraison_reelle = date_livraison_reelle;
    }

    public Double getQuantite_commandee() {
        return quantite_commandee;
    }

    public void setQuantite_commandee(Double quantite_commandee) {
        this.quantite_commandee = quantite_commandee;
    }

    public StatutCommande getStatut() {
        return statut;
    }

    public void setStatut(StatutCommande statut) {
        this.statut = statut;
    }

    public Fournisseur getFournisseur() {
        return fournisseur;
    }

    public void setFournisseur(Fournisseur fournisseur) {
        this.fournisseur = fournisseur;
    }

    public MatierePremiere getMatiere() {
        return matiere;
    }

    public void setMatiere(MatierePremiere matiere) {
        this.matiere = matiere;
    }

    // getters & setters
}