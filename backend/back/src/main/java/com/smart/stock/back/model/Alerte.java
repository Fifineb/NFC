package com.smart.stock.back.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Alerte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_alerte;

    private LocalDateTime date_alerte;
    private String message;

    @Enumerated(EnumType.STRING)
    private StatutAlerte statut;

    @ManyToOne
    @JoinColumn(name = "matiere_id")
    private MatierePremiere matiere;

    public Alerte(Integer id_alerte, LocalDateTime date_alerte, String message, StatutAlerte statut,
            MatierePremiere matiere) {
        this.id_alerte = id_alerte;
        this.date_alerte = date_alerte;
        this.message = message;
        this.statut = statut;
        this.matiere = matiere;
    }
    
    public Integer getId_alerte() {
        return id_alerte;
    }

    public void setId_alerte(Integer id_alerte) {
        this.id_alerte = id_alerte;
    }

    public LocalDateTime getDate_alerte() {
        return date_alerte;
    }

    public void setDate_alerte(LocalDateTime date_alerte) {
        this.date_alerte = date_alerte;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public StatutAlerte getStatut() {
        return statut;
    }

    public void setStatut(StatutAlerte statut) {
        this.statut = statut;
    }

    public MatierePremiere getMatiere() {
        return matiere;
    }

    public void setMatiere(MatierePremiere matiere) {
        this.matiere = matiere;
    }

    
}