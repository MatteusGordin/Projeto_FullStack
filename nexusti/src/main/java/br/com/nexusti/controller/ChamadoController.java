package br.com.nexusti.controller;

import br.com.nexusti.model.Chamado;
import br.com.nexusti.service.ChamadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/chamados")
public class ChamadoController {

    @Autowired
    private ChamadoService service;

    @GetMapping
    public List<Chamado> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public Chamado buscarPorId(@PathVariable int id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public Chamado criar(@RequestBody Chamado chamado) {
        return service.salvar(chamado);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable int id) {
        service.excluir(id);
    }
}
