package com.smart.stock.back.service;

import com.smart.stock.back.model.Region;
import com.smart.stock.back.repository.RegionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Objects;
import java.util.List;

@Service
public class RegionServiceImpl implements RegionService {
    @Autowired
    private RegionRepository regionRepository;


@Override
public Region saveRegion(Region region) {
    Objects.requireNonNull(region, "Region cannot be null");
    return regionRepository.save(region);
}

    @Override
    public List<Region> getAllRegions() {
        return regionRepository.findAll();
    }
    @Override
public void deleteRegion(Integer id){
    regionRepository.deleteById(id);
}

@Override
public void updateRegion(Integer id, Region newRegion){
    Region r = regionRepository.findById(id).orElseThrow();

    r.setNomR(newRegion.getNomR());
    r.setDescription(newRegion.getDescription());
    r.setAdresseR(newRegion.getAdresseR());

    regionRepository.save(r);
}
}