package br.com.nexusti.service;

import br.com.nexusti.model.Usuario;
import br.com.nexusti.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

    public String perfilDoAtor() {
        Authentication autenticacao = SecurityContextHolder.getContext().getAuthentication();
        if (autenticacao == null || autenticacao.getAuthorities() == null) {
            return "";
        }
        return autenticacao.getAuthorities().stream()
                .map(papel -> normalizarPapel(papel == null ? null : papel.getAuthority()))
                .filter(papel -> papel.equals("ADMIN") || papel.equals("TECNICO") || papel.equals("USUARIO"))
                .findFirst()
                .orElse("");
    }

    public boolean contextoAdministrativoAusente() {
        Authentication autenticacao = SecurityContextHolder.getContext().getAuthentication();
        if (autenticacao == null || autenticacao.getAuthorities() == null) {
            return true;
        }
        String nome = autenticacao.getName() == null ? "" : autenticacao.getName();
        if (nome.equals("anonymousUser")) {
            return true;
        }
        return autenticacao.getAuthorities().stream()
                .map(papel -> normalizarPapel(papel == null ? null : papel.getAuthority()))
                .noneMatch(papel -> papel.equals("ADMIN") || papel.equals("TECNICO"));
    }

    private String normalizarPapel(String autoridade) {
        String valor = autoridade == null ? "" : autoridade.trim().toUpperCase();
        if (valor.startsWith("ROLE_")) {
            return valor.substring(5);
        }
        return valor;
    }

    public void validarGerenciamentoAdmin(String perfilAlvoAtual, String perfilDesejado) {
        String alvoAtual = normalizarPapel(perfilAlvoAtual);
        String desejado = normalizarPapel(perfilDesejado);
        if (contextoAdministrativoAusente()) {
            return;
        }
        String ator = perfilDoAtor();
        if (ator.equals("TECNICO") && (alvoAtual.equals("ADMIN") || desejado.equals("ADMIN"))) {
            throw new AccessDeniedException("Apenas administradores podem gerenciar acessos de nivel ADMIN");
        }
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
        if (edicao) {
            Usuario persistido = repository.findById(usuario.getId()).orElse(null);
            if (persistido == null) {
                throw new IllegalArgumentException("Usuario nao encontrado");
            }
            String emailAtual = persistido.getEmail() == null ? "" : persistido.getEmail().trim();
            if (emailAtual.equals(emailValidado) == false && repository.existsByEmailAndIdNot(emailValidado, usuario.getId())) {
                throw new IllegalArgumentException("Email ja cadastrado");
            }
            String perfilAtual = persistido.getPerfil() == null ? "" : persistido.getPerfil().trim().toUpperCase();
            validarGerenciamentoAdmin(perfilAtual, perfilValidado);
            boolean eraAdminAtivo = perfilAtual.equals("ADMIN") && (persistido.getAtivo() == null || persistido.getAtivo());
            boolean viraNaoAdminOuInativo = perfilValidado.equals("ADMIN") == false || (usuario.getAtivo() != null && usuario.getAtivo() == false);
            if (eraAdminAtivo && viraNaoAdminOuInativo) {
                long totalAdmins = repository.countByPerfilAndAtivo("ADMIN", true);
                if (totalAdmins <= 1) {
                    throw new IllegalArgumentException("Nao e possivel remover o ultimo administrador ativo");
                }
            }
        } else {
            validarGerenciamentoAdmin("", perfilValidado);
            if (repository.existsByEmail(emailValidado)) {
                throw new IllegalArgumentException("Email ja cadastrado");
            }
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
        Usuario alvo = repository.findById(id).orElse(null);
        if (alvo == null) {
            return;
        }
        String perfilAlvo = alvo.getPerfil() == null ? "" : alvo.getPerfil().trim().toUpperCase();
        validarGerenciamentoAdmin(perfilAlvo, perfilAlvo);
        if (perfilAlvo.equals("ADMIN") && (alvo.getAtivo() == null || alvo.getAtivo())) {
            long totalAdmins = repository.countByPerfilAndAtivo("ADMIN", true);
            if (totalAdmins <= 1) {
                throw new IllegalArgumentException("Nao e possivel excluir o ultimo administrador ativo");
            }
        }
        repository.deleteById(id);
    }
}
