package br.com.nexusti.repository;

import br.com.nexusti.model.Equipamento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EquipamentoRepository extends JpaRepository<Equipamento, Integer> {
}
