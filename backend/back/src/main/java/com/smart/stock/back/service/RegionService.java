package com.smart.stock.back.service;


import com.smart.stock.back.model.Region;

import java.util.List;

public interface RegionService {
    public Region saveRegion(Region region);
    List<Region> getAllRegions();
    void deleteRegion(Integer id);
    void updateRegion(Integer id, Region region);
}
