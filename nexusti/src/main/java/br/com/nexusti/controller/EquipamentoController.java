package br.com.nexusti.controller;

import br.com.nexusti.model.Equipamento;
import br.com.nexusti.service.EquipamentoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/equipamentos")
@CrossOrigin(origins = "*")
public class EquipamentoController {

    @Autowired
    private EquipamentoService service;

    @GetMapping
    public Page<Equipamento> listarTodos(Pageable pageable) {
        return service.listarTodos(pageable);
    }

    @GetMapping("/opcoes")
    public List<Equipamento> listarOpcoes() {
        return service.listarOpcoes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Equipamento> buscarPorId(@PathVariable int id) {
        Equipamento encontrado = service.buscarPorId(id);
        if (encontrado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(encontrado);
    }

    @PostMapping
    public ResponseEntity<Equipamento> criar(@Valid @RequestBody Equipamento equipamento) {
        Equipamento salvo = service.salvar(equipamento);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Equipamento> atualizar(@PathVariable int id, @Valid @RequestBody Equipamento dados) {
        Equipamento atual = service.buscarPorId(id);
        if (atual == null) {
            return ResponseEntity.notFound().build();
        }
        atual.setPatrimonio(dados.getPatrimonio());
        atual.setTipo(dados.getTipo());
        atual.setMarca(dados.getMarca());
        atual.setModelo(dados.getModelo());
        atual.setIdSetor(dados.getIdSetor());
        return ResponseEntity.ok(service.salvar(atual));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable int id) {
        Equipamento atual = service.buscarPorId(id);
        if (atual == null) {
            return ResponseEntity.notFound().build();
        }
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
