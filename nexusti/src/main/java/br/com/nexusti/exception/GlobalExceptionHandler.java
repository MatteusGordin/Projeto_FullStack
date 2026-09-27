package br.com.nexusti.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> tratarRegraNegocio(IllegalArgumentException ex) {
        String texto = ex.getMessage() == null ? "Dados invalidos" : ex.getMessage();
        Map<String, String> corpo = new HashMap<>();
        corpo.put("mensagem", texto);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(corpo);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> tratarValidacao(MethodArgumentNotValidException ex) {
        String primeira = ex.getBindingResult().getFieldErrors().stream().findFirst().map(erro -> erro.getDefaultMessage()).orElse("Dados invalidos");
        String texto = primeira == null ? "Dados invalidos" : primeira;
        Map<String, String> corpo = new HashMap<>();
        corpo.put("mensagem", texto);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(corpo);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, String>> tratarCredenciais(BadCredentialsException ex) {
        Map<String, String> corpo = new HashMap<>();
        corpo.put("mensagem", "Email ou senha invalidos");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(corpo);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<Map<String, String>> tratarNaoEncontrado(UsernameNotFoundException ex) {
        Map<String, String> corpo = new HashMap<>();
        corpo.put("mensagem", "Email ou senha invalidos");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(corpo);
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<Map<String, String>> tratarDesativado(DisabledException ex) {
        Map<String, String> corpo = new HashMap<>();
        corpo.put("mensagem", "Usuario desativado. Contate o administrador");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(corpo);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> tratarIntegridade(DataIntegrityViolationException ex) {
        Map<String, String> corpo = new HashMap<>();
        corpo.put("mensagem", "Registro ja cadastrado");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(corpo);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> tratarAcessoNegado(AccessDeniedException ex) {
        String texto = ex.getMessage() == null ? "Acesso negado" : ex.getMessage();
        Map<String, String> corpo = new HashMap<>();
        corpo.put("mensagem", texto);
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(corpo);
    }
}
