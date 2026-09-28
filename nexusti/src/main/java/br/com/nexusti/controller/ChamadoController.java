package br.com.nexusti.controller;

import br.com.nexusti.dto.ChamadoResposta;
import br.com.nexusti.model.Chamado;
import br.com.nexusti.service.ChamadoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chamados")
public class ChamadoController {

    @Autowired
    private ChamadoService service;

    @GetMapping
    public Page<ChamadoResposta> listarTodos(Pageable pageable,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String prioridade,
            @RequestParam(required = false) String idSetor,
            @RequestParam(required = false) String dataInicio,
            @RequestParam(required = false) String dataFim) {
        return service.listarFiltrado(status, prioridade, idSetor, dataInicio, dataFim, pageable);
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
    public ResponseEntity<ChamadoResposta> buscarPorId(@PathVariable int id) {
        ChamadoResposta encontrado = service.buscarRespostaAcessivel(id);
        if (encontrado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(encontrado);
    }

    @PostMapping
    public ResponseEntity<ChamadoResposta> criar(@Valid @RequestBody Chamado chamado) {
        Chamado salvo = service.salvar(chamado);
        return ResponseEntity.status(HttpStatus.CREATED).body(service.paraResposta(salvo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChamadoResposta> atualizar(@PathVariable int id, @Valid @RequestBody Chamado dados) {
        Chamado atual = service.buscarAcessivel(id);
        if (atual == null) {
            return ResponseEntity.notFound().build();
        }
        String statusAnterior = atual.getStatus() == null ? "" : atual.getStatus().trim().toUpperCase();
        String statusNovo = dados.getStatus() == null ? statusAnterior : dados.getStatus().trim().toUpperCase();
        if (statusNovo.isEmpty()) {
            statusNovo = statusAnterior;
        }
        if (statusNovo.equals(statusAnterior) == false && service.acessoAmplo() == false) {
            throw new AccessDeniedException("Apenas administradores e tecnicos podem alterar o status");
        }
        if (statusNovo.equals("FECHADO") && statusAnterior.equals("FECHADO") == false) {
            if (service.acessoAmplo() == false) {
                throw new AccessDeniedException("Apenas administradores e tecnicos podem concluir chamados");
            }
            String solucaoRecebida = dados.getSolucao() == null ? "" : dados.getSolucao().trim();
            if (solucaoRecebida.length() < 5) {
                throw new IllegalArgumentException("Solucao obrigatoria para concluir o chamado");
            }
            atual.setSolucao(solucaoRecebida);
        } else if (dados.getSolucao() != null && service.acessoAmplo()) {
            atual.setSolucao(dados.getSolucao());
        }
        atual.setTitulo(dados.getTitulo());
        atual.setDescricao(dados.getDescricao());
        atual.setStatus(statusNovo.isEmpty() ? atual.getStatus() : statusNovo);
        atual.setPrioridade(dados.getPrioridade());
        if (service.acessoAmplo()) {
            atual.setDataFechamento(dados.getDataFechamento());
            atual.setIdSolicitante(dados.getIdSolicitante());
            atual.setIdTecnico(dados.getIdTecnico());
            atual.setIdEquipamento(dados.getIdEquipamento());
        } else {
            atual.setIdEquipamento(dados.getIdEquipamento());
        }
        Chamado salvo = service.salvar(atual);
        return ResponseEntity.ok(service.paraResposta(salvo));
    }

    @PutMapping("/{id}/concluir")
    @PreAuthorize("hasAnyRole('ADMIN','TECNICO')")
    public ResponseEntity<ChamadoResposta> concluir(@PathVariable int id, @RequestBody Map<String, String> corpo) {
        Chamado acessivel = service.buscarAcessivel(id);
        if (acessivel == null) {
            return ResponseEntity.notFound().build();
        }
        String solucao = corpo == null ? "" : corpo.get("solucao");
        Chamado fechado = service.concluir(id, solucao);
        if (fechado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(service.paraResposta(fechado));
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
