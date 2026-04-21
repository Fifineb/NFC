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
}