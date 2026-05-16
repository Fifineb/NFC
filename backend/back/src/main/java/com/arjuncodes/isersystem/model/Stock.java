package com.arjuncodes.isersystem.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "stock")
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_st")
    private Long idSt;

    @Column(name = "quantite_actuelle")
    private Double quantiteActuelle;

    @Column(name = "gisement")
    private String gisement;

    @Column(name = "date_mise_a_jour")
    private LocalDateTime dateMiseAJour;

    @ManyToOne
    @JoinColumn(name = "magasin_id")
    private Magasin magasin;

    @ManyToOne
    @JoinColumn(name = "matiere_id")
    private MatierePremiere matierePremiere;

    @OneToMany(mappedBy = "stock", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Mouvement> mouvements = new ArrayList<>();

    public Stock() {}

    public Stock(Double quantiteActuelle, String gisement,
                 Magasin magasin, MatierePremiere matierePremiere) {
        this.quantiteActuelle = quantiteActuelle;
        this.gisement = gisement;
        this.dateMiseAJour = LocalDateTime.now();
        this.magasin = magasin;
        this.matierePremiere = matierePremiere;
    }

    public void augmenterStock(double qte) {
        if (qte > 0) { this.quantiteActuelle += qte; this.dateMiseAJour = LocalDateTime.now(); }
        else throw new IllegalArgumentException("La quantité doit être positive");
    }

    public void diminuerStock(double qte) {
        if (qte <= 0) throw new IllegalArgumentException("La quantité doit être positive");
        if (this.quantiteActuelle < qte) throw new IllegalStateException("Stock insuffisant !");
        this.quantiteActuelle -= qte;
        this.dateMiseAJour = LocalDateTime.now();
    }

    public String genererFicheStock() {
        return "=== FICHE STOCK ===\n" +
                "ID: " + idSt + "\n" +
                "Quantité: " + quantiteActuelle + "\n" +
                "Gisement: " + gisement + "\n" +
                "Magasin: " + (magasin != null ? magasin.getNom() : "Aucun") + "\n" +
                "Matière: " + (matierePremiere != null ? matierePremiere.getNomPR() : "Aucune");
    }

    // ← Ces méthodes sont appelées dans StockController
    public void addMatiere(MatierePremiere matiere) {
        this.matierePremiere = matiere;
    }

    public void removeMatiere(MatierePremiere matiere) {
        if (this.matierePremiere != null &&
                this.matierePremiere.getId().equals(matiere.getId())) {
            this.matierePremiere = null;
        }
    }

    // ← Retourne liste pour compatibilité controller
    public List<MatierePremiere> getMatieres() {
        List<MatierePremiere> list = new ArrayList<>();
        if (matierePremiere != null) list.add(matierePremiere);
        return list;
    }

    public void addMouvement(Mouvement mouvement) {
        mouvements.add(mouvement);
        mouvement.setStock(this);
    }

    public void removeMouvement(Mouvement mouvement) {
        mouvements.remove(mouvement);
        mouvement.setStock(null);
    }

    // ===== GETTERS & SETTERS =====
    public Long getIdSt() { return idSt; }
    public void setIdSt(Long idSt) { this.idSt = idSt; }
    public Double getQuantiteActuelle() { return quantiteActuelle; }
    public void setQuantiteActuelle(Double quantiteActuelle) { this.quantiteActuelle = quantiteActuelle; }
    public String getGisement() { return gisement; }
    public void setGisement(String gisement) { this.gisement = gisement; }
    public LocalDateTime getDateMiseAJour() { return dateMiseAJour; }
    public void setDateMiseAJour(LocalDateTime dateMiseAJour) { this.dateMiseAJour = dateMiseAJour; }
    public Magasin getMagasin() { return magasin; }
    public void setMagasin(Magasin magasin) { this.magasin = magasin; }
    public MatierePremiere getMatierePremiere() { return matierePremiere; }
    public void setMatierePremiere(MatierePremiere matierePremiere) {
        this.matierePremiere = matierePremiere;
    }
    public List<Mouvement> getMouvements() { return mouvements; }
    public void setMouvements(List<Mouvement> mouvements) { this.mouvements = mouvements; }
}