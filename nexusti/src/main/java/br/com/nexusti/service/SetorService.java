package br.com.nexusti.service;

import br.com.nexusti.model.Setor;
import br.com.nexusti.repository.SetorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class SetorService {

    @Autowired
    private SetorRepository repository;

    public Page<Setor> listarTodos(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Setor buscarPorId(int id) {
        return repository.findById(id).orElse(null);
    }

    public Setor salvar(Setor setor) {
        String nomeValidado = setor.getNome() == null ? "" : setor.getNome().trim();
        String siglaValidada = setor.getSigla() == null ? "" : setor.getSigla().trim();
        if (nomeValidado.isEmpty() || nomeValidado.length() < 2) {
            throw new IllegalArgumentException("Nome do setor invalido");
        }
        if (siglaValidada.isEmpty() || siglaValidada.length() < 2) {
            throw new IllegalArgumentException("Sigla do setor invalida");
        }
        setor.setNome(nomeValidado);
        setor.setSigla(siglaValidada);
        return repository.save(setor);
    }

    public void excluir(int id) {
        repository.deleteById(id);
    }
}
