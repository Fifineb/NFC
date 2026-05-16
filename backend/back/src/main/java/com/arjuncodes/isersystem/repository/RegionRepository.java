package com.arjuncodes.isersystem.repository;
import com.arjuncodes.isersystem.model.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegionRepository extends JpaRepository<Region,Integer> {
}
