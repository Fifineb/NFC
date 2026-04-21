package com.smart.stock.back.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class BonEntree {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_be;

    private String numero_be;
    private LocalDate date_be;
    private String code_operation;
    private String provenance;

    @ManyToOne
    @JoinColumn(name = "fournisseur_id")
    private Fournisseur fournisseur;

    private String observation;

    public Integer getId_be() {
        return id_be;
    }

    public void setId_be(Integer id_be) {
        this.id_be = id_be;
    }

    public String getNumero_be() {
        return numero_be;
    }

    public void setNumero_be(String numero_be) {
        this.numero_be = numero_be;
    }

    public LocalDate getDate_be() {
        return date_be;
    }

    public void setDate_be(LocalDate date_be) {
        this.date_be = date_be;
    }

    public String getCode_operation() {
        return code_operation;
    }

    public void setCode_operation(String code_operation) {
        this.code_operation = code_operation;
    }

    public String getProvenance() {
        return provenance;
    }

    public void setProvenance(String provenance) {
        this.provenance = provenance;
    }

    public Fournisseur getFournisseur() {
        return fournisseur;
    }

    public void setFournisseur(Fournisseur fournisseur) {
        this.fournisseur = fournisseur;
    }

    public String getObservation() {
        return observation;
    }

    public void setObservation(String observation) {
        this.observation = observation;
    }

}
