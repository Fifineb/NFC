package com.arjuncodes.isersystem.model;

import jakarta.persistence.*;

@Entity
@Table(name = "utilisateurs")
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String motDePasse;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private Boolean actif = true;

    @Column(name = "telephone", length = 20)
    private String telephone;  // ✅ Téléphone optionnel (peut être null)

    // ============ CONSTRUCTEURS ============

    public Utilisateur() {}

    public Utilisateur(String nom, String prenom, String email,
                       String motDePasse, Role role, String telephone) {
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.motDePasse = motDePasse;
        this.role = role;
        this.actif = true;
        this.telephone = telephone;
    }

    // ============ GETTERS / SETTERS ============

    public Long getId() { 
        return id; 
    }
    
    public void setId(Long id) { 
        this.id = id; 
    }

    public String getNom() { 
        return nom; 
    }
    
    public void setNom(String nom) { 
        this.nom = nom; 
    }

    public String getPrenom() { 
        return prenom; 
    }
    
    public void setPrenom(String prenom) { 
        this.prenom = prenom; 
    }

    public String getEmail() { 
        return email; 
    }
    
    public void setEmail(String email) { 
        this.email = email; 
    }

    public String getMotDePasse() { 
        return motDePasse; 
    }
    
    public void setMotDePasse(String motDePasse) { 
        this.motDePasse = motDePasse; 
    }

    public Role getRole() { 
        return role; 
    }
    
    public void setRole(Role role) { 
        this.role = role; 
    }

    public boolean isActif() { 
        return actif != null && actif; 
    }
    
    public void setActif(Boolean actif) { 
        this.actif = actif; 
    }

    public String getTelephone() { 
        return telephone; 
    }
    
    public void setTelephone(String telephone) { 
        this.telephone = telephone; 
    }

    @Override
    public String toString() {
        return "Utilisateur{" +
                "id=" + id +
                ", nom='" + nom + '\'' +
                ", prenom='" + prenom + '\'' +
                ", email='" + email + '\'' +
                ", role=" + role +
                ", actif=" + actif +
                ", telephone='" + telephone + '\'' +
                '}';
    }
}