package repository;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import model.Equipamentos;
public class EquipamentoRepo {
    
    ArrayList<Equipamentos> lista = new ArrayList<>();

    

    public void adicionar(Equipamentos e){    // adicionar metodo para criar o objeto.
        if (e == null) return;
        lista.add(e);}

    
    }
