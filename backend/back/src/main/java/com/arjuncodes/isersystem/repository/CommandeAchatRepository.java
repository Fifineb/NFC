package com.arjuncodes.isersystem.repository;

import com.arjuncodes.isersystem.model.CommandeAchat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommandeAchatRepository extends JpaRepository<CommandeAchat, Integer> {  // ← Long → Integer
    List<CommandeAchat> findByDegreUrgence(String degreUrgence);
}