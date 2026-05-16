package com.arjuncodes.isersystem.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "commande")
public class Commande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cm")
    private Long id;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "date_commande")
    private Date dateCommande;

    @Temporal(TemporalType.DATE)
    @Column(name = "date_livraison_prevue")
    private Date dateLivraisonPrevue;

    @Temporal(TemporalType.DATE)
    @Column(name = "date_livraison_reelle")
    private Date dateLivraisonReelle;

    @Column(name = "quantite_commandee")
    private Double quantiteCommandee;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut")
    private StatutCommande statut;

    @ManyToOne
    @JoinColumn(name = "fournisseur_id")
    private Fournisseur fournisseur;

    @ManyToOne
    @JoinColumn(name = "matiere_id")
    private MatierePremiere matierePremiere;

    public Commande() {}

    public void valider() { this.statut = StatutCommande.VALIDEE; }
    public void annuler() { this.statut = StatutCommande.ANNULEE; }
    public void marquerLivree() {
        this.statut = StatutCommande.LIVREE;
        this.dateLivraisonReelle = new Date();
    }
    public int calculerRetard() {
        if (dateLivraisonReelle != null && dateLivraisonPrevue != null) {
            long diff = dateLivraisonReelle.getTime() - dateLivraisonPrevue.getTime();
            return (int)(diff / (1000 * 60 * 60 * 24));
        }
        return 0;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Date getDateCommande() { return dateCommande; }
    public void setDateCommande(Date d) { this.dateCommande = d; }
    public Date getDateLivraisonPrevue() { return dateLivraisonPrevue; }
    public void setDateLivraisonPrevue(Date d) { this.dateLivraisonPrevue = d; }
    public Date getDateLivraisonReelle() { return dateLivraisonReelle; }
    public void setDateLivraisonReelle(Date d) { this.dateLivraisonReelle = d; }
    public Double getQuantiteCommandee() { return quantiteCommandee; }
    public void setQuantiteCommandee(Double q) { this.quantiteCommandee = q; }
    public StatutCommande getStatut() { return statut; }
    public void setStatut(StatutCommande s) { this.statut = s; }
    public Fournisseur getFournisseur() { return fournisseur; }
    public void setFournisseur(Fournisseur f) { this.fournisseur = f; }
    public MatierePremiere getMatierePremiere() { return matierePremiere; }
    public void setMatierePremiere(MatierePremiere m) { this.matierePremiere = m; }
}