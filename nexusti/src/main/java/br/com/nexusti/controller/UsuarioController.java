package br.com.nexusti.controller;

import br.com.nexusti.model.Usuario;
import br.com.nexusti.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService service;

    @GetMapping
    public Page<Usuario> listarTodos(Pageable pageable) {
        return service.listarTodos(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable int id) {
        Usuario encontrado = service.buscarPorId(id);
        if (encontrado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(encontrado);
    }

    @PostMapping
    public ResponseEntity<Usuario> criar(@Valid @RequestBody Usuario usuario) {
        Usuario salvo = service.salvar(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizar(@PathVariable int id, @Valid @RequestBody Usuario dados) {
        Usuario atual = service.buscarPorId(id);
        if (atual == null) {
            return ResponseEntity.notFound().build();
        }
        atual.setNome(dados.getNome());
        atual.setEmail(dados.getEmail());
        atual.setSenha(dados.getSenha());
        atual.setPerfil(dados.getPerfil());
        atual.setIdSetor(dados.getIdSetor());
        return ResponseEntity.ok(service.salvar(atual));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable int id) {
        Usuario atual = service.buscarPorId(id);
        if (atual == null) {
            return ResponseEntity.notFound().build();
        }
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
