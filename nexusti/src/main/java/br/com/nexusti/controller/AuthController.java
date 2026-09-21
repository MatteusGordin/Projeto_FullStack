package br.com.nexusti.controller;

import br.com.nexusti.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager autenticador;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> credenciais) {
        String email = credenciais.get("email") == null ? "" : credenciais.get("email").trim();
        String senha = credenciais.get("senha") == null ? "" : credenciais.get("senha").trim();
        if (email.isEmpty() || senha.isEmpty()) {
            throw new IllegalArgumentException("Informe email e senha");
        }
        Authentication autenticacao = autenticador.authenticate(new UsernamePasswordAuthenticationToken(email, senha));
        UserDetails usuario = (UserDetails) autenticacao.getPrincipal();
        String token = jwtService.gerarToken(usuario);
        Map<String, String> corpo = new HashMap<>();
        corpo.put("token", token);
        return ResponseEntity.ok(corpo);
    }
}
