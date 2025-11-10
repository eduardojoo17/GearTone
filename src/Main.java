import model.Equipamentos;
import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {

        Scanner ler = new Scanner(System.in);
        System.out.println("Bem vindo ao GearTone");  // 
     
       System.out.println("Nome do equipamento: ");             // quero fazer um loop para poder adicionar
       String nomeequ = ler.nextLine();
       System.out.println("Qual o tipo do equipamento: ");
       String tipoequ = ler.nextLine();
       System.out.println("Marca do equipamento: ");
       String marcaequ = ler.nextLine();
       System.out.println("Preço do equipamento: ");
       double precoequ = ler.nextDouble();
       
       // variaveis criadas acima, foram adicionadas aqui para poder criar um objeto
    Equipamentos equi = new Equipamentos(nomeequ,tipoequ,marcaequ,precoequ); 

     // array para adicionair mais equpamentos
    ArrayList<Equipamentos> equipolista = new ArrayList<>();            

    //aqui o objeto e inserido no array
equipolista.add(equi);
      
   
   System.out.println(equi);
   
    }
}
