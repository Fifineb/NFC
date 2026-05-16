package com.arjuncodes.isersystem.repository;

import com.arjuncodes.isersystem.model.MatierePremiere;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MatierePremiereRepository extends JpaRepository<MatierePremiere, Long> {
}