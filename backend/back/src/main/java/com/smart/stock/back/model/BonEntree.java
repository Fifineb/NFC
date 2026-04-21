package com.smart.stock.back.model;

import java.time.*;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;

@Entity
public class BonEntree {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_be;

    private String numero_be;
    private String code_operation;
    private String provenance;

    @Column(name = "date_be")
    private LocalDate dateBe;

    @CreationTimestamp
    private LocalDateTime dateCreation;

    @ManyToOne
    @JoinColumn(name = "fournisseur_id")
    private Fournisseur fournisseur;

    private String observation;

    public BonEntree() {
    }

    public BonEntree(Integer id_be, String numero_be, String code_operation,
                    String provenance, LocalDate dateBe,
                    Fournisseur fournisseur, String observation) {
        this.id_be = id_be;
        this.numero_be = numero_be;
        this.code_operation = code_operation;
        this.provenance = provenance;
        this.dateBe = dateBe;
        this.fournisseur = fournisseur;
        this.observation = observation;
    }



    public LocalDateTime getDateCreation() {
    return dateCreation;
}

public void setDateCreation(LocalDateTime dateCreation) {
    this.dateCreation = dateCreation;
}
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
