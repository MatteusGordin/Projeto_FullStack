package br.com.nexusti.controller;

import br.com.nexusti.model.Setor;
import br.com.nexusti.service.SetorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/setores")
@CrossOrigin(origins = "*")
public class SetorController {

    @Autowired
    private SetorService service;

    @GetMapping
    public Page<Setor> listarTodos(Pageable pageable) {
        return service.listarTodos(pageable);
    }

    @GetMapping("/opcoes")
    public List<Setor> listarOpcoes() {
        return service.listarOpcoes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Setor> buscarPorId(@PathVariable int id) {
        Setor encontrado = service.buscarPorId(id);
        if (encontrado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(encontrado);
    }

    @PostMapping
    public ResponseEntity<Setor> criar(@Valid @RequestBody Setor setor) {
        Setor salvo = service.salvar(setor);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Setor> atualizar(@PathVariable int id, @Valid @RequestBody Setor dados) {
        Setor atual = service.buscarPorId(id);
        if (atual == null) {
            return ResponseEntity.notFound().build();
        }
        atual.setNome(dados.getNome());
        atual.setSigla(dados.getSigla());
        return ResponseEntity.ok(service.salvar(atual));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable int id) {
        Setor atual = service.buscarPorId(id);
        if (atual == null) {
            return ResponseEntity.notFound().build();
        }
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
