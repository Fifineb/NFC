package com.arjuncodes.isersystem.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "fournisseur")
public class Fournisseur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_f")
    private Long id;

    @Column(name = "raison_sociale")
    private String raisonSociale;

    @Column(name = "email")
    private String email;

    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    @Column(name = "date_modification")
    private LocalDateTime dateModification;

    @Column(name = "adresse")
    private String adresse;

    @Column(name = "telephone")
    private String telephone;

    @Column(name = "actif")
    private boolean actif;

    // Un fournisseur peut avoir plusieurs commandes
    @OneToMany(mappedBy = "fournisseur", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Commande> commandes = new ArrayList<>();

    public Fournisseur() {}

    public Fournisseur(String raisonSociale, String email, String adresse,
                       String telephone, boolean actif) {
        this.raisonSociale = raisonSociale;
        this.email = email;
        this.adresse = adresse;
        this.telephone = telephone;
        this.actif = actif;
        this.dateCreation = LocalDateTime.now();
        this.dateModification = LocalDateTime.now();
    }

    public boolean estActif() { return actif; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRaisonSociale() { return raisonSociale; }
    public void setRaisonSociale(String raisonSociale) { this.raisonSociale = raisonSociale; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }

    public LocalDateTime getDateModification() { return dateModification; }
    public void setDateModification(LocalDateTime dateModification) { this.dateModification = dateModification; }

    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public boolean isActif() { return actif; }
    public void setActif(boolean actif) { this.actif = actif; }

    public List<Commande> getCommandes() { return commandes; }
    public void setCommandes(List<Commande> commandes) { this.commandes = commandes; }
}