package com.arjuncodes.isersystem.service;

import com.arjuncodes.isersystem.model.Region;
import com.arjuncodes.isersystem.repository.RegionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RegionServiceImpl implements RegionService {

    @Autowired
    private RegionRepository regionRepository;

    @Override
    public Region saveRegion(Region region) {
        return regionRepository.save(region);
    }

    @Override
    public List<Region> getAllRegions() {
        return regionRepository.findAll();
    }

    // ⚠️ Changement : int id → int id_region
    @Override
    public Region getRegionById(int id_region) {
        return regionRepository.findById(id_region)
                .orElseThrow(() -> new RuntimeException("Région non trouvée avec l'id : " + id_region));
    }

    // ⚠️ Changement : int id → int id_region
    @Override
    public void deleteRegion(int id_region) {
        regionRepository.deleteById(id_region);
    }
}