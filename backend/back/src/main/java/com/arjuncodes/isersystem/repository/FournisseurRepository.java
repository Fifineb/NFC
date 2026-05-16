package com.arjuncodes.isersystem.repository;

import com.arjuncodes.isersystem.model.Fournisseur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FournisseurRepository extends JpaRepository<Fournisseur, Long> {
    Optional<Fournisseur> findByEmail(String email);
    List<Fournisseur> findByRaisonSocialeContainingIgnoreCase(String nom);
    List<Fournisseur> findByActifTrue();
    List<Fournisseur> findByActifFalse();
}