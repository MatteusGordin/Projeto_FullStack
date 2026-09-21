package br.com.nexusti.controller;

import br.com.nexusti.model.HistoricoChamado;
import br.com.nexusti.service.HistoricoChamadoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/historicos")
@CrossOrigin(origins = "*")
public class HistoricoChamadoController {

    @Autowired
    private HistoricoChamadoService service;

    @GetMapping
    public Page<HistoricoChamado> listarTodos(Pageable pageable) {
        return service.listarTodos(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HistoricoChamado> buscarPorId(@PathVariable int id) {
        HistoricoChamado encontrado = service.buscarPorId(id);
        if (encontrado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(encontrado);
    }

    @PostMapping
    public ResponseEntity<HistoricoChamado> criar(@Valid @RequestBody HistoricoChamado historico) {
        HistoricoChamado salvo = service.salvar(historico);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HistoricoChamado> atualizar(@PathVariable int id, @Valid @RequestBody HistoricoChamado dados) {
        HistoricoChamado atual = service.buscarPorId(id);
        if (atual == null) {
            return ResponseEntity.notFound().build();
        }
        atual.setMensagem(dados.getMensagem());
        atual.setDataRegistro(dados.getDataRegistro());
        atual.setIdChamado(dados.getIdChamado());
        atual.setIdUsuario(dados.getIdUsuario());
        return ResponseEntity.ok(service.salvar(atual));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable int id) {
        HistoricoChamado atual = service.buscarPorId(id);
        if (atual == null) {
            return ResponseEntity.notFound().build();
        }
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
