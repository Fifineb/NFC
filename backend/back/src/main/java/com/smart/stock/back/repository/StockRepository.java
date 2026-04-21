package com.smart.stock.back.repository;

import com.smart.stock.back.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockRepository extends JpaRepository<Stock, Integer> {
}