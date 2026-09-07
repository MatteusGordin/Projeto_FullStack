package br.com.nexusti.service;

import br.com.nexusti.model.Equipamento;
import br.com.nexusti.repository.EquipamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EquipamentoService {

    @Autowired
    private EquipamentoRepository repository;

    public List<Equipamento> listarTodos() {
        return repository.findAll();
    }

    public Equipamento buscarPorId(int id) {
        return repository.findById(id).orElse(null);
    }

    public Equipamento salvar(Equipamento equipamento) {
        return repository.save(equipamento);
    }

    public void excluir(int id) {
        repository.deleteById(id);
    }
}
