package com.smart.stock.back.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
public class Region {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String nomR;
    private String description;
    private String adresseR;
    @OneToMany(mappedBy = "region")
    @JsonIgnore
    private List<Magasin> magasins;

    public Region(){}
    public Region(String nomR, String description, String adresseR) {
        this.nomR = nomR;
        this.description = description;
        this.adresseR = adresseR;
    }


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNomR() {
        return nomR;
    }

    public void setNomR(String nomR) {
        this.nomR = nomR;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAdresseR() {
        return adresseR;
    }

    public void setAdresseR(String adresseR) {
        this.adresseR = adresseR;
    }
}







