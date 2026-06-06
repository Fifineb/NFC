package com.arjuncodes.isersystem.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "mouvement")
@Inheritance(strategy = InheritanceType.JOINED)
public class Mouvement {  

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mouvement")
    private Long id;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "date_mouvement")
    private Date dateMouvement;

    @Column(name = "quantite")
    private Double quantite;

    @Column(name = "reference_bon")
    private String referenceBon;

    @Column(name = "observation")
    private String observation;

    @Column(name = "type_mouvement")
    private String typeMouvement;  // ← AJOUTE CETTE LIGNE

    @ManyToOne
    @JoinColumn(name = "stock_id")
    private Stock stock;

    @ManyToOne
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;

    public Mouvement() {}

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Date getDateMouvement() { return dateMouvement; }
    public void setDateMouvement(Date dateMouvement) { this.dateMouvement = dateMouvement; }
    public Date getDate() { return dateMouvement; }
    public void setDate(Date date) { this.dateMouvement = date; }

    public Double getQuantite() { return quantite; }
    public void setQuantite(Double quantite) { this.quantite = quantite; }

    public String getReferenceBon() { return referenceBon; }
    public void setReferenceBon(String referenceBon) { this.referenceBon = referenceBon; }

    public String getObservation() { return observation; }
    public void setObservation(String observation) { this.observation = observation; }

    public String getTypeMouvement() { return typeMouvement; }
    public void setTypeMouvement(String typeMouvement) { this.typeMouvement = typeMouvement; }

    public Stock getStock() { return stock; }
    public void setStock(Stock stock) { this.stock = stock; }

    public Utilisateur getUtilisateur() { return utilisateur; }
    public void setUtilisateur(Utilisateur utilisateur) { this.utilisateur = utilisateur; }

    public void executer() {
        throw new UnsupportedOperationException("Unimplemented method 'executer'");
    }
}