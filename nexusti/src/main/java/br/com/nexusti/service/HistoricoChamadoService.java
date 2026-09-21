package br.com.nexusti.service;

import br.com.nexusti.model.HistoricoChamado;
import br.com.nexusti.repository.HistoricoChamadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class HistoricoChamadoService {

    @Autowired
    private HistoricoChamadoRepository repository;

    public Page<HistoricoChamado> listarTodos(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public HistoricoChamado buscarPorId(int id) {
        return repository.findById(id).orElse(null);
    }

    public HistoricoChamado salvar(HistoricoChamado historico) {
        String mensagemValidada = historico.getMensagem() == null ? "" : historico.getMensagem().trim();
        if (mensagemValidada.isEmpty() || mensagemValidada.length() < 3) {
            throw new IllegalArgumentException("Mensagem do historico invalida");
        }
        if (historico.getIdChamado() == null || historico.getIdChamado() <= 0) {
            throw new IllegalArgumentException("Chamado do historico invalido");
        }
        if (historico.getIdUsuario() == null || historico.getIdUsuario() <= 0) {
            throw new IllegalArgumentException("Usuario do historico invalido");
        }
        historico.setMensagem(mensagemValidada);
        return repository.save(historico);
    }

    public void excluir(int id) {
        repository.deleteById(id);
    }
}
