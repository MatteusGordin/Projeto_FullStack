package br.com.nexusti.controller;

import br.com.nexusti.model.Chamado;
import br.com.nexusti.service.ChamadoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chamados")
@CrossOrigin(origins = "*")
public class ChamadoController {

    @Autowired
    private ChamadoService service;

    @GetMapping
    public Page<Chamado> listarTodos(Pageable pageable) {
        return service.listarTodos(pageable);
    }

    @GetMapping("/metricas")
    public Map<String, Long> metricas() {
        Map<String, Long> corpo = new HashMap<>();
        corpo.put("abertos", service.contarAbertos());
        corpo.put("fechados", service.contarFechados());
        return corpo;
    }

    @GetMapping("/metricas/prioridades")
    public Map<String, Long> metricasPorPrioridade() {
        return service.contarPorPrioridade();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Chamado> buscarPorId(@PathVariable int id) {
        Chamado encontrado = service.buscarAcessivel(id);
        if (encontrado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(encontrado);
    }

    @PostMapping
    public ResponseEntity<Chamado> criar(@Valid @RequestBody Chamado chamado) {
        Chamado salvo = service.salvar(chamado);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Chamado> atualizar(@PathVariable int id, @Valid @RequestBody Chamado dados) {
        Chamado atual = service.buscarAcessivel(id);
        if (atual == null) {
            return ResponseEntity.notFound().build();
        }
        atual.setTitulo(dados.getTitulo());
        atual.setDescricao(dados.getDescricao());
        atual.setStatus(dados.getStatus());
        atual.setPrioridade(dados.getPrioridade());
        atual.setDataFechamento(dados.getDataFechamento());
        atual.setIdSolicitante(dados.getIdSolicitante());
        atual.setIdTecnico(dados.getIdTecnico());
        atual.setIdEquipamento(dados.getIdEquipamento());
        return ResponseEntity.ok(service.salvar(atual));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable int id) {
        Chamado atual = service.buscarAcessivel(id);
        if (atual == null) {
            return ResponseEntity.notFound().build();
        }
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
