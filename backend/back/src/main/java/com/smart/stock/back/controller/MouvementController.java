package com.smart.stock.back.controller;

import com.smart.stock.back.model.Mouvement;
import com.smart.stock.back.service.MouvementService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mouvement")
@CrossOrigin("*")
public class MouvementController {

    private final MouvementService service;

    public MouvementController(MouvementService service) {
        this.service = service;
    }

    @PostMapping("/add")
    public Mouvement add(@RequestBody Mouvement m){
        return service.add(m);
    }

    @GetMapping("/getAll")
    public List<Mouvement> getAll(){
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Mouvement getById(@PathVariable Integer id){
        return service.getById(id);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Integer id){
        service.delete(id);
    }
}