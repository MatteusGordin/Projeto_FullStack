package br.com.nexusti.controller;

import br.com.nexusti.model.HistoricoChamado;
import br.com.nexusti.service.HistoricoChamadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/historicos")
public class HistoricoChamadoController {

    @Autowired
    private HistoricoChamadoService service;

    @GetMapping
    public List<HistoricoChamado> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public HistoricoChamado buscarPorId(@PathVariable int id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public HistoricoChamado criar(@RequestBody HistoricoChamado historico) {
        return service.salvar(historico);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable int id) {
        service.excluir(id);
    }
}
