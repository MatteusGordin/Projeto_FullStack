package br.com.nexusti.service;

import br.com.nexusti.model.Usuario;
import br.com.nexusti.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    public List<Usuario> listarTodos() {
        return repository.findAll();
    }

    public Usuario buscarPorId(int id) {
        return repository.findById(id).orElse(null);
    }

    public Usuario salvar(Usuario usuario) {
        return repository.save(usuario);
    }

    public void excluir(int id) {
        repository.deleteById(id);
    }
}
