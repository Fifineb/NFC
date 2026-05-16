package com.arjuncodes.isersystem.model;

import jakarta.persistence.*;

@Entity
@Table(name = "bon_entree")
@DiscriminatorValue("BON_ENTREE")
public class BonDeEntree extends Mouvement {

    @Column(name = "num_facture")
    private String numFacture;

    @Column(name = "quantite_conforme")
    private Double quantiteConforme;

    @Column(name = "quantite_refusee")
    private Double quantiteRefusee;

    @Column(name = "prix_unitaire_achat")
    private Double prixUnitaireAchat;

    public BonDeEntree() {}

    @Override
    public void executer() {
        System.out.println("Exécution BonDeEntree - facture: " + numFacture);
    }

    public double calculerMontantNet() {
        if (quantiteConforme != null && prixUnitaireAchat != null)
            return quantiteConforme * prixUnitaireAchat;
        return 0;
    }

    public String getNumFacture() { return numFacture; }
    public void setNumFacture(String numFacture) { this.numFacture = numFacture; }

    public Double getQuantiteConforme() { return quantiteConforme; }
    public void setQuantiteConforme(Double quantiteConforme) {
        this.quantiteConforme = quantiteConforme;
    }

    public Double getQuantiteRefusee() { return quantiteRefusee; }
    public void setQuantiteRefusee(Double quantiteRefusee) {
        this.quantiteRefusee = quantiteRefusee;
    }

    public Double getPrixUnitaireAchat() { return prixUnitaireAchat; }
    public void setPrixUnitaireAchat(Double prixUnitaireAchat) {
        this.prixUnitaireAchat = prixUnitaireAchat;
    }
}