package br.com.nexusti.controller;

import br.com.nexusti.model.Equipamento;
import br.com.nexusti.service.EquipamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/equipamentos")
public class EquipamentoController {

    @Autowired
    private EquipamentoService service;

    @GetMapping
    public List<Equipamento> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public Equipamento buscarPorId(@PathVariable int id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public Equipamento criar(@RequestBody Equipamento equipamento) {
        return service.salvar(equipamento);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable int id) {
        service.excluir(id);
    }
}
