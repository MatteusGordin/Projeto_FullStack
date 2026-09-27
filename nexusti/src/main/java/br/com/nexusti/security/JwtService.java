package br.com.nexusti.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    @Value("${api.security.token.secret}")
    private String segredo;

    @Value("${JWT_EXPIRATION:86400000}")
    private long expiracao;

    private SecretKey chave() {
        return Keys.hmacShaKeyFor(segredo.getBytes(StandardCharsets.UTF_8));
    }

    public String gerarToken(UserDetails usuario) {
        Date agora = new Date();
        Date limite = new Date(agora.getTime() + expiracao);
        return Jwts.builder().subject(usuario.getUsername()).issuedAt(agora).expiration(limite).signWith(chave()).compact();
    }

    public String extrairEmail(String token) {
        return Jwts.parser().verifyWith(chave()).build().parseSignedClaims(token).getPayload().getSubject();
    }

    public boolean validar(String token, UserDetails usuario) {
        String email = extrairEmail(token);
        return email.equals(usuario.getUsername());
    }
}
