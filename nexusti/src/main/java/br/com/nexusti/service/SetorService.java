package br.com.nexusti.service;

import br.com.nexusti.model.Setor;
import br.com.nexusti.repository.SetorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SetorService {

    @Autowired
    private SetorRepository repository;

    public List<Setor> listarTodos() {
        return repository.findAll();
    }

    public Setor buscarPorId(int id) {
        return repository.findById(id).orElse(null);
    }

    public Setor salvar(Setor setor) {
        return repository.save(setor);
    }

    public void excluir(int id) {
        repository.deleteById(id);
    }
}
