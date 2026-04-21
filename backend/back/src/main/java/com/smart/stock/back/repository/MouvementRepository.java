package com.smart.stock.back.repository;

import com.smart.stock.back.model.Mouvement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MouvementRepository extends JpaRepository<Mouvement, Integer> {
}