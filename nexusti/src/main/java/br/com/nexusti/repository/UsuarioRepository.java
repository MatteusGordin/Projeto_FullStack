package br.com.nexusti.repository;

import br.com.nexusti.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByEmail(String email);
    List<Usuario> findByIdSetor(Integer idSetor);
    boolean existsByEmail(String email);
    boolean existsByEmailAndIdNot(String email, Integer id);
    long countByPerfilAndAtivo(String perfil, Boolean ativo);
}
