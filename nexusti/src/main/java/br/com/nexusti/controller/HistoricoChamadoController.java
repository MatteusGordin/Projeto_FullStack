package br.com.nexusti.controller;

import br.com.nexusti.model.HistoricoChamado;
import br.com.nexusti.service.HistoricoChamadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/historicos")
@CrossOrigin(origins = "*")
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

    @PutMapping("/{id}")
    public HistoricoChamado atualizar(@PathVariable int id, @RequestBody HistoricoChamado dados) {
        HistoricoChamado atual = service.buscarPorId(id);
        atual.setMensagem(dados.getMensagem());
        atual.setDataRegistro(dados.getDataRegistro());
        atual.setIdChamado(dados.getIdChamado());
        atual.setIdUsuario(dados.getIdUsuario());
        return service.salvar(atual);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable int id) {
        service.excluir(id);
    }
}
