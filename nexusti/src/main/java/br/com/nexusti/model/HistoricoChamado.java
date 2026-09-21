package br.com.nexusti.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class HistoricoChamado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String mensagem;
    private String dataRegistro;
    private Integer idChamado;
    private Integer idUsuario;

    public HistoricoChamado() {
    }

    public HistoricoChamado(int id, String mensagem, String dataRegistro, Integer idChamado, Integer idUsuario) {
        this.id = id;
        this.mensagem = mensagem;
        this.dataRegistro = dataRegistro;
        this.idChamado = idChamado;
        this.idUsuario = idUsuario;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public String getDataRegistro() {
        return dataRegistro;
    }

    public void setDataRegistro(String dataRegistro) {
        this.dataRegistro = dataRegistro;
    }

    public Integer getIdChamado() {
        return idChamado;
    }

    public void setIdChamado(Integer idChamado) {
        this.idChamado = idChamado;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }
}
