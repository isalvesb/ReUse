# <img width="50" height="50" alt="logo-reuse-marrom-png-150x94" src="https://github.com/isalvesb/ReUse/blob/main/assets/images/logo-reuse-readme.png" /> ReUse
O **ReUse** é um aplicativo mobile desenvolvido com **React Native** e **Expo** que tem como objetivo incentivar a reutilização de objetos.
A aplicação permite que usuários publiquem itens que não utilizam mais para que outras pessoas possam reutilizá-los, contribuindo para a sustentabilidade e redução de desperdício.

Este projeto foi desenvolvido como parte de um trabalho acadêmico.

---

## 📌 Contexto da Sprint  

### 1° Sprint  
Esta é a primeira fase do projeto ReUse, uma plataforma digital voltada à economia sustentável, reutilização de produtos e consumo consciente. Nesta SPRINT inicial, o foco está na construção do primeiro contato do usuário com o produto, por meio de uma interface mobile simples, clara e bem estruturada.

---

## 📱 Funcionalidades

### ✅ Já implementado
- Tela de splash animada
- Tela de login com autenticação local
- Tela de criação de conta
- Fluxo de recuperação de senha
- Home com seções de destaque, categorias e itens
- Navegação principal por TabBar
- Tela de publicação com:
  - formulário do item
  - seleção de fotos por câmera ou galeria
  - salvamento automático de rascunho local
- Modal de incentivo à primeira publicação

### 🚧 Em desenvolvimento
- Persistência final das publicações
- Tela “Minha Vitrine” com listagem dos itens publicados
- Jornada do usuário após a primeira publicação
- Sistema de conquistas
- Tela de mensagens/chats
- Login social com Google e Facebook
 
---

## 📌 Status do Projeto

O ReUse está em desenvolvimento como projeto acadêmico e atualmente já possui a base visual e funcional do aplicativo mobile em React Native com Expo.

Nesta versão, os fluxos de acesso, navegação principal, recuperação de senha, publicação com rascunho local e parte da experiência da Home já estão implementados. As próximas etapas concentram-se na persistência completa das publicações, na tela Minha Vitrine, na jornada pós-publicação e no sistema de conquistas.

---

## 🛠️ Tecnologias Utilizadas
Este projeto foi desenvolvido utilizando as seguintes tecnologias: 
<p>
  <img src="https://skillicons.dev/icons?i=react,js,nodejs,typescript,git,github,vscode,figma" />
</p>

---

## 📁 Estrutura do Projeto

```text
REUSE/
├── assets/
│   ├── animations/
│   └── images/
├── src/
│   ├── components/
│   │   ├── CategoryCard/
│   │   ├── CtaCard/
│   │   ├── Header/
│   │   ├── IncentiveCard/
│   │   ├── ItemCard/
│   │   ├── LoadingAnimation/
│   │   ├── PromoCard/
│   │   ├── SearchBar/
│   │   └── TabBar/
│   ├── screens/
│   │   ├── Chats/
│   │   ├── CreateAccount/
│   │   ├── ForgotPass/
│   │   ├── Home/
│   │   ├── Login/
│   │   ├── Publish/
│   │   ├── ResetEmailSent/
│   │   ├── Showcase/
│   │   └── Splash/
│   └── Services/
│       ├── Auth.ts
│       └── Storage.ts
├── App.tsx
├── app.json
├── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🎨 Decisões de Interface e Organização do App
Inicialmente optamos por dar foco à página inicial, onde o usuário é apresentado ao nosso valor principal enquanto plataforma:
“Dê um novo propósito ao que você não usa mais”.
Sendo assim, trabalhamos para conduzir o usuário a descobrir as possibilidades da nossa plataforma através das diferentes seções.

#### 🔍 Barra de Busca
Barra de busca posicionada logo no início da página com placeholder que dá indicação ao usuário de quais termos usar para buscar itens anunciados na ReUse.

#### 🌟 Hero Banner
Banner principal dando ênfase à mensagem principal da plataforma associada com um CTA para publicar um item

#### 🎨 Seção “Curadoria ReUse”
Nessa seção, queremos apresentar os itens cadastrados na plataforma por categorias de curadoria, como “Peças raras” “Sapatos para todos os gostos”,”Para sua casa” onde nossa plataforma reúne e apresenta os itens de acordo com esses temas.

#### 🚀 Seção “Descubra por categoria”
Nessa seção, apresentamos a opção de buscar por categorias mais dentro do padrão: “Roupas, Acessórios, Decoração, Infantil”.

#### 📍Seção “Perto de você”
Mostramos ao usuário quais itens estão próximos da sua localização, facilitando o processo de negociação e obtenção de itens de desejo.

#### 👥 Seção “Prova social”
Aqui finalizamos a tela inicial adicionando o gatilho de prova social adicionando dados sobre quantos itens foram cadastrados na plataforma em um certo período com um CTA de “Publicar item”, novamente com objetivo de conduzir o usuário a publicar novos anúncios nas plataformas.

### 📱 Tab Bar
Na tab bar, optamos por centralizar as tarefas que o usuário utilizará com mais frequência como: Home ( para voltar à página inicial); Publicar ( para criar um novo anúncio); Minha Vitrine ( onde ele irá conferir todos seus anúncios publicados); e Mensagens ( onde ele irá ter acesso às conversas com outros usuários para negociar itens)
---

## 🎨 Decisões de UI
Inicialmente, optamos por usar uma abordagem com linguagem e visual jovem, mas buscando também transmitir seriedade e conexão com temas sustentáveis de forma menos óbvia, fugindo um pouco do tradicional verde e branco muito associados às soluções sustentáveis.
#### ♾️ Logo e Logotipo

<img width="2000" height="800" alt="image" src="https://github.com/user-attachments/assets/3398c220-498a-450e-a4c4-c0a7cb08ee74" />  

Para a logo, utilizamos dois círculos conectados como símbolo para conexão, circulação, troca, comunidade e continuidade, como um símbolo do infinito. Para o logotipo, utilizamos a tipografia Syne com Extrabold para criar uma marca de peso e com “ar” de modernidade.

<img width="2000" height="600" alt="image" src="https://github.com/user-attachments/assets/a510932c-6e60-43dc-9e7e-371e70c98e2a" />  


## 🎨 Paleta de Cores

<img width="2048" height="653" alt="image" src="https://github.com/user-attachments/assets/7464e2f7-a105-4f91-94f5-cf41d0aec458" />  


A paleta de cores foi pensada para transmitir equilíbrio, naturalidade e consciência ambiental com um toque de modernidade, valores alinhados com a proposta do ReUse.
Os tons mais escuros, #342A2A e #584C4C, trazem sensação de solidez, confiança e estabilidade, funcionando bem como cores de base para textos, navegação e elementos estruturais da interface.
O tom #A0947A adiciona um aspecto terroso e orgânico, remetendo a materiais naturais e reforçando a ideia de sustentabilidade e reaproveitamento.Utilizamos em textos de apoio, como subheadings.
Já o #F7EFDE atua como um neutro claro e acolhedor, ideal para fundos e áreas de respiro, ajudando a manter a interface leve e agradável.
Por fim, o #EADDFF introduz um toque suave da cor lilás, trazendo delicadeza e modernidade, além de funcionar como ponto de destaque para elementos interativos ou estados de interface.
No conjunto, a paleta cria uma estética minimalista, acolhedora e contemporânea, que comunica sustentabilidade sem recorrer aos verdes tradicionais, diferenciando visualmente a identidade do produto.

## 🔤 Tipografia

<img width="1053" height="330" alt="image" src="https://github.com/user-attachments/assets/6c55b8d5-00e1-41d9-b55c-49ab8a3291df" />  


A escolha tipográfica combina personalidade e legibilidade, garantindo uma comunicação clara e contemporânea na interface.
A fonte Syne é utilizada como tipografia de destaque. Seu desenho mais expressivo e moderno ajuda a construir a identidade visual da plataforma, sendo ideal para títulos e elementos que precisam chamar atenção. Por ora, utilizamos ela apenas no nome da marca.
Já a Inter, nas variações Regular e Medium, foi escolhida para os textos da interface por sua alta legibilidade em telas.
É uma tipografia amplamente utilizada em produtos digitais, funcionando bem em diferentes tamanhos de tela e garantindo uma leitura confortável em menus, descrições e conteúdos informativos.


<img width="1054" height="352" alt="image" src="https://github.com/user-attachments/assets/1a9ffaac-59c8-4980-8b56-0e4ed382e7cb" />  


## 🖌️ Ilustrações

<img width="2002" height="1195" alt="image" src="https://github.com/user-attachments/assets/36facb46-1769-4160-afbb-9c4f4d7f7d5a" />


As ilustrações seguem um estilo minimalista e humanizado, utilizando traços simples e uma paleta monocromática que mantém a consistência com a identidade visual do projeto.
Esse tipo de ilustração ajuda a tornar a interface mais acolhedora e acessível, representando situações cotidianas e interações humanas relacionadas ao uso da plataforma, como descoberta de produtos, perfis de usuários, troca de itens e tomada de decisões de consumo.
O traço leve e ilustrativo também contribui para reduzir a sensação de complexidade da interface, tornando a experiência mais amigável e intuitiva.
Além disso, o estilo evita excesso de detalhes, o que permite que as ilustrações funcionem bem como elementos de apoio visual, sem competir com as informações principais da interface.

### ✔️ Resultado Inicial

Como resultado dessa primeira sprint, temos nossa primeira versão da tela inicial do ReUse:


<img width="411" height="2048" alt="image" src="https://github.com/user-attachments/assets/2a3d71c0-0209-46e7-bb6b-01f9dac8e690" />


---

## ⚙️ Pré-requisitos
Antes de rodar o projeto, você precisa ter instalado:

- Node.js
- npm
- Git
- Expo Go no celular **ou** um emulador/simulador configurado
- Android Studio (para Android) **ou** Xcode (para iOS, no macOS)

---

## 🚀 Como rodar o projeto
1. Clone o repositório
```
git clone https://github.com/isalvesb/ReUse.git
```
2. Entre na pasta do projeto
```
cd ReUse
```
3. Instale as dependências 
```
npm install
```
4. Inicie o projeto
```
npx expo start
```
5. Depois disso, você pode:
- pressionar ```a``` para abrir no emulador Android
- pressionar ```i``` para abrir no simulador iOS
- escanear o QR Code com o Expo Go no celular

Caso haja problema de conexão no dispositivo físico, você pode tentar:
```
npx expo start --tunnel
```

---

## 🎯 Resultado atual
Até o momento, o ReUse já conta com uma base mobile navegável e funcional construída em React Native com Expo. O projeto possui telas de splash, login, criação de conta, recuperação de senha, home, publicação, vitrine e mensagens, além de componentes reutilizáveis e serviços locais de autenticação e armazenamento.

Nesta etapa, o foco principal foi transformar o planejamento visual da plataforma em interfaces interativas, testando fluxos essenciais de entrada, navegação e publicação. As próximas evoluções do projeto concentram-se na persistência das publicações, exibição real da vitrine, conquistas do usuário e amadurecimento da documentação.

---

## 🖼️ Prótotipo do Figma
O protótipo do aplicativo foi desenvolvido no **Figma** para planejar a interface, a navegação entre telas e a experiência do usuário antes da implementação no código.

Através do protótipo é possível visualizar o fluxo principal da aplicação, e como tudo foi pensado para chegarmos na entrega do projeto.

Acesse o protótipo completo no link abaixo: 

[![Figma Prototype](https://img.shields.io/badge/Figma-ReUse-EADDFF?flat-rounded&logo=figma&logoColor=342A2A&labelColor=F7EFDE)](https://www.figma.com/design/NaexTrfbA7TNhsVIujyBsh/ReUse?m=auto&t=gwLTGc1gaEc1GZdf-6)

---

## 🧑‍💻 Equipe ReUse
<div align="center">

<table>
<tr>

<td align="center">
<img src="https://github.com/amimarinho.png" width="120px"> <br>   
<b>Mirna Marinho</b><br><br>
<a href="https://github.com/amimarinho">
<img src="https://img.shields.io/badge/GitHub-Profile-EADDFF?style=flat-rounded&logo=github&logoColor=342A2A&labelColor=F7EFDE">
</a>
<br>
<a href="https://www.linkedin.com/in/amimarinho/">
<img src="https://img.shields.io/badge/LinkedIn-Profile-EADDFF?style=flat-rounded&logo=linkedin&logoColor=342A2A&labelColor=F7EFDE">
</a>
</td>

<td align="center">
<img src="https://github.com/user-attachments/assets/3a07d7ed-9625-44c3-948a-2c5912d7cc4c" width="120px"><br>
<b>Guilherme Cunha</b><br><br>
<a href="https://github.com/guicunhasou">
<img src="https://img.shields.io/badge/GitHub-Profile-EADDFF?style=flat-rounded&logo=github&logoColor=342A2A&labelColor=F7EFDE">
</a>
<br>
<a href="https://www.linkedin.com/in/guicunhasou/">
<img src="https://img.shields.io/badge/LinkedIn-Profile-EADDFF?style=flat-rounded&logo=linkedin&logoColor=342A2A&labelColor=F7EFDE">
</a>
</td>

<td align="center">
<img src="https://github.com/kaucavalcante.png" width="120px"> <br>  
<b>Kauane Cavalcante</b><br><br>
<a href="https://github.com/kaucavalcante">
<img src="https://img.shields.io/badge/GitHub-Profile-EADDFF?style=flat-rounded&logo=github&logoColor=342A2A&labelColor=F7EFDE">
</a>
<br>
<a href="https://www.linkedin.com/in/kauanecavalcante">
<img src="https://img.shields.io/badge/LinkedIn-Profile-EADDFF?style=flat-rounded&logo=linkedin&logoColor=342A2A&labelColor=F7EFDE">
</a>
</td>

<td align="center">
<img src="https://github.com/isalvesb.png" width="130px"><br>  
<b>Isa Alves</b><br><br>
<a href="https://github.com/isalvesb">
<img src="https://img.shields.io/badge/GitHub-Profile-EADDFF?style=flat-rounded&logo=github&logoColor=342A2A&labelColor=F7EFDE">
</a>
<br>
<a href="https://www.linkedin.com/in/isalvesb/">
<img src="https://img.shields.io/badge/LinkedIn-Profile-EADDFF?style=flat-rounded&logo=linkedin&logoColor=342A2A&labelColor=F7EFDE">
</a>
</td>

</tr>
</table>

</div>
