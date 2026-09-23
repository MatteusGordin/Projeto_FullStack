package br.com.nexusti.service;

import br.com.nexusti.model.Equipamento;
import br.com.nexusti.repository.EquipamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EquipamentoService {

    @Autowired
    private EquipamentoRepository repository;

    public Page<Equipamento> listarTodos(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public List<Equipamento> listarOpcoes() {
        return repository.findAll(Sort.by("patrimonio"));
    }

    public Equipamento buscarPorId(int id) {
        return repository.findById(id).orElse(null);
    }

    public Equipamento salvar(Equipamento equipamento) {
        String patrimonioValidado = equipamento.getPatrimonio() == null ? "" : equipamento.getPatrimonio().trim();
        String tipoValidado = equipamento.getTipo() == null ? "" : equipamento.getTipo().trim();
        String marcaValidada = equipamento.getMarca() == null ? "" : equipamento.getMarca().trim();
        String modeloValidado = equipamento.getModelo() == null ? "" : equipamento.getModelo().trim();
        if (patrimonioValidado.isEmpty()) {
            throw new IllegalArgumentException("Patrimonio do equipamento invalido");
        }
        if (tipoValidado.isEmpty()) {
            throw new IllegalArgumentException("Tipo do equipamento invalido");
        }
        if (marcaValidada.isEmpty()) {
            throw new IllegalArgumentException("Marca do equipamento invalida");
        }
        if (modeloValidado.isEmpty()) {
            throw new IllegalArgumentException("Modelo do equipamento invalido");
        }
        if (equipamento.getIdSetor() == null || equipamento.getIdSetor() <= 0) {
            throw new IllegalArgumentException("Setor do equipamento invalido");
        }
        equipamento.setPatrimonio(patrimonioValidado);
        equipamento.setTipo(tipoValidado);
        equipamento.setMarca(marcaValidada);
        equipamento.setModelo(modeloValidado);
        return repository.save(equipamento);
    }

    public void excluir(int id) {
        repository.deleteById(id);
    }
}
