package br.com.nexusti.controller;

import br.com.nexusti.model.Usuario;
import br.com.nexusti.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService service;

    @GetMapping
    public List<Usuario> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public Usuario buscarPorId(@PathVariable int id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public Usuario criar(@RequestBody Usuario usuario) {
        return service.salvar(usuario);
    }

    @PutMapping("/{id}")
    public Usuario atualizar(@PathVariable int id, @RequestBody Usuario dados) {
        Usuario atual = service.buscarPorId(id);
        atual.setNome(dados.getNome());
        atual.setEmail(dados.getEmail());
        atual.setSenha(dados.getSenha());
        atual.setPerfil(dados.getPerfil());
        atual.setIdSetor(dados.getIdSetor());
        return service.salvar(atual);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable int id) {
        service.excluir(id);
    }
}
