package br.com.nexusti.service;

import br.com.nexusti.model.Chamado;
import br.com.nexusti.repository.ChamadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class ChamadoService {

    @Autowired
    private ChamadoRepository repository;

    public List<Chamado> listarTodos() {
        return repository.findAll();
    }

    public Chamado buscarPorId(int id) {
        return repository.findById(id).orElse(null);
    }

    public Chamado salvar(Chamado chamado) {
        chamado.setStatus("ABERTO");
        chamado.setDataAbertura(LocalDate.now().toString());
        return repository.save(chamado);
    }

    public void excluir(int id) {
        repository.deleteById(id);
    }
}
