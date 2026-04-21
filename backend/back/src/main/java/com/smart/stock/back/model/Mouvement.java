package com.smart.stock.back.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Mouvement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_mouvement;

    private LocalDateTime date_mouvement;
    private Double quantite;
    private String reference_bon;
    private String observation;
    private String type_mouvement;

    @ManyToOne
    @JoinColumn(name = "stock_id")
    private Stock stock;

    @ManyToOne
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;

    public Mouvement(Integer id_mouvement, LocalDateTime date_mouvement, Double quantite, String reference_bon,
            String observation, String type_mouvement, Stock stock, Utilisateur utilisateur) {
        this.id_mouvement = id_mouvement;
        this.date_mouvement = date_mouvement;
        this.quantite = quantite;
        this.reference_bon = reference_bon;
        this.observation = observation;
        this.type_mouvement = type_mouvement;
        this.stock = stock;
        this.utilisateur = utilisateur;
    }

    public Integer getId_mouvement() {
        return id_mouvement;
    }

    public void setId_mouvement(Integer id_mouvement) {
        this.id_mouvement = id_mouvement;
    }

    public LocalDateTime getDate_mouvement() {
        return date_mouvement;
    }

    public void setDate_mouvement(LocalDateTime date_mouvement) {
        this.date_mouvement = date_mouvement;
    }

    public Double getQuantite() {
        return quantite;
    }

    public void setQuantite(Double quantite) {
        this.quantite = quantite;
    }

    public String getReference_bon() {
        return reference_bon;
    }

    public void setReference_bon(String reference_bon) {
        this.reference_bon = reference_bon;
    }

    public String getObservation() {
        return observation;
    }

    public void setObservation(String observation) {
        this.observation = observation;
    }

    public String getType_mouvement() {
        return type_mouvement;
    }

    public void setType_mouvement(String type_mouvement) {
        this.type_mouvement = type_mouvement;
    }

    public Stock getStock() {
        return stock;
    }

    public void setStock(Stock stock) {
        this.stock = stock;
    }

    public Utilisateur getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }

    




}