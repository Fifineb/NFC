package com.arjuncodes.isersystem.repository;

import com.arjuncodes.isersystem.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MouvementRepository extends JpaRepository<Mouvement, Long> {
}