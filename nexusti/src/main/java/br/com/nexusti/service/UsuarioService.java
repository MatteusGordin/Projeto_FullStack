package br.com.nexusti.service;

import br.com.nexusti.model.Usuario;
import br.com.nexusti.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PasswordEncoder encoder;

    public Page<Usuario> listarTodos(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Usuario buscarPorId(int id) {
        return repository.findById(id).orElse(null);
    }

    public Usuario salvar(Usuario usuario) {
        String nomeValidado = usuario.getNome() == null ? "" : usuario.getNome().trim();
        String emailValidado = usuario.getEmail() == null ? "" : usuario.getEmail().trim();
        String senhaValidada = usuario.getSenha() == null ? "" : usuario.getSenha().trim();
        if (nomeValidado.isEmpty() || nomeValidado.length() < 3) {
            throw new IllegalArgumentException("Nome do usuario invalido");
        }
        if (emailValidado.isEmpty() || emailValidado.contains("@") == false) {
            throw new IllegalArgumentException("Email do usuario invalido");
        }
        if (senhaValidada.isEmpty() || senhaValidada.length() < 4) {
            throw new IllegalArgumentException("Senha do usuario invalida");
        }
        if (usuario.getIdSetor() == null || usuario.getIdSetor() <= 0) {
            throw new IllegalArgumentException("Setor do usuario invalido");
        }
        usuario.setNome(nomeValidado);
        usuario.setEmail(emailValidado);
        usuario.setSenha(encoder.encode(senhaValidada));
        return repository.save(usuario);
    }

    public void excluir(int id) {
        repository.deleteById(id);
    }
}
