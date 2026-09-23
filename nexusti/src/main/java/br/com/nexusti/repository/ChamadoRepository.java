package br.com.nexusti.repository;

import br.com.nexusti.model.Chamado;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ChamadoRepository extends JpaRepository<Chamado, Integer> {
    Page<Chamado> findByIdSolicitante(Integer idSolicitante, Pageable pageable);
    long countByStatus(String status);
    long countByStatusAndIdSolicitante(String status, Integer idSolicitante);
    @Query("SELECT c.prioridade, COUNT(c) FROM Chamado c GROUP BY c.prioridade")
    List<Object[]> contarPorPrioridade();
    @Query("SELECT c.prioridade, COUNT(c) FROM Chamado c WHERE c.idSolicitante = :idSolicitante GROUP BY c.prioridade")
    List<Object[]> contarPorPrioridadeDe(@Param("idSolicitante") Integer idSolicitante);
}
