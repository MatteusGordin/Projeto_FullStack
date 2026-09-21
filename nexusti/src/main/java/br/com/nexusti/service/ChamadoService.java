package br.com.nexusti.service;

import br.com.nexusti.model.Chamado;
import br.com.nexusti.model.Usuario;
import br.com.nexusti.repository.ChamadoRepository;
import br.com.nexusti.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class ChamadoService {

    @Autowired
    private ChamadoRepository repository;

    @Autowired
    private UsuarioRepository usuarios;

    public Page<Chamado> listarTodos(Pageable pageable) {
        Authentication autenticacao = SecurityContextHolder.getContext().getAuthentication();
        boolean amplo = false;
        if (autenticacao != null && autenticacao.getAuthorities() != null) {
            amplo = autenticacao.getAuthorities().stream().anyMatch(papel -> papel.getAuthority().equals("ROLE_TECNICO") || papel.getAuthority().equals("ROLE_ADMIN"));
        }
        if (amplo) {
            return repository.findAll(pageable);
        }
        String email = autenticacao == null ? "" : autenticacao.getName();
        Usuario dono = usuarios.findByEmail(email == null ? "" : email.trim()).orElse(null);
        if (dono == null) {
            return Page.empty(pageable);
        }
        return repository.findByIdSolicitante(dono.getId(), pageable);
    }

    public Chamado buscarPorId(int id) {
        return repository.findById(id).orElse(null);
    }

    public Chamado salvar(Chamado chamado) {
        String tituloValidado = chamado.getTitulo() == null ? "" : chamado.getTitulo().trim();
        String descricaoValidada = chamado.getDescricao() == null ? "" : chamado.getDescricao().trim();
        if (tituloValidado.isEmpty() || tituloValidado.length() < 3) {
            throw new IllegalArgumentException("Titulo do chamado invalido");
        }
        if (descricaoValidada.isEmpty() || descricaoValidada.length() < 5) {
            throw new IllegalArgumentException("Descricao do chamado invalida");
        }
        if (chamado.getIdSolicitante() == null || chamado.getIdSolicitante() <= 0) {
            throw new IllegalArgumentException("Solicitante do chamado invalido");
        }
        if (chamado.getIdEquipamento() == null || chamado.getIdEquipamento() <= 0) {
            throw new IllegalArgumentException("Equipamento do chamado invalido");
        }
        chamado.setTitulo(tituloValidado);
        chamado.setDescricao(descricaoValidada);
        if (chamado.getId() == 0) {
            chamado.setStatus("ABERTO");
            chamado.setDataAbertura(LocalDateTime.now());
        }
        return repository.save(chamado);
    }

    public void excluir(int id) {
        repository.deleteById(id);
    }

    public long contarAbertos() {
        return repository.countByStatus("ABERTO");
    }

    public long contarFechados() {
        return repository.countByStatus("FECHADO");
    }
}
