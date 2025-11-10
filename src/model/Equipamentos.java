package model;

public class Equipamentos {
   private String nome;
   private String tipo;
   private String marca;
   private double preco;
    
    public Equipamentos(String nome, String tipo, String marca, double preco) {
        this.setNome(nome);
        this.setTipo(tipo);
        this.setMarca(marca);
        this.setPreco(preco);
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        if(nome== null || nome.trim().isEmpty()){
            throw new IllegalArgumentException("O nome não pode ser nulo");
        }
        this.nome = nome;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        if(tipo== null || tipo.trim().isEmpty()){
            throw new IllegalArgumentException("O tipo não pode ser nulo");
        }
        this.tipo = tipo;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        if(marca== null || marca.trim().isEmpty()){
            throw new IllegalArgumentException("O marca não pode ser nulo");
        }
        this.marca = marca;
    }

    public double getPreco() {
        return preco;
    }

    public void setPreco(double preco) {
        if(preco<0){
         throw new IllegalArgumentException("O preço não pode ser negativo") }
        this.preco = preco;
    }

    @Override
    public String toString() {
        return "equipamentos [nome=" + nome + ", tipo=" + tipo + ", marca=" + marca + ", preco=" + preco + "]";
    }
    
}
