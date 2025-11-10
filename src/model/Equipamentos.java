package model;

public class Equipamentos {
    String nome;
    String tipo;
    String marca;
    double preco;
    
    public Equipamentos(String nome, String tipo, String marca, double preco) {
        this.nome = nome;
        this.tipo = tipo;
        this.marca = marca;
        this.preco = preco;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
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

    public double getPreco() {
        return preco;
    }

    public void setPreco(double preco) {
        this.preco = preco;
    }

    @Override
    public String toString() {
        return "equipamentos [nome=" + nome + ", tipo=" + tipo + ", marca=" + marca + ", preco=" + preco + "]";
    }
    
}
