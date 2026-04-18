package com.smart.stock.back.controller;


import com.smart.stock.back.model.Magasin;
import com.smart.stock.back.service.MagasinService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/magasin")
public class MagasinController {
    @Autowired
    private MagasinService magasinService;
    @PostMapping("/add")
    public String add(@RequestBody Magasin magasin) {
        magasinService.saveMagasin(magasin);
        return "Magasin ajouté !";
    }
    @GetMapping("/getAll")
    public List<Magasin> getAllMagasins() {
        return magasinService.getAllMagasins();
    }
}
