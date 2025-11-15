import model.Equipamentos;
import repository.EquipamentoRepo;
import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        //
        int n;
       
        Scanner ler = new Scanner(System.in);
        EquipamentoRepo repo = new EquipamentoRepo();
        //

        System.out.println("-----Bem vindo ao GearTone-----");  // 

        do{
            System.out.println("1 - Cadastrar novo equipamento");
            System.out.println("2 - Listar equipamentos");
            System.out.println("3 - Remover equipamentos");
            System.out.println("4 - Sets de timbres");
            System.out.println("5 - Sair");
            System.out.println("Escolha sua opção:");
            n = ler.nextInt();
            
            switch (n) {
                case 1:
                
                    ler.nextLine();
                    System.out.println("Nome do equipamento: ");             // quero fazer um loop para poder adicionar mais
                    String nomeequ = ler.nextLine();
                    System.out.println("Qual modelo?: ");
                    String tipoequ = ler.nextLine();
                    System.out.println("Marca do equipamento: ");
                    String marcaequ = ler.nextLine();
                    System.out.println("Preço: ");
                    double precoequ = ler.nextDouble();
                    ler.nextLine();

                    Equipamentos r =new Equipamentos(nomeequ, tipoequ, marcaequ, precoequ);
                    repo.adicionar(r);
                    
                
                    break;

                    case 2:
                    
                    break;
                    case 3:
                    
                    break;
                    case 4:
                    
                    break;
                    case 5:
                    System.out.println("Encerrando programa");
                    break;
            
                default:
                System.out.println("opção inválida");
                    break;
            }

        }while(n!=5);







     
       
     
   
    }
}
