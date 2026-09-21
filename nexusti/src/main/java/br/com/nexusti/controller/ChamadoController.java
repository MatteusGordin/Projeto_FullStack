package br.com.nexusti.controller;

import br.com.nexusti.model.Chamado;
import br.com.nexusti.service.ChamadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/chamados")
@CrossOrigin(origins = "*")
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

    @PutMapping("/{id}")
    public Chamado atualizar(@PathVariable int id, @RequestBody Chamado dados) {
        Chamado atual = service.buscarPorId(id);
        atual.setTitulo(dados.getTitulo());
        atual.setDescricao(dados.getDescricao());
        atual.setStatus(dados.getStatus());
        atual.setPrioridade(dados.getPrioridade());
        atual.setDataFechamento(dados.getDataFechamento());
        atual.setIdSolicitante(dados.getIdSolicitante());
        atual.setIdTecnico(dados.getIdTecnico());
        atual.setIdEquipamento(dados.getIdEquipamento());
        return service.salvar(atual);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable int id) {
        service.excluir(id);
    }
}
