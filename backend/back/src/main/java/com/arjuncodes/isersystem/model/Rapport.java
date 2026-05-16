package com.arjuncodes.isersystem.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "rapport")
public class Rapport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "type_rapport")
    private String typeRapport;

    @Temporal(TemporalType.DATE)
    @Column(name = "date_debut")
    private Date dateDebut;

    @Temporal(TemporalType.DATE)
    @Column(name = "date_fin")
    private Date dateFin;

    @Column(name = "montant_total_ht")
    private Double montantTotalHt;

    @Column(name = "montant_net")
    private Double montantNet;

    @Column(name = "taux_tva")
    private Double tauxTva;

    public Rapport() {}

    public Rapport(String typeRapport, Date dateDebut, Date dateFin,
                   Double montantTotalHt, Double tauxTva) {
        this.typeRapport = typeRapport;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.montantTotalHt = montantTotalHt;
        this.tauxTva = tauxTva;
        this.calculerTotaux();
    }
    // Getters
    public Long getId() { return id; }
    public String getTypeRapport() { return typeRapport; }
    public Date getDateDebut() { return dateDebut; }
    public Date getDateFin() { return dateFin; }
    public Double getMontantTotalHt() { return montantTotalHt; }
    public Double getMontantNet() { return montantNet; }
    public Double getTauxTva() { return tauxTva; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setTypeRapport(String typeRapport) { this.typeRapport = typeRapport; }
    public void setDateDebut(Date dateDebut) { this.dateDebut = dateDebut; }
    public void setDateFin(Date dateFin) { this.dateFin = dateFin; }
    public void setMontantTotalHt(Double montantTotalHt) { this.montantTotalHt = montantTotalHt; }
    public void setMontantNet(Double montantNet) { this.montantNet = montantNet; }
    public void setTauxTva(Double tauxTva) { this.tauxTva = tauxTva; }

    // Méthodes métier
    public void calculerTotaux() {
        if (montantTotalHt != null && tauxTva != null) {
            this.montantNet = montantTotalHt + (montantTotalHt * tauxTva / 100);
        }
    }

    public void genererPDF() {
        System.out.println("Génération PDF du rapport: " + typeRapport);
    }
}
