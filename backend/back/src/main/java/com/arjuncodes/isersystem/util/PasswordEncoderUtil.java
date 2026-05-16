package com.arjuncodes.isersystem.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PasswordEncoderUtil {

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public String encoder(String motDePasse) {
        return encoder.encode(motDePasse);
    }

    public boolean verifier(String motDePasseClair, String motDePasseHashé) {
        return encoder.matches(motDePasseClair, motDePasseHashé);
    }
}