package com.arjuncodes.isersystem.repository;

import com.arjuncodes.isersystem.model.Alerte;
import com.arjuncodes.isersystem.model.StatutAlerte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlerteRepository extends JpaRepository<Alerte, Long> {

    List<Alerte> findByStatut(StatutAlerte statut);

    List<Alerte> findByMatierePremiere_Id(Long matiereId);
}