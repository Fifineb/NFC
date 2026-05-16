package com.arjuncodes.isersystem.repository;

import com.arjuncodes.isersystem.model.Rapport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Date;
import java.util.List;

@Repository
public interface RapportRepository extends JpaRepository<Rapport, Long> {

    List<Rapport> findByTypeRapport(String type);

    @Query("SELECT r FROM Rapport r WHERE r.dateDebut BETWEEN :debut AND :fin")
    List<Rapport> findByDateDebutBetween(@Param("debut") Date debut, @Param("fin") Date fin);
}