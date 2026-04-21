package com.smart.stock.back.repository;

import com.smart.stock.back.model.DemandeAchat;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DemandeAchatRepository extends JpaRepository<DemandeAchat, Integer> {

    List<DemandeAchat> findByUrgenceTrue();
    List<DemandeAchat> findByStatut(String statut);
    List<DemandeAchat> findByDepartement(String departement);
}