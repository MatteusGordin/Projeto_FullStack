package br.com.nexusti.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Equipamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String patrimonio;
    private String tipo;
    private String marca;
    private String modelo;
    private Integer idSetor;

    public Equipamento() {
    }

    public Equipamento(int id, String patrimonio, String tipo, String marca, String modelo, Integer idSetor) {
        this.id = id;
        this.patrimonio = patrimonio;
        this.tipo = tipo;
        this.marca = marca;
        this.modelo = modelo;
        this.idSetor = idSetor;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getPatrimonio() {
        return patrimonio;
    }

    public void setPatrimonio(String patrimonio) {
        this.patrimonio = patrimonio;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public Integer getIdSetor() {
        return idSetor;
    }

    public void setIdSetor(Integer idSetor) {
        this.idSetor = idSetor;
    }
}
