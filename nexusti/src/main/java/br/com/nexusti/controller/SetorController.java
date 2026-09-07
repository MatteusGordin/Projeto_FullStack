package br.com.nexusti.controller;

import br.com.nexusti.model.Setor;
import br.com.nexusti.service.SetorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/setores")
public class SetorController {

    @Autowired
    private SetorService service;

    @GetMapping
    public List<Setor> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public Setor buscarPorId(@PathVariable int id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public Setor criar(@RequestBody Setor setor) {
        return service.salvar(setor);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable int id) {
        service.excluir(id);
    }
}
