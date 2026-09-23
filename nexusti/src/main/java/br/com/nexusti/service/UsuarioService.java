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
        boolean edicao = usuario.getId() != null && usuario.getId() != 0;
        String nomeValidado = usuario.getNome() == null ? "" : usuario.getNome().trim();
        String emailValidado = usuario.getEmail() == null ? "" : usuario.getEmail().trim();
        String senhaValidada = usuario.getSenha() == null ? "" : usuario.getSenha().trim();
        String perfilValidado = usuario.getPerfil() == null ? "" : usuario.getPerfil().trim().toUpperCase();
        if (nomeValidado.isEmpty() || nomeValidado.length() < 3) {
            throw new IllegalArgumentException("Nome do usuario invalido");
        }
        if (emailValidado.isEmpty() || emailValidado.contains("@") == false) {
            throw new IllegalArgumentException("Email do usuario invalido");
        }
        if (perfilValidado.equals("ADMIN") == false && perfilValidado.equals("TECNICO") == false && perfilValidado.equals("USUARIO") == false) {
            throw new IllegalArgumentException("Perfil do usuario invalido");
        }
        if (usuario.getIdSetor() == null || usuario.getIdSetor() <= 0) {
            throw new IllegalArgumentException("Setor do usuario invalido");
        }
        usuario.setNome(nomeValidado);
        usuario.setEmail(emailValidado);
        usuario.setPerfil(perfilValidado);
        if (senhaValidada.isEmpty()) {
            if (edicao == false) {
                throw new IllegalArgumentException("Senha do usuario invalida");
            }
            Usuario persistido = repository.findById(usuario.getId()).orElse(null);
            if (persistido == null) {
                throw new IllegalArgumentException("Usuario nao encontrado");
            }
            usuario.setSenha(persistido.getSenha());
        } else {
            if (senhaValidada.length() < 4) {
                throw new IllegalArgumentException("Senha do usuario invalida");
            }
            usuario.setSenha(encoder.encode(senhaValidada));
        }
        if (edicao == false && usuario.getAtivo() == null) {
            usuario.setAtivo(true);
        }
        return repository.save(usuario);
    }

    public void excluir(int id) {
        repository.deleteById(id);
    }
}
