package com.arjuncodes.isersystem.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "commande_achat")
@DiscriminatorValue("COMMANDE_ACHAT")
public class CommandeAchat extends Mouvement {

    @Temporal(TemporalType.DATE)
    @Column(name = "date_livraison_prevue")
    private Date dateLivraisonPrevue;

    @Column(name = "degre_urgence")
    private String degreUrgence;

    @Column(name = "prix_total_estime")
    private Double prixTotalEstime;

    @ManyToOne
    @JoinColumn(name = "fournisseur_id")
    private Fournisseur fournisseur;

    public CommandeAchat() {}

    @Override
    public void executer() {
        System.out.println("Exécution CommandeAchat");
    }

    public Double calculerTotal() {
        if (getQuantite() != null && prixTotalEstime != null)
            return getQuantite() * prixTotalEstime;
        return 0.0;
    }

    public Date getDateLivraisonPrevue() { return dateLivraisonPrevue; }
    public void setDateLivraisonPrevue(Date dateLivraisonPrevue) {
        this.dateLivraisonPrevue = dateLivraisonPrevue;
    }

    public String getDegreUrgence() { return degreUrgence; }
    public void setDegreUrgence(String degreUrgence) { this.degreUrgence = degreUrgence; }

    public Double getPrixTotalEstime() { return prixTotalEstime; }
    public void setPrixTotalEstime(Double prixTotalEstime) {
        this.prixTotalEstime = prixTotalEstime;
    }

    public Fournisseur getFournisseur() { return fournisseur; }
    public void setFournisseur(Fournisseur fournisseur) { this.fournisseur = fournisseur; }
}