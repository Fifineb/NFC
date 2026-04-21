package com.smart.stock.back.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "bon_entree_ligne")
@Data
public class BonEntreeLigne {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idLigne;
    
    @ManyToOne
    @JoinColumn(name = "bon_entree_id")
    private BonEntree bonEntree;
    
    @ManyToOne
    @JoinColumn(name = "produit_id")
    private MatierePremiere produit;
    
    private Double quantiteConforme;
    private Double quantiteRefusee;
    private Double prixUnitaire;
    private Double montant;
    private String uniteMesure;
    
    public BonEntreeLigne() {
    }

    public BonEntreeLigne(Integer idLigne, BonEntree bonEntree, MatierePremiere produit, Double quantiteConforme,
            Double quantiteRefusee, Double prixUnitaire, Double montant, String uniteMesure) {
        this.idLigne = idLigne;
        this.bonEntree = bonEntree;
        this.produit = produit;
        this.quantiteConforme = quantiteConforme;
        this.quantiteRefusee = quantiteRefusee;
        this.prixUnitaire = prixUnitaire;
        this.montant = montant;
        this.uniteMesure = uniteMesure;
    }

    

}