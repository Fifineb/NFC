package com.arjuncodes.isersystem.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "region")
public class Region {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "region_id")
    private Long id;

    @Column(name = "nom_r", nullable = false, unique = true)  // unique et non nul
    private String nomR;   // ex: "ALGER", "MASCARA", "BATNA"

    @Column(name = "description")
    private String description;

    @Column(name = "adresse_r")
    private String adresseR;   // adresse physique de la région (si nécessaire)

    @OneToMany(mappedBy = "region", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JsonIgnore   // évite la boucle JSON (région → magasins → région → ...)
    private List<Magasin> magasins = new ArrayList<>();

    // --- Constructeurs ---
    public Region() {}

    public Region(String nomR, String description, String adresseR) {
        this.nomR = nomR;
        this.description = description;
        this.adresseR = adresseR;
    }

    // --- Getters et Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNomR() { return nomR; }
    public void setNomR(String nomR) { this.nomR = nomR; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAdresseR() { return adresseR; }
    public void setAdresseR(String adresseR) { this.adresseR = adresseR; }

    public List<Magasin> getMagasins() { return magasins; }
    public void setMagasins(List<Magasin> magasins) { this.magasins = magasins; }
}