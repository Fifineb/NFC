package com.smart.stock.back.repository;

import com.smart.stock.back.model.BonEntree;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface BonEntreeRepository extends JpaRepository<BonEntree, Integer> {
    
    //  Méthode 1: Avec @Query (RECOMMANDÉ)
    @Query("SELECT b FROM BonEntree b WHERE b.fournisseur.id_f = :fournisseurId")
    List<BonEntree> findByFournisseurId(@Param("fournisseurId") Integer fournisseurId);
    
    // Méthode 2: Pour les dates
    List<BonEntree> findByDateBeBetween(LocalDate start, LocalDate end);
    
    // Méthode 3: Tous les bons triés par date
    @Query("SELECT b FROM BonEntree b ORDER BY b.dateBe DESC")
    List<BonEntree> findAllOrderByDateDesc();
    
    @Query("SELECT b FROM BonEntree b WHERE b.dateBe >= :date ORDER BY b.dateBe DESC")
    List<BonEntree> findRecentBonEntree(@Param("date") LocalDate date);

}