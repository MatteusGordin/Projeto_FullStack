package br.com.nexusti.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;

@Entity
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotBlank
    @Size(min = 3, max = 100)
    private String nome;
    @NotBlank
    @Email
    @Size(max = 100)
    @Column(unique = true)
    private String email;
    @NotBlank
    @Size(min = 4, max = 100)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String senha;
    @NotBlank
    private String perfil;
    @NotNull
    private Integer idSetor;
    private Boolean ativo;

    public Usuario() {
    }

    public Usuario(Integer id, String nome, String email, String senha, String perfil, Integer idSetor) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.perfil = perfil;
        this.idSetor = idSetor;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getPerfil() {
        return perfil;
    }

    public void setPerfil(String perfil) {
        this.perfil = perfil;
    }

    public Integer getIdSetor() {
        return idSetor;
    }

    public void setIdSetor(Integer idSetor) {
        this.idSetor = idSetor;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String papel = perfil == null ? "" : perfil.trim().toUpperCase();
        if (papel.startsWith("ROLE_") == false) {
            papel = "ROLE_" + papel;
        }
        return List.of(new SimpleGrantedAuthority(papel));
    }

    @Override
    @JsonIgnore
    public String getPassword() {
        return senha;
    }

    @Override
    @JsonIgnore
    public String getUsername() {
        return email;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return ativo == null || ativo;
    }
}
