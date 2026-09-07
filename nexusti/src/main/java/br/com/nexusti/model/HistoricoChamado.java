package br.com.nexusti.model;

public class HistoricoChamado {

    private int id;
    private String mensagem;
    private String dataRegistro;
    private int idChamado;
    private int idUsuario;

    public HistoricoChamado() {
    }

    public HistoricoChamado(int id, String mensagem, String dataRegistro, int idChamado, int idUsuario) {
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

    public int getIdChamado() {
        return idChamado;
    }

    public void setIdChamado(int idChamado) {
        this.idChamado = idChamado;
    }

    public int getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(int idUsuario) {
        this.idUsuario = idUsuario;
    }
}
