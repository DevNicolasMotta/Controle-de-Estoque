function mostrarFormulario() {
    const conteudo = document.getElementById("conteudo"); 
    conteudo.innerHTML = `
        <form id="form-produto" class="form-produto">
            <h2 class="titulo-form">Cadastrar Produto</h2>
            <div class="grupo-campos">
                <input type="text" id="nome" placeholder="Nome do produto" required>
                <input type="text" id="codigo" placeholder="Código" required>
                <input type="text" id="categoria" placeholder="Categoria" required>
                <input type="number" id="quantidade" placeholder="Quantidade" required>
                <input type="number" id="precoCompra" placeholder="Preço de compra" step="0.01" required>
                <input type="number" id="precoVenda" placeholder="Preço de venda" step="0.01" required>
            </div>
            <div class="botoes-formulario">
                <button type="submit" class="btn-salvar">Salvar</button>
                <button type="button" onclick="mostrarEstoque()" class="btn-cancelar">Voltar ao Estoque</button>
            </div>
        </form>
    `;
    document.getElementById("form-produto").addEventListener("submit", salvarProduto);
}


function editarProduto(index) {
    const produto = produtos[index]
    const conteudo = document.getElementById("conteudo");
    conteudo.innerHTML= `
     <form id="form-editar-produto">
        <input type="text" id="nome" placeholder="Nome do produto" value="${produto.nome}" required><br>
        <input type="text" id="codigo" placeholder="Código" value="${produto.codigo}" required><br>
        <input type="text" id="categoria" placeholder="Categoria" value="${produto.categoria}" required><br>
        <input type="number" id="quantidade" placeholder="Quantidade" value="${produto.quantidade}" required><br>
        <input type="number" id="precoCompra" placeholder="Preço de compra" value="${produto.precoCompra}" step="0.01" required><br>
        <input type="number" id="precoVenda" placeholder="Preço de venda" value="${produto.precoVenda}" step="0.01" required><br>
        <button type="submit" class="btn-salvar">Salvar Alterações</button>
    </form>
    <br>
    <button onclick="mostrarEstoque()" class="btn-cancelar">Cancelar</button>
    `
    document.getElementById("form-editar-produto").addEventListener("submit",function(event) {
        event.preventDefault();

        //atualiza os dados do produto
        produtos[index] = {
             nome: document.getElementById("nome").value,
            codigo: document.getElementById("codigo").value,
            categoria: document.getElementById("categoria").value,
            quantidade: parseInt(document.getElementById("quantidade").value),
            precoCompra: parseFloat(document.getElementById("precoCompra").value),
            precoVenda: parseFloat(document.getElementById("precoVenda").value)
        };

        localStorage.setItem("produtos", JSON.stringify(produtos));
        alert("Produto Atualizado Com Sucesso!");
        mostrarEstoque();
    });
}

let produtos = [];

const produtosSalvos = localStorage.getItem("produtos");
if (produtosSalvos) {
    produtos = JSON.parse(produtosSalvos);
}

function salvarProduto(event) {
    event.preventDefault(); //impede recarregamento da pagina

    const produto = {
        nome: document.getElementById("nome").value,
        codigo: document.getElementById("codigo").value,
        categoria: document.getElementById("categoria").value,
        quantidade: parseInt(document.getElementById("quantidade").value),
        precoCompra: parseFloat(document.getElementById("precoCompra").value),
        precoVenda: parseFloat(document.getElementById("precoVenda").value)


    };

    produtos.push(produto);
    console.log(produtos); //teste: exibe no console

    //salva no localStorage
    localStorage.setItem("produtos",JSON.stringify(produtos));

    alert("Produto cadastrado com sucesso");
    document.getElementById("form-produto").reset();

}

function excluirProduto(index) {
    if (confirm("Deseja excluir esse produto?")) {
        produtos.splice(index, 1) //remove o item da lista!
        localStorage.setItem("produtos",JSON.stringify(produtos)); //atualiza o localStorage
        mostrarEstoque(); //atualiza a tabela na tela
    }
}

function ordenarProdutos() {
    const criterio = document.getElementById("ordenarPor").value;
    if (criterio) {
        produtos.sort((a, b)=> {
            if (typeof a[criterio] === "string") {
                return a[criterio].localeCompare(b[criterio]);
            } else {
                return a[criterio] - b[criterio];
            }
        });
        mostrarEstoque();//atualiza a tabela
    }
}

function mostrarEstoque() {
    const conteudo = document.getElementById("conteudo");

    //limpa conteudo anterior
    conteudo.innerHTML  = "";

    if (produtos.length === 0) {
        conteudo.innerHTML = "<p>Nenhum produto cadastrado.</p>";
    } else {
        
    }

conteudo.innerHTML += `
    <div class="topo-estoque">
        <div class="filtros">
            <input type="text" id="busca" placeholder="Buscar produto...">
            <label for="ordenarPor">Ordenar por:</label>
            <select id="ordenarPor" onchange="ordenarProdutos()">
                <option value="">Selecione</option>
                <option value="nome">Nome</option>
                <option value="codigo">Código</option>
                <option value="categoria">Categoria</option>
                <option value="quantidade">Quantidade</option>
                <option value="precoCompra">Preço de Compra</option>
                <option value="precoVenda">Preço de Venda</option>
            </select>
        </div>
    </div><br>
`;


    //cria a tabela
    let tabela = "<table class='tabela-produtos'>";
    tabela += 
    `<tr>
        <th>Nome</th>
        <th>Código</th>
        <th>Quantidade</th>
        <th>Ações</th>
    </tr>
    `;



    //aciona os produtos
    produtos.forEach((produto, index ) => {
        tabela += `
        <tr onclick="mostrarDetalhes(${index})" style="cursor:pointer;">
            <td>${produto.nome}</td>
            <td>${produto.codigo}</td>
            <td>${produto.quantidade}</td>
            <td><button onclick="event.stopPropagation(); editarProduto(${index})" class="btn-editar">Editar</button> <button onclick="event.stopPropagation(); excluirProduto(${index})" class="btn-excluir">Excluir</button></td>
           </tr>
        `;        
    });

    tabela+= "</table>";
     conteudo.innerHTML += tabela;
    conteudo.innerHTML += `<br><button onclick="mostrarFormulario()" class="btn-salvar">Cadastrar novo produto</button>`;

    document.getElementById("busca").addEventListener("input", function () {
    const termo = this.value.toLowerCase();
    const linhas = document.querySelectorAll("table tr");

    linhas.forEach((linha, index) => {
        if (index === 0) return; // pula cabeçalho
        const texto = linha.innerText.toLowerCase();
        linha.style.display = texto.includes(termo) ? "" : "none";
    });
});   
};


function mostrarDetalhes(index) {
   const produto = produtos[index];

   const detalhesHTML = `
   <span id="modal-fechar" style="position:absolute; top:10px; right:15px; font-size:24px; cursor:pointer;">&times;</span>
   <p><strong>Nome:</strong> ${produto.nome}</p>
   <p><strong>Código:</strong> ${produto.codigo}</p>
   <p><strong>Categoria</strong> ${produto.categoria}</p>
   <p><strong>Quantidade</strong> ${produto.quantidade}</p>
   <p><strong>Preço de Compra</strong> ${produto.precoCompra.toFixed(2)}</p>
   <p><strong>Preço de Venda</strong> ${produto.precoVenda.toFixed(2)}</p>

   `;
   document.getElementById("modal-detalhes").innerHTML = detalhesHTML;
   document.getElementById("modal").style.display = "flex";
   document.getElementById("modal-fechar").addEventListener("click", () => {
    document.getElementById("modal").style.display = "none";
   });
 
}

function fecharDetalhes(event, index) {
    event.stopPropagation(); //evita conflitos com clique na tela
    const detalhes = document.getElementById(`detalhes-${index}`);
    if (detalhes) detalhes.style.display = "none"; 
}

window.addEventListener("click", (event) => {
    const modal = document.getElementById("modal");
    const conteudo = document.getElementById("modal-conteudo");
    if (event.target === modal) {
        modal.style.display = "none";
    }
})


//chama mostrarEStoque assim que o script carregar
window.onload= () =>{
    mostrarEstoque();
}