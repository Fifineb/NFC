package com.arjuncodes.isersystem.controller;

import com.arjuncodes.isersystem.model.Region;
import com.arjuncodes.isersystem.service.RegionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/region")
public class RegionController {
    @Autowired
    private RegionService regionService;

    @PostMapping("/add")
    public String add(@RequestBody Region region){
        regionService.saveRegion(region);
        return "Nouvelle région ajoutée!";
    }

    @GetMapping("/getAll")
    public List<Region> getAllRegions(){
        return regionService.getAllRegions();
    }

    // ⚠️ Changement : id → id_region
    @GetMapping("/get/{id_region}")
    public Region getRegionById(@PathVariable int id_region) {
        return regionService.getRegionById(id_region);
    }

    @PutMapping("/update/{id_region}")
    public String updateRegion(@PathVariable int id_region, @RequestBody Region regionDetails) {
        Region existingRegion = regionService.getRegionById(id_region);
        existingRegion.setNomR(regionDetails.getNomR());
        existingRegion.setDescription(regionDetails.getDescription());
        existingRegion.setAdresseR(regionDetails.getAdresseR());
        regionService.saveRegion(existingRegion);
        return "Région modifiée avec succès !";
    }

    @DeleteMapping("/delete/{id_region}")
    public String deleteRegion(@PathVariable int id_region) {
        regionService.deleteRegion(id_region);
        return "Région supprimée avec succès !";
    }
}