package repository;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import model.Equipamentos;
public class EquipamentoRepo {
    
  private ArrayList<Equipamentos> lista = new ArrayList<>();

    

    public void adicionar(Equipamentos e){    // adicionar metodo para criar o objeto.
        if (e == null) return;
        lista.add(e);}

    public List<Equipamentos> listarTodos(){  // listar 
        return lista;
    }

    public boolean remover(int indice) {
    if (indice < 0 || indice >= lista.size()) {
        return false; // índice inválido
    }
    lista.remove(indice); // remove o objeto inteiro da lista
    return true;
}

    

    }
