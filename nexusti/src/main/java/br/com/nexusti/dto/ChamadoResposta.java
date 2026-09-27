package br.com.nexusti.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public class ChamadoResposta {
    private Integer id;
    private String titulo;
    private String descricao;
    private String status;
    private String prioridade;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dataAbertura;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dataFechamento;
    private Integer idSolicitante;
    private Integer idTecnico;
    private Integer idEquipamento;
    private String solucao;
    private String nomeSolicitante;
    private String nomeSetorSolicitante;
    private String siglaSetorSolicitante;
    private String corPrioridade;

    public ChamadoResposta() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
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

    public LocalDateTime getDataAbertura() {
        return dataAbertura;
    }

    public void setDataAbertura(LocalDateTime dataAbertura) {
        this.dataAbertura = dataAbertura;
    }

    public LocalDateTime getDataFechamento() {
        return dataFechamento;
    }

    public void setDataFechamento(LocalDateTime dataFechamento) {
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

    public String getSolucao() {
        return solucao;
    }

    public void setSolucao(String solucao) {
        this.solucao = solucao;
    }

    public String getNomeSolicitante() {
        return nomeSolicitante;
    }

    public void setNomeSolicitante(String nomeSolicitante) {
        this.nomeSolicitante = nomeSolicitante;
    }

    public String getNomeSetorSolicitante() {
        return nomeSetorSolicitante;
    }

    public void setNomeSetorSolicitante(String nomeSetorSolicitante) {
        this.nomeSetorSolicitante = nomeSetorSolicitante;
    }

    public String getSiglaSetorSolicitante() {
        return siglaSetorSolicitante;
    }

    public void setSiglaSetorSolicitante(String siglaSetorSolicitante) {
        this.siglaSetorSolicitante = siglaSetorSolicitante;
    }

    public String getCorPrioridade() {
        return corPrioridade;
    }

    public void setCorPrioridade(String corPrioridade) {
        this.corPrioridade = corPrioridade;
    }
}
