package com.arjuncodes.isersystem.repository;

import com.arjuncodes.isersystem.model.BonDeConsommation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BonDeConsommationRepository extends JpaRepository<BonDeConsommation, Integer> {  // ← Long → Integer
    List<BonDeConsommation> findByDepartement(String departement);
}