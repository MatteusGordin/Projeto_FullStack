package br.com.nexusti.service;

import br.com.nexusti.model.HistoricoChamado;
import br.com.nexusti.repository.HistoricoChamadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class HistoricoChamadoService {

    @Autowired
    private HistoricoChamadoRepository repository;

    public List<HistoricoChamado> listarTodos() {
        return repository.findAll();
    }

    public HistoricoChamado buscarPorId(int id) {
        return repository.findById(id).orElse(null);
    }

    public HistoricoChamado salvar(HistoricoChamado historico) {
        return repository.save(historico);
    }

    public void excluir(int id) {
        repository.deleteById(id);
    }
}
