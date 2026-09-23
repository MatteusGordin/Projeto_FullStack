package br.com.nexusti.repository;

import br.com.nexusti.model.Prioridade;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PrioridadeRepository extends JpaRepository<Prioridade, Integer> {
    Optional<Prioridade> findByNome(String nome);
    List<Prioridade> findByAtivaTrueOrderByOrdemAscNomeAsc();
}
