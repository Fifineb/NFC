package com.smart.stock.back.controller;

import com.smart.stock.back.model.Region;
import com.smart.stock.back.service.RegionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:5173")

@RestController
@RequestMapping("/region")
public class RegionController {
    @Autowired
    private RegionService regionService;
    @PostMapping("/add")
    public String add(@RequestBody Region region){
        regionService.saveRegion(region);
        return"Nouvelle région ajoutée!";
    }
    @GetMapping("/getAll")
    public List<Region>getAllRegions(){
      return regionService.getAllRegions();
    }
    
@PutMapping("/update/{id}")
public String updateRegion(@PathVariable Integer id, @RequestBody Region region){
    regionService.updateRegion(id, region);
    return "Région modifiée !";
}

@DeleteMapping("/delete/{id}")
public String deleteRegion(@PathVariable Integer id){
    regionService.deleteRegion(id);
    return "Région supprimée !";
}

}

