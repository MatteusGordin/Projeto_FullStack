package br.com.nexusti.controller;

import br.com.nexusti.model.Prioridade;
import br.com.nexusti.service.PrioridadeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/prioridades")
@CrossOrigin(origins = "*")
public class PrioridadeController {

    @Autowired
    private PrioridadeService service;

    @GetMapping
    public Page<Prioridade> listarTodos(Pageable pageable) {
        return service.listarTodos(pageable);
    }

    @GetMapping("/opcoes")
    public List<Prioridade> listarOpcoes() {
        return service.listarOpcoes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prioridade> buscarPorId(@PathVariable int id) {
        Prioridade encontrado = service.buscarPorId(id);
        if (encontrado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(encontrado);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','TECNICO')")
    public ResponseEntity<Prioridade> criar(@Valid @RequestBody Prioridade prioridade) {
        Prioridade salvo = service.salvar(prioridade);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TECNICO')")
    public ResponseEntity<Prioridade> atualizar(@PathVariable int id, @RequestBody Prioridade dados) {
        Prioridade atual = service.buscarPorId(id);
        if (atual == null) {
            return ResponseEntity.notFound().build();
        }
        atual.setNome(dados.getNome());
        atual.setCor(dados.getCor());
        atual.setOrdem(dados.getOrdem());
        atual.setAtiva(dados.getAtiva());
        return ResponseEntity.ok(service.salvar(atual));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TECNICO')")
    public ResponseEntity<Void> deletar(@PathVariable int id) {
        Prioridade atual = service.buscarPorId(id);
        if (atual == null) {
            return ResponseEntity.notFound().build();
        }
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
