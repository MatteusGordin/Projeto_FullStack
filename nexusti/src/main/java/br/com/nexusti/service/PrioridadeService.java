package br.com.nexusti.service;

import br.com.nexusti.model.Prioridade;
import br.com.nexusti.repository.PrioridadeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PrioridadeService {

    @Autowired
    private PrioridadeRepository repository;

    public static final Map<String, String> CORES_PERMITIDAS = criarPaleta();

    private static Map<String, String> criarPaleta() {
        Map<String, String> paleta = new HashMap<>();
        paleta.put("VERMELHO", "#EF4444");
        paleta.put("LARANJA", "#F97316");
        paleta.put("AMARELO", "#EAB308");
        paleta.put("VERDE", "#22C55E");
        paleta.put("AZUL", "#3B82F6");
        paleta.put("CINZA", "#64748B");
        paleta.put("#EF4444", "#EF4444");
        paleta.put("#F97316", "#F97316");
        paleta.put("#EAB308", "#EAB308");
        paleta.put("#22C55E", "#22C55E");
        paleta.put("#3B82F6", "#3B82F6");
        paleta.put("#64748B", "#64748B");
        return paleta;
    }

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
        String corRecebida = prioridade.getCor() == null ? "" : prioridade.getCor().trim().toUpperCase();
        if (corRecebida.isEmpty()) {
            corRecebida = "#64748B";
        }
        String corNormalizada = CORES_PERMITIDAS.get(corRecebida);
        if (corNormalizada == null) {
            throw new IllegalArgumentException("Cor da prioridade invalida");
        }
        prioridade.setNome(nomeValidado);
        prioridade.setCor(corNormalizada);
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
