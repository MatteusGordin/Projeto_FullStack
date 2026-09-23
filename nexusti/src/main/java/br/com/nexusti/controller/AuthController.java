package br.com.nexusti.controller;

import br.com.nexusti.model.Usuario;
import br.com.nexusti.repository.UsuarioRepository;
import br.com.nexusti.service.UsuarioService;
import br.com.nexusti.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/bootstrap")
    public ResponseEntity<?> bootstrap(@Valid @RequestBody Usuario usuario) {
        if (usuarioRepository.count() > 0) {
            Map<String, String> corpo = new HashMap<>();
            corpo.put("mensagem", "Sistema ja possui usuarios cadastrados");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(corpo);
        }
        String perfil = usuario.getPerfil() == null ? "" : usuario.getPerfil().trim().toUpperCase();
        if (perfil.equals("TECNICO")) {
            usuario.setPerfil("TECNICO");
        } else {
            usuario.setPerfil("ADMIN");
        }
        Usuario salvo = usuarioService.salvar(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

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
