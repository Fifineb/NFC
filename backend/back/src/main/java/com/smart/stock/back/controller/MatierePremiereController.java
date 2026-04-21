package com.smart.stock.back.controller;

import com.smart.stock.back.model.MatierePremiere;
import com.smart.stock.back.service.MatierePremiereService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/matiere")
@CrossOrigin("*")
public class MatierePremiereController {

    private final MatierePremiereService service;

    public MatierePremiereController(MatierePremiereService service) {
        this.service = service;
    }

    @PostMapping("/add")
    public MatierePremiere add(@RequestBody MatierePremiere m){
        return service.add(m);
    }

    @GetMapping("/getAll")
    public List<MatierePremiere> getAll(){
        return service.getAll();
    }

    @GetMapping("/{id}")
    public MatierePremiere getById(@PathVariable Integer id){
        return service.getById(id);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Integer id){
        service.delete(id);
    }
}