package com.arjuncodes.isersystem.model;

import jakarta.persistence.*;

@Entity
@Table(name = "bon_sortie")
@DiscriminatorValue("BON_SORTIE")
public class BonDeSortie extends Mouvement {

    @Column(name = "departement")
    private String departement;

    @Column(name = "code_machine")
    private String codeMachine;

    @Column(name = "compte_analytique")
    private String compteAnalytique;

    @Column(name = "destinataire")
    private String destinataire;

    public BonDeSortie() {}

    @Override
    public void executer() {
        System.out.println("Exécution BonDeSortie - dept: " + departement);
    }

    public String getDepartement() { return departement; }
    public void setDepartement(String departement) { this.departement = departement; }

    public String getCodeMachine() { return codeMachine; }
    public void setCodeMachine(String codeMachine) { this.codeMachine = codeMachine; }
    // Alias pour compatibilité
    public String getCode_machine() { return codeMachine; }
    public void setCode_machine(String codeMachine) { this.codeMachine = codeMachine; }

    public String getCompteAnalytique() { return compteAnalytique; }
    public void setCompteAnalytique(String compteAnalytique) {
        this.compteAnalytique = compteAnalytique;
    }
    // Alias pour compatibilité
    public String getCompte_analytique() { return compteAnalytique; }
    public void setCompte_analytique(String compteAnalytique) {
        this.compteAnalytique = compteAnalytique;
    }

    public String getDestinataire() { return destinataire; }
    public void setDestinataire(String destinataire) { this.destinataire = destinataire; }
}