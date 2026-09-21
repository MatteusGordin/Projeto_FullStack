package br.com.nexusti.repository;

import br.com.nexusti.model.Chamado;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChamadoRepository extends JpaRepository<Chamado, Integer> {
    Page<Chamado> findByIdSolicitante(Integer idSolicitante, Pageable pageable);
    long countByStatus(String status);
}
