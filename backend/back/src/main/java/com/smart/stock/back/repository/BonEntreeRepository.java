package com.smart.stock.back.repository;

import com.smart.stock.back.model.BonEntree;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface BonEntreeRepository extends JpaRepository<BonEntree, Integer> {
    List<BonEntree> findByDateBeBetween(LocalDate start, LocalDate end);
    List<BonEntree> findByFournisseurId(Integer fournisseurId);
    
    @Query("SELECT b FROM BonEntree b WHERE b.dateBe >= :date ORDER BY b.dateBe DESC")
    List<BonEntree> findRecentBonEntree(@Param("date") LocalDate date);
}