package br.com.nexusti.service;

import br.com.nexusti.model.Chamado;
import br.com.nexusti.model.Usuario;
import br.com.nexusti.repository.ChamadoRepository;
import br.com.nexusti.repository.PrioridadeRepository;
import br.com.nexusti.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class ChamadoService {

    @Autowired
    private ChamadoRepository repository;

    @Autowired
    private UsuarioRepository usuarios;

    @Autowired
    private PrioridadeRepository prioridades;

    public Pageable paginacaoPadrao(Pageable pageable) {
        if (pageable.getSort().isUnsorted()) {
            return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(Sort.Direction.DESC, "dataAbertura"));
        }
        return pageable;
    }

    public Page<Chamado> listarTodos(Pageable pageable) {
        Pageable paginacao = paginacaoPadrao(pageable);
        if (acessoAmplo()) {
            return repository.findAll(paginacao);
        }
        Usuario dono = usuarioLogado();
        if (dono == null) {
            return Page.empty(paginacao);
        }
        return repository.findByIdSolicitante(dono.getId(), paginacao);
    }

    public boolean acessoAmplo() {
        Authentication autenticacao = SecurityContextHolder.getContext().getAuthentication();
        if (autenticacao == null || autenticacao.getAuthorities() == null) {
            return false;
        }
        return autenticacao.getAuthorities().stream().anyMatch(papel -> papel.getAuthority().equals("ROLE_TECNICO") || papel.getAuthority().equals("ROLE_ADMIN"));
    }

    public Usuario usuarioLogado() {
        Authentication autenticacao = SecurityContextHolder.getContext().getAuthentication();
        String email = autenticacao == null ? "" : autenticacao.getName();
        return usuarios.findByEmail(email == null ? "" : email.trim()).orElse(null);
    }

    public Chamado buscarAcessivel(int id) {
        Chamado chamado = repository.findById(id).orElse(null);
        if (chamado == null) {
            return null;
        }
        if (acessoAmplo()) {
            return chamado;
        }
        Usuario dono = usuarioLogado();
        if (dono == null || dono.getId() == null) {
            return null;
        }
        if (dono.getId().equals(chamado.getIdSolicitante()) == false) {
            return null;
        }
        return chamado;
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
        validarPrioridade(chamado);
        if (chamado.getId() == null || chamado.getId() == 0) {
            chamado.setStatus("ABERTO");
            chamado.setDataAbertura(LocalDateTime.now());
        }
        return repository.save(chamado);
    }

    public void validarPrioridade(Chamado chamado) {
        String prioridadeNormalizada = chamado.getPrioridade() == null ? "" : chamado.getPrioridade().trim().toUpperCase();
        if (prioridadeNormalizada.isEmpty()) {
            return;
        }
        long totalCatalogo = prioridades.count();
        if (totalCatalogo == 0) {
            chamado.setPrioridade(prioridadeNormalizada);
            return;
        }
        boolean existe = prioridades.findByNome(prioridadeNormalizada).isPresent();
        if (existe) {
            chamado.setPrioridade(prioridadeNormalizada);
            return;
        }
        boolean edicao = chamado.getId() != null && chamado.getId() != 0;
        if (edicao) {
            Chamado persistido = repository.findById(chamado.getId()).orElse(null);
            String atual = persistido == null || persistido.getPrioridade() == null ? "" : persistido.getPrioridade().trim().toUpperCase();
            if (atual.equals(prioridadeNormalizada)) {
                return;
            }
        }
        throw new IllegalArgumentException("Prioridade invalida");
    }

    public Map<String, Long> contarPorPrioridade() {
        if (acessoAmplo()) {
            return agruparPorPrioridade(repository.contarPorPrioridade());
        }
        Usuario dono = usuarioLogado();
        if (dono == null || dono.getId() == null) {
            return new HashMap<>();
        }
        return agruparPorPrioridade(repository.contarPorPrioridadeDe(dono.getId()));
    }

    public Map<String, Long> agruparPorPrioridade(java.util.List<Object[]> linhas) {
        Map<String, Long> corpo = new HashMap<>();
        for (Object[] linha : linhas) {
            String nome = linha[0] == null ? "" : String.valueOf(linha[0]);
            Long total = linha[1] == null ? 0L : ((Number) linha[1]).longValue();
            corpo.put(nome, total);
        }
        return corpo;
    }

    public void excluir(int id) {
        repository.deleteById(id);
    }

    public long contarAbertos() {
        if (acessoAmplo()) {
            return repository.countByStatus("ABERTO");
        }
        Usuario dono = usuarioLogado();
        if (dono == null || dono.getId() == null) {
            return 0L;
        }
        return repository.countByStatusAndIdSolicitante("ABERTO", dono.getId());
    }

    public long contarFechados() {
        if (acessoAmplo()) {
            return repository.countByStatus("FECHADO");
        }
        Usuario dono = usuarioLogado();
        if (dono == null || dono.getId() == null) {
            return 0L;
        }
        return repository.countByStatusAndIdSolicitante("FECHADO", dono.getId());
    }
}
