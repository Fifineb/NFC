package com.smart.stock.back.controller;

import com.smart.stock.back.model.Commande;
import com.smart.stock.back.service.CommandeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/commande")
@CrossOrigin("*")
public class CommandeController {

    private final CommandeService service;

    public CommandeController(CommandeService service) {
        this.service = service;
    }

    @PostMapping("/add")
    public Commande add(@RequestBody Commande c){
        return service.add(c);
    }

    @GetMapping("/getAll")
    public List<Commande> getAll(){
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Commande getById(@PathVariable Integer id){
        return service.getById(id);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Integer id){
        service.delete(id);
    }
}