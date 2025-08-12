// Lista para guardar produtos
let produtos = [];

// Salvar produtos no LocalStorage
function salvarProdutos() {
    localStorage.setItem('produtos', JSON.stringify(produtos));
}

// Carregar produtos do LocalStorage
function carregarProdutos() {
    const dados = localStorage.getItem('produtos');
    if (dados) {
        produtos = JSON.parse(dados);
    }
}

// Atualiza a tabela de estoque com alerta de estoque baixo
function atualizarTabela() {
    const tbody = document.querySelector('#tabelaEstoque tbody');
    tbody.innerHTML = ''; // Limpa a tabela

    produtos.forEach(produto => {
        const tr = document.createElement('tr');

        // Verifica se está abaixo do mínimo para alerta
        const minimo = produto.minimo != null ? produto.minimo : 5; // padrão 5
        if (produto.quantidade < minimo) {
            tr.style.backgroundColor = '#f8d7da'; // vermelho claro para alerta
        } else {
            tr.style.backgroundColor = ''; // normal
        }

        tr.innerHTML = `
            <td>${produto.nome}</td>
            <td>${produto.quantidade}</td>
            <td>${produto.unidade}</td>
            <td>${minimo}</td>
        `;
        tbody.appendChild(tr);
    });

    atualizarSelectProdutos();
}

// Atualiza o select para movimentação
function atualizarSelectProdutos() {
    const select = document.getElementById('produtoSelecionado');
    select.innerHTML = ''; // Limpa opções

    produtos.forEach((produto, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = produto.nome;
        select.appendChild(option);
    });
}

// Captura formulário de cadastro
const formCadastro = document.getElementById('formCadastro');
formCadastro.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('nomeProduto').value.trim();
    const quantidade = parseInt(document.getElementById('quantidadeProduto').value);
    const unidade = document.getElementById('unidadeProduto').value.trim();
    const minimoInput = document.getElementById('minimoProduto').value.trim();
    const minimo = minimoInput ? parseInt(minimoInput) : 5;

    if (nome && !isNaN(quantidade) && unidade && !isNaN(minimo)) {
        // Verifica se o produto já existe
        const existe = produtos.find(p => p.nome.toLowerCase() === nome.toLowerCase());
        if (existe) {
            alert('Produto já cadastrado!');
        } else {
            produtos.push({ nome, quantidade, unidade, minimo });
            salvarProdutos();
            atualizarTabela();
            formCadastro.reset();
        }
    } else {
        alert('Preencha todos os campos corretamente!');
    }
});

// Captura formulário de movimentação
const formMovimentacao = document.getElementById('formMovimentacao');
formMovimentacao.addEventListener('submit', (e) => {
    e.preventDefault();

    const indexProduto = parseInt(document.getElementById('produtoSelecionado').value);
    const quantidadeMov = parseInt(document.getElementById('quantidadeMovimentacao').value);
    const tipoMov = document.getElementById('tipoMovimentacao').value;

    if (isNaN(indexProduto) || isNaN(quantidadeMov) || quantidadeMov <= 0) {
        alert('Preencha os dados corretamente.');
        return;
    }

    const produto = produtos[indexProduto];

    if (tipoMov === 'entrada') {
        produto.quantidade += quantidadeMov;
    } else if (tipoMov === 'saida') {
        if (produto.quantidade < quantidadeMov) {
            alert('Quantidade insuficiente no estoque!');
            return;
        }
        produto.quantidade -= quantidadeMov;
    }

    salvarProdutos();
    atualizarTabela();
    formMovimentacao.reset();
});

// Carrega os produtos ao iniciar
carregarProdutos();
atualizarTabela();
