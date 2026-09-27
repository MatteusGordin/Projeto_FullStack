package br.com.nexusti.repository;

import br.com.nexusti.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByEmail(String email);
    long countByPerfilAndAtivo(String perfil, Boolean ativo);
}
