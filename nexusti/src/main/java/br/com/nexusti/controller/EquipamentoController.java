package br.com.nexusti.controller;

import br.com.nexusti.model.Equipamento;
import br.com.nexusti.service.EquipamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/equipamentos")
@CrossOrigin(origins = "*")
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

    @PutMapping("/{id}")
    public Equipamento atualizar(@PathVariable int id, @RequestBody Equipamento dados) {
        Equipamento atual = service.buscarPorId(id);
        atual.setPatrimonio(dados.getPatrimonio());
        atual.setTipo(dados.getTipo());
        atual.setMarca(dados.getMarca());
        atual.setModelo(dados.getModelo());
        atual.setIdSetor(dados.getIdSetor());
        return service.salvar(atual);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable int id) {
        service.excluir(id);
    }
}
