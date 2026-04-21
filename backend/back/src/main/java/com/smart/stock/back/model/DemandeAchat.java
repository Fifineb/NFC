package com.smart.stock.back.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "demande_achat")
@Data
public class DemandeAchat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idDa;
    
    @Column(unique = true)
    private String numeroDossier;
    private LocalDate dateDemande;
    private String departement;
    private String service;
    private String natureMateriel;
    private String destination;
    private String referenceMateriel;
    private String fournisseurPropose;
    private String adresseFournisseur;
    private String villePays;
    private String delaiSouhaite;
    private Boolean urgence;
    private String emetteur;
    private String chefService;
    private String visa;
    private String statut;
    private LocalDateTime dateCreation;
    
    @ManyToOne
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;

    public DemandeAchat(Integer idDa, String numeroDossier, LocalDate dateDemande, String departement, String service,
            String natureMateriel, String destination, String referenceMateriel, String fournisseurPropose,
            String adresseFournisseur, String villePays, String delaiSouhaite, Boolean urgence, String emetteur,
            String chefService, String visa, String statut, LocalDateTime dateCreation, Utilisateur utilisateur) {
        this.idDa = idDa;
        this.numeroDossier = numeroDossier;
        this.dateDemande = dateDemande;
        this.departement = departement;
        this.service = service;
        this.natureMateriel = natureMateriel;
        this.destination = destination;
        this.referenceMateriel = referenceMateriel;
        this.fournisseurPropose = fournisseurPropose;
        this.adresseFournisseur = adresseFournisseur;
        this.villePays = villePays;
        this.delaiSouhaite = delaiSouhaite;
        this.urgence = urgence;
        this.emetteur = emetteur;
        this.chefService = chefService;
        this.visa = visa;
        this.statut = statut;
        this.dateCreation = dateCreation;
        this.utilisateur = utilisateur;
    }

    public DemandeAchat() {
    }

    

}