package com.smart.stock.back.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_user;

    private String nom;
    private String prenom;
    private String email;
    private String mot_de_passe;

    @Enumerated(EnumType.STRING)
    private StatutUtilisateur statut;

    @Enumerated(EnumType.STRING)
    private RoleUtilisateur role;

    private LocalDateTime date_creation;

    @OneToMany(mappedBy = "utilisateur")
    private List<Mouvement> mouvements;
    
    public Utilisateur() {
    }

    public Utilisateur(Integer id_user, String nom, String prenom, String email, String mot_de_passe,
            StatutUtilisateur statut, RoleUtilisateur role, LocalDateTime date_creation, List<Mouvement> mouvements) {
        this.id_user = id_user;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.mot_de_passe = mot_de_passe;
        this.statut = statut;
        this.role = role;
        this.date_creation = date_creation;
        this.mouvements = mouvements;
    }
    
    public Integer getId_user() {
        return id_user;
    }

    public void setId_user(Integer id_user) {
        this.id_user = id_user;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMot_de_passe() {
        return mot_de_passe;
    }

    public void setMot_de_passe(String mot_de_passe) {
        this.mot_de_passe = mot_de_passe;
    }

    public StatutUtilisateur getStatut() {
        return statut;
    }

    public void setStatut(StatutUtilisateur statut) {
        this.statut = statut;
    }

    public RoleUtilisateur getRole() {
        return role;
    }

    public void setRole(RoleUtilisateur role) {
        this.role = role;
    }

    public LocalDateTime getDate_creation() {
        return date_creation;
    }

    public void setDate_creation(LocalDateTime date_creation) {
        this.date_creation = date_creation;
    }

    public List<Mouvement> getMouvements() {
        return mouvements;
    }

    public void setMouvements(List<Mouvement> mouvements) {
        this.mouvements = mouvements;
    }

    

}