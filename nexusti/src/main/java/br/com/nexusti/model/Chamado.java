package br.com.nexusti.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Chamado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String titulo;
    private String descricao;
    private String status;
    private String prioridade;
    private String dataAbertura;
    private String dataFechamento;
    private Integer idSolicitante;
    private Integer idTecnico;
    private Integer idEquipamento;

    public Chamado() {
    }

    public Chamado(int id, String titulo, String descricao, String status, String prioridade, String dataAbertura, String dataFechamento, Integer idSolicitante, Integer idTecnico, Integer idEquipamento) {
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.status = status;
        this.prioridade = prioridade;
        this.dataAbertura = dataAbertura;
        this.dataFechamento = dataFechamento;
        this.idSolicitante = idSolicitante;
        this.idTecnico = idTecnico;
        this.idEquipamento = idEquipamento;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPrioridade() {
        return prioridade;
    }

    public void setPrioridade(String prioridade) {
        this.prioridade = prioridade;
    }

    public String getDataAbertura() {
        return dataAbertura;
    }

    public void setDataAbertura(String dataAbertura) {
        this.dataAbertura = dataAbertura;
    }

    public String getDataFechamento() {
        return dataFechamento;
    }

    public void setDataFechamento(String dataFechamento) {
        this.dataFechamento = dataFechamento;
    }

    public Integer getIdSolicitante() {
        return idSolicitante;
    }

    public void setIdSolicitante(Integer idSolicitante) {
        this.idSolicitante = idSolicitante;
    }

    public Integer getIdTecnico() {
        return idTecnico;
    }

    public void setIdTecnico(Integer idTecnico) {
        this.idTecnico = idTecnico;
    }

    public Integer getIdEquipamento() {
        return idEquipamento;
    }

    public void setIdEquipamento(Integer idEquipamento) {
        this.idEquipamento = idEquipamento;
    }
}
