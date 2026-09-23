package br.com.nexusti.service;

import br.com.nexusti.model.Prioridade;
import br.com.nexusti.repository.PrioridadeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PrioridadeService {

    @Autowired
    private PrioridadeRepository repository;

    public Page<Prioridade> listarTodos(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public List<Prioridade> listarOpcoes() {
        return repository.findByAtivaTrueOrderByOrdemAscNomeAsc();
    }

    public Prioridade buscarPorId(int id) {
        return repository.findById(id).orElse(null);
    }

    public Prioridade salvar(Prioridade prioridade) {
        boolean edicao = prioridade.getId() != null && prioridade.getId() != 0;
        String nomeValidado = prioridade.getNome() == null ? "" : prioridade.getNome().trim().toUpperCase();
        if (nomeValidado.isEmpty() || nomeValidado.length() < 2) {
            throw new IllegalArgumentException("Nome da prioridade invalido");
        }
        Prioridade existente = repository.findByNome(nomeValidado).orElse(null);
        if (existente != null && (edicao == false || existente.getId().equals(prioridade.getId()) == false)) {
            throw new IllegalArgumentException("Prioridade ja cadastrada");
        }
        String corValidada = prioridade.getCor() == null ? "" : prioridade.getCor().trim();
        if (corValidada.isEmpty()) {
            corValidada = "#64748B";
        }
        prioridade.setNome(nomeValidado);
        prioridade.setCor(corValidada);
        if (prioridade.getOrdem() == null) {
            prioridade.setOrdem(0);
        }
        if (edicao == false && prioridade.getAtiva() == null) {
            prioridade.setAtiva(true);
        }
        return repository.save(prioridade);
    }

    public void excluir(int id) {
        repository.deleteById(id);
    }
}
