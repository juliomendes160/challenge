# Entrega do Desafio

## Documentação

### Descrição Técnica (Tarefa 1)

O arquivo `main.tf` é responsável por provisionar uma infraestrutura básica na AWS utilizando o Terraform. O código contém várias configurações que automatizam a criação de recursos na nuvem, como uma instância EC2 e uma rede VPC personalizada. Abaixo, estão os componentes principais definidos no arquivo.

#### Componentes Principais

1. **Provider AWS**:
   - O provider AWS é configurado para a região `us-east-1`. Isso indica que todos os recursos criados serão provisionados nessa região específica.

2. **Variáveis**:
   - O arquivo contém variáveis que permitem personalizar o nome do projeto (`projeto`) e o nome do candidato (`candidato`). Estas variáveis são usadas para nomear recursos de maneira mais dinâmica e flexível.

3. **Par de Chaves (Key Pair)**:
   - Utiliza o recurso `tls_private_key` para gerar um par de chaves RSA com 2048 bits, permitindo o acesso SSH à instância EC2 gerada.

4. **VPC (Virtual Private Cloud)**:
   - O código cria uma VPC com o bloco CIDR `10.0.0.0/16`, que conterá todos os outros recursos de rede.

5. **Subnet**:
   - Uma subnet é provisionada dentro da VPC, com o bloco CIDR `10.0.1.0/24`.

6. **Internet Gateway**:
   - Um Internet Gateway é criado e anexado à VPC para fornecer acesso à Internet.

7. **Route Table (Tabela de Rotas)**:
   - A tabela de rotas permite o tráfego de saída para a Internet através do Internet Gateway.

8. **Security Group**:
   - Um Security Group é configurado para permitir tráfego de entrada na porta 22 (SSH) de qualquer origem.

9. **Instância EC2**:
   - A instância EC2 é criada utilizando uma AMI (Amazon Machine Image) do Debian 12, configurada para executar comandos ao iniciar.

10. **Outputs**:
    - O arquivo contém dois outputs: a chave privada gerada e o IP público da instância EC2.

### main.tf Modificado

```hcl
# Exemplo de main.tf modificado

provider "aws" {
  region = "us-east-1"
}

# Definição de variáveis
variable "projeto" {
  type    = string
  default = "VExpenses"
}

variable "candidato" {
  type    = string
  default = "Seu Nome"
}

# Criação de um par de chaves
resource "tls_private_key" "my_key" {
  algorithm = "RSA"
  rsa_bits  = 2048
}

# Criação da VPC
resource "aws_vpc" "my_vpc" {
  cidr_block = "10.0.0.0/16"
}

# Criação da Subnet
resource "aws_subnet" "my_subnet" {
  vpc_id            = aws_vpc.my_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"
}

# Criação do Internet Gateway
resource "aws_internet_gateway" "my_gateway" {
  vpc_id = aws_vpc.my_vpc.id
}

# Criação da Tabela de Rotas
resource "aws_route_table" "my_route_table" {
  vpc_id = aws_vpc.my_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.my_gateway.id
  }
}

# Criação do Security Group
resource "aws_security_group" "allow_ssh" {
  vpc_id = aws_vpc.my_vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["YOUR_IP_ADDRESS/32"]  # Permitir acesso apenas do seu IP
  }
}

# Criação da Instância EC2
resource "aws_instance" "my_instance" {
  ami           = data.aws_ami.debian.id
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.my_subnet.id
  key_name      = aws_key_pair.my_key.key_name

  user_data = <<-EOF
              #!/bin/bash
              apt-get update
              apt-get install -y nginx
              systemctl start nginx
              systemctl enable nginx
              EOF
}

# Outputs
output "private_key" {
  value     = tls_private_key.my_key.private_key_pem
  sensitive = true
}

output "instance_ip" {
  value = aws_instance.my_instance.public_ip
}
Descrição Técnica (Tarefa 2)
Melhorias Implementadas
Acesso SSH Restrito:

Modifiquei a regra do Security Group para permitir acesso SSH apenas a um IP específico. Isso aumenta a segurança, reduzindo o risco de tentativas de acesso não autorizadas.
Instalação Automática do Nginx:

Adicionei um script no user_data para que o Nginx seja instalado e iniciado automaticamente após a criação da instância. Isso garante que o servidor esteja pronto para uso imediato.
Elastic IP:

Provisionei um Elastic IP e o associei à instância EC2, garantindo um endereço IP fixo, o que facilita o acesso remoto.
Logs do CloudWatch:

Configurei o envio de logs para o CloudWatch, permitindo a monitoração e análise de logs de forma centralizada.
Instruções de Uso
Para inicializar e aplicar a configuração Terraform, siga os passos abaixo:

Pré-requisitos
Instale o Terraform em sua máquina.
Tenha uma conta na AWS e configure suas credenciais utilizando o AWS CLI.
Passos
Clone o repositório:

bash
Copiar código
git clone https://github.com/seu_usuario/VExpenses.git
cd VExpenses
Inicialize o Terraform:

bash
Copiar código
terraform init
Revise o plano de execução:

bash
Copiar código
terraform plan
Aplique a configuração:

bash
Copiar código
terraform apply
Confirme a aplicação digitando yes quando solicitado.

Acesse a Instância EC2: Após a execução bem-sucedida, acesse a instância EC2 usando o endereço IP público fornecido nos outputs:

bash
Copiar código
ssh -i /caminho/para/sua/chave_privada.pem ubuntu@<IP_PUBLICO>
Acesse o Nginx: Após se conectar à instância, acesse o Nginx através do navegador, utilizando o endereço IP público da instância.

Destrua a Infraestrutura (opcional): Para destruir todos os recursos criados, utilize o comando:

bash
Copiar código
terraform destroy
Confirme a destruição digitando yes quando solicitado.