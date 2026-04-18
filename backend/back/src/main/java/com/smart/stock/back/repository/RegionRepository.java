package com.smart.stock.back.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.smart.stock.back.model.Region;

@Repository
public interface RegionRepository extends JpaRepository<Region,Integer> {

}
