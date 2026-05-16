package com.arjuncodes.isersystem.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "alerte")
public class Alerte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_alerte")
    private Long id;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "date_alerte")
    private Date dateAlerte;

    @Column(name = "message", nullable = false)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut")
    private StatutAlerte statut;

    @ManyToOne
    @JoinColumn(name = "matiere_id")
    private MatierePremiere matierePremiere;

    public Alerte() {}

    public Alerte(String message, StatutAlerte statut, MatierePremiere matierePremiere) {
        this.message = message;
        this.statut = statut;
        this.dateAlerte = new Date();
        this.matierePremiere = matierePremiere;
    }

    public void afficherMessage() {
        System.out.println("[ALERTE] " + dateAlerte + " : " + message + " (Statut: " + statut + ")");
    }

    public void activer() { this.statut = StatutAlerte.ACTIVE; }
    public void desactiver() { this.statut = StatutAlerte.TRAITEE; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Date getDateAlerte() { return dateAlerte; }
    public void setDateAlerte(Date dateAlerte) { this.dateAlerte = dateAlerte; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public StatutAlerte getStatut() { return statut; }
    public void setStatut(StatutAlerte statut) { this.statut = statut; }

    public MatierePremiere getMatierePremiere() { return matierePremiere; }
    public void setMatierePremiere(MatierePremiere matierePremiere) { this.matierePremiere = matierePremiere; }
}