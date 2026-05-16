package com.arjuncodes.isersystem.service;

import com.arjuncodes.isersystem.model.Region;
import java.util.List;

public interface RegionService {
    Region saveRegion(Region region);
    List<Region> getAllRegions();


    Region getRegionById(int id_region);

    void deleteRegion(int id_region);
}