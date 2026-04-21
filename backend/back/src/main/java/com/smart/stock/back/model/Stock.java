package com.smart.stock.back.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"magasin_id", "matiere_id"}))
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_st;

    private Double quantite_actuelle;
    private String gisement;

    private LocalDateTime date_mise_a_jour;

    @ManyToOne
    @JoinColumn(name = "magasin_id")
    private Magasin magasin;

    @ManyToOne
    @JoinColumn(name = "matiere_id")
    private MatierePremiere matiere;

    


    public Stock(Integer id_st, Double quantite_actuelle, String gisement, LocalDateTime date_mise_a_jour,
            Magasin magasin, MatierePremiere matiere) {
        this.id_st = id_st;
        this.quantite_actuelle = quantite_actuelle;
        this.gisement = gisement;
        this.date_mise_a_jour = date_mise_a_jour;
        this.magasin = magasin;
        this.matiere = matiere;
    }

    public Integer getId_st() {
        return id_st;
    }

    public void setId_st(Integer id_st) {
        this.id_st = id_st;
    }

    public Double getQuantite_actuelle() {
        return quantite_actuelle;
    }

    public void setQuantite_actuelle(Double quantite_actuelle) {
        this.quantite_actuelle = quantite_actuelle;
    }

    public String getGisement() {
        return gisement;
    }

    public void setGisement(String gisement) {
        this.gisement = gisement;
    }

    public LocalDateTime getDate_mise_a_jour() {
        return date_mise_a_jour;
    }

    public void setDate_mise_a_jour(LocalDateTime date_mise_a_jour) {
        this.date_mise_a_jour = date_mise_a_jour;
    }

    public Magasin getMagasin() {
        return magasin;
    }

    public void setMagasin(Magasin magasin) {
        this.magasin = magasin;
    }

    public MatierePremiere getMatiere() {
        return matiere;
    }

    public void setMatiere(MatierePremiere matiere) {
        this.matiere = matiere;
    }

} 
    

