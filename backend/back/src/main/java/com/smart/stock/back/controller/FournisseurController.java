package com.smart.stock.back.controller;

import com.smart.stock.back.model.Fournisseur;
import com.smart.stock.back.service.FournisseurService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fournisseur")
@CrossOrigin("*")
public class FournisseurController {

    private final FournisseurService service;

    public FournisseurController(FournisseurService service) {
        this.service = service;
    }

    @PostMapping("/add")
    public Fournisseur add(@RequestBody Fournisseur f){
        return service.add(f);
    }

    @GetMapping("/getAll")
    public List<Fournisseur> getAll(){
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Fournisseur getById(@PathVariable Integer id){
        return service.getById(id);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Integer id){
        service.delete(id);
    }
}