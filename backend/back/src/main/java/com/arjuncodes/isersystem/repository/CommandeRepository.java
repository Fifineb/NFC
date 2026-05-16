package com.arjuncodes.isersystem.repository;

import com.arjuncodes.isersystem.model.Commande;
import com.arjuncodes.isersystem.model.StatutCommande; // <--- CORRECTION ICI
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommandeRepository extends JpaRepository<Commande, Long> {
    List<Commande> findByStatut(StatutCommande statut);
    List<Commande> findByFournisseurId(Long fournisseurId);
    List<Commande> findByMatierePremiereId(Long matiereId);
}