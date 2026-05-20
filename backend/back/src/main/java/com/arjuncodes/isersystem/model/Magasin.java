package com.arjuncodes.isersystem.model;

import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "magasin")
public class Magasin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // Pas de @Column ici — la colonne SQL s'appelle "id" et le champ Java aussi
    private Long id;

    @Column(name = "nom_magasin")
    private String nom;

    @Column(name = "adresse")
    private String adresse;

    @ManyToOne
    @JoinColumn(name = "region_id")
    private Region region;

    @OneToMany(mappedBy = "magasin", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Stock> stocks ;

    public Magasin() {}

    public Magasin(String nom, String adresse, Region region) {
        this.nom = nom;
        this.adresse = adresse;
        this.region = region;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }
    public Region getRegion() { return region; }
    public void setRegion(Region region) { this.region = region; }
    public List<Stock> getStocks() { return stocks; }
    public void setStocks(List<Stock> stocks) { this.stocks = stocks; }
}