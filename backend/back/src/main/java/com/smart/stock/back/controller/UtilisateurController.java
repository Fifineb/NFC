package com.smart.stock.back.controller;

import com.smart.stock.back.model.Utilisateur;
import com.smart.stock.back.service.UtilisateurService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class UtilisateurController {

    private final UtilisateurService service;

    public UtilisateurController(UtilisateurService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public Utilisateur register(@RequestBody Utilisateur user){
        return service.register(user);
    }

    @PostMapping("/login")
    public Utilisateur login(@RequestBody Utilisateur user){
        return service.login(user.getEmail(), user.getMot_de_passe());
    }

    @GetMapping("/users")
    public List<Utilisateur> getAll(){
        return service.getAll();
    }

}