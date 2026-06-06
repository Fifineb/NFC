package com.arjuncodes.isersystem.model;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("BON_CONSOMMATION")
public class BonDeConsommation extends Mouvement {

    @Column(name = "departement")
    private String departement;

    @Column(name = "motif_consommation")
    private String motifConsommation;

    public BonDeConsommation() {}

    @Override
    public void executer() {
        System.out.println("Exécution BonDeConsommation - dept: " + departement);
    }

    public String getDepartement() { return departement; }
    public void setDepartement(String departement) { this.departement = departement; }

    public String getMotifConsommation() { return motifConsommation; }
    public void setMotifConsommation(String motifConsommation) {
        this.motifConsommation = motifConsommation;
    }
}