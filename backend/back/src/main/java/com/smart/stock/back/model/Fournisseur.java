package com.smart.stock.back.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Fournisseur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_f;

    private String raison_sociale;
    private String email;
    private String adresse;
    private String telephone;

    private Boolean actif;

    private LocalDateTime date_creation;
    private LocalDateTime date_modification;

    @OneToMany(mappedBy = "fournisseur")
    private List<Commande> commandes;

    public Fournisseur() {
    }
    
    public Fournisseur(Integer id_f, String raison_sociale, String email, String adresse, String telephone,
            Boolean actif, LocalDateTime date_creation, LocalDateTime date_modification, List<Commande> commandes) {
        this.id_f = id_f;
        this.raison_sociale = raison_sociale;
        this.email = email;
        this.adresse = adresse;
        this.telephone = telephone;
        this.actif = actif;
        this.date_creation = date_creation;
        this.date_modification = date_modification;
        this.commandes = commandes;
    }

    public Integer getId_f() {
        return id_f;
    }

    public void setId_f(Integer id_f) {
        this.id_f = id_f;
    }

    public String getRaison_sociale() {
        return raison_sociale;
    }

    public void setRaison_sociale(String raison_sociale) {
        this.raison_sociale = raison_sociale;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public Boolean getActif() {
        return actif;
    }

    public void setActif(Boolean actif) {
        this.actif = actif;
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

    public List<Commande> getCommandes() {
        return commandes;
    }

    public void setCommandes(List<Commande> commandes) {
        this.commandes = commandes;
    }

    
}
