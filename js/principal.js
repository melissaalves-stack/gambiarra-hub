// =============================================
// GAMBIARRA HUB — principal.js
// Lógica do Carrinho e Busca Geral
// =============================================

const produtosDB = {
    'O IF Infinito™': 42.00,
    'CSS Força Bruta™': 69.00,
    'JavaScript Fantasma™': 13.37
};

let carrinho = JSON.parse(localStorage.getItem('gambiarra_cart')) || [];

// === 1. Lógica do Carrinho ===
function atualizarCarrinho() {
    const badgeNum = document.getElementById('badge-carrinho');
    const listaItens = document.getElementById('carrinho-itens-lista');
    const totalValor = document.getElementById('carrinho-total-valor');

    if(!badgeNum || !listaItens) return;
    
    badgeNum.textContent = carrinho.length;
    listaItens.innerHTML = '';
    
    if (carrinho.length === 0) {
        listaItens.innerHTML = `<p style="font-family:'Space Mono', monospace; color:#5a5a6e; font-size:0.8rem; text-align:center; margin-top:40px;">CARRINHO_VAZIO</p>`;
        totalValor.textContent = 'R$ 0,00';
        return;
    }

    let total = 0;
    carrinho.forEach((item) => {
        total += item.preco;
        listaItens.innerHTML += `
            <div class="carrinho-item">
                <span class="carrinho-item-nome">${item.nome}</span>
                <span class="carrinho-item-preco">R$ ${item.preco.toFixed(2)}</span>
            </div>`;
    });
    totalValor.textContent = `R$ ${total.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const badgeCarrinho = document.querySelector('.badge-carrinho');
    const modal = document.getElementById('modal-carrinho');
    const btnFechar = document.getElementById('fechar-carrinho');
    const btnPagar = document.getElementById('btn-pagar-fake');

    if(badgeCarrinho && modal) {
        badgeCarrinho.addEventListener('click', () => modal.classList.add('aberto'));
        btnFechar.addEventListener('click', () => modal.classList.remove('aberto'));
    }

    // "Excluir" produto do carrinho — só na teoria. Na prática, ninguém sai daqui sem pagar.
    const listaItens = document.getElementById('carrinho-itens-lista');
    if (listaItens) {
        listaItens.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-excluir-item');
            if (!btn) return;
            e.preventDefault();
            alert('Não é possível remover este item. Finalize a compra para continuar.');
        });
    }
    
    document.querySelectorAll('.btn-adicionar-carrinho').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const nomeProduto = btn.getAttribute('data-nome');
            const preco = produtosDB[nomeProduto] || 99.99;
            carrinho.push({ nome: nomeProduto, preco: preco });
            localStorage.setItem('gambiarra_cart', JSON.stringify(carrinho));
            atualizarCarrinho();
            if(modal) modal.classList.add('aberto');
        });
    });

    if(btnPagar) {
        btnPagar.addEventListener('click', () => {
            if(carrinho.length === 0) return alert('Seu carrinho está vazio.');
            alert('💳 PAGAMENTO APROVADO NO SANDBOX!\nSeus bugs foram enviados por e-mail.');
            carrinho = [];
            localStorage.removeItem('gambiarra_cart');
            modal.classList.remove('aberto');
            atualizarCarrinho();
        });
    }
    atualizarCarrinho();
});

// === 2. Busca do Index (Sua lógica original do ZIP) ===
function realizarBusca() {
  const input = document.getElementById('busca-input');
  if (!input) return;
  const termo = input.value.trim().toLowerCase();

  const resultadoDiv = document.getElementById('busca-resultado');
  const msgEl = document.getElementById('busca-msg');
  if (!resultadoDiv || !msgEl) return;

  if (!termo) {
    resultadoDiv.style.display = 'none';
    return;
  }

  const produtos = [
    { nome: 'IF Infinito', link: 'produto-if.html', tags: ['if', 'else', 'condicao'] },
    { nome: 'CSS Força Bruta', link: 'produto-css.html', tags: ['css', '!important', 'estilo'] },
    { nome: 'JavaScript Fantasma', link: 'produto-js.html', tags: ['js', 'javascript', 'script'] },
  ];

  const encontrado = produtos.find(p => p.nome.toLowerCase().includes(termo) || p.tags.some(t => t.includes(termo)));

  resultadoDiv.style.display = 'block';
  if (encontrado) {
    msgEl.innerHTML = `> Bug encontrado: <a href="${encontrado.link}" style="color:#fff; text-decoration:underline;">${encontrado.nome}</a>`;
  } else {
    msgEl.textContent = `> Erro 404: Nenhuma gambiarra com o nome "${termo}".`;
  }
}
