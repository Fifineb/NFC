package com.smart.stock.back.model;
import jakarta.persistence.*;


@Entity
public class Magasin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String nom;
    private String adresse;

    @ManyToOne
    @JoinColumn(name = "region_id")
    private Region region;

    public Magasin() {}

    public Magasin(String nom, String adresse, Region region) {
        this.nom = nom;
        this.adresse = adresse;
        this.region = region;
    }
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public Region getRegion() {
        return region;
    }

    public void setRegion(Region region) {
        this.region = region;
    }

}