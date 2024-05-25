document.addEventListener("DOMContentLoaded", function() {

    var btnAddCarrinho = document.querySelectorAll(".btnAddCarrinho");

    var btnConfirmar = document.querySelector("#btnConfirmarPedido");

    btnConfirmar.addEventListener("click", gravarPedido);

    let carrinho = [];

    if(localStorage.getItem("carrinho") != null) {
        carrinho = JSON.parse(localStorage.getItem("carrinho"));

        document.getElementById("contadorCarrinho").innerText = carrinho.length;
    }

    for(let i = 0; i < btnAddCarrinho.length; i++) {
        btnAddCarrinho[i].addEventListener("click", adicionarAoCarrinho);
    }

    var modalCarrinho = document.getElementById('modalCarrinho')
    modalCarrinho.addEventListener('show.bs.modal', function (event) {
        carregarCarrinho();
    })

    function gravarPedido() {

        let listaCarrinho = JSON.parse(localStorage.getItem("carrinho"));
        if(listaCarrinho.length > 0) {

            fetch("/pedido/gravar", {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(listaCarrinho)
            })
            .then(r=> {
                return r.json();
            })
            .then(r=> {
                console.log(r);
            })

        }
        else{
            alert("O carrinho está vazio!");
        }
    }

    function remover() {
        let produto = this.dataset.produto;
        let listaCarrinho = JSON.parse(localStorage.getItem("carrinho"));

        listaCarrinho = listaCarrinho.filter(x=> x.produtoId != produto);

        localStorage.setItem("carrinho", JSON.stringify(listaCarrinho));

        carregarCarrinho();
    }

    function iniciarEventos() {

        let inputQtde = document.querySelectorAll(".inputQtde");

        let btnIncrementar = document.querySelectorAll(".incrementar");

        let btnDecrementar = document.querySelectorAll(".decrementar");

        let btnRemover = document.querySelectorAll(".remover");

        for(let i = 0; i < inputQtde.length; i++) {
            inputQtde[i].addEventListener("change", alterarValor);
            btnIncrementar[i].addEventListener("click", incrementar);
            btnDecrementar[i].addEventListener("click", decrementar);
            btnRemover[i].addEventListener("click", remover);
        }

    }

    function incrementar() {
        let produto = this.dataset.produto;
        let valor = document.querySelector(`input[data-produto='${produto}']`).value;
        valor++;
        if(valor > 0 && valor < 999) {

            let listaCarrinho = JSON.parse(localStorage.getItem("carrinho"));
    
            for(let i = 0; i<listaCarrinho.length; i++) {
                if(produto == listaCarrinho[i].produtoId) {
                    listaCarrinho[i].quantidade = valor;
                }
            }
    
            localStorage.setItem("carrinho", JSON.stringify(listaCarrinho));
    
            carregarCarrinho();
        }
        else {
            alert("Valor incorreto, selecione entre 0 e 999");
        }
    }

    function decrementar() {
        let produto = this.dataset.produto;
        let valor = document.querySelector(`input[data-produto='${produto}']`).value;
        valor--;
        if(valor > 0 && valor < 999) {

            let listaCarrinho = JSON.parse(localStorage.getItem("carrinho"));
    
            for(let i = 0; i<listaCarrinho.length; i++) {
                if(produto == listaCarrinho[i].produtoId) {
                    listaCarrinho[i].quantidade = valor;
                }
            }
    
            localStorage.setItem("carrinho", JSON.stringify(listaCarrinho));
    
            carregarCarrinho();
        }
        else {
            alert("Valor incorreto, selecione entre 0 e 999");
        }
    }

    function alterarValor() {


        let valor = this.value;
        if(valor > 0 && valor < 999) {
            let produto = this.dataset.produto;

            let listaCarrinho = JSON.parse(localStorage.getItem("carrinho"));
    
            for(let i = 0; i<listaCarrinho.length; i++) {
                if(produto == listaCarrinho[i].produtoId) {
                    listaCarrinho[i].quantidade = valor;
                }
            }
    
            localStorage.setItem("carrinho", JSON.stringify(listaCarrinho));
    
            carregarCarrinho();
        }
        else{
            alert("Valor incorreto, selecione entre 0 e 999");
        }

    }

    function carregarCarrinho() {

        let html = "";

        let carrinhoModal = JSON.parse(localStorage.getItem("carrinho"));
        let valorTotalCarrinho = 0;
        if(carrinhoModal.length > 0) {
            for(let i = 0; i<carrinhoModal.length; i++) {

                let valorTotalItem = carrinhoModal[i].produtoValor * carrinhoModal[i].quantidade;
                valorTotalCarrinho += valorTotalItem;
                html += `<tr>
                            <td>${carrinhoModal[i].produtoId}</td>                       
                            <td><img width="100" src="${carrinhoModal[i].produtoImagem}" /></td>
                            <td>${carrinhoModal[i].produtoNome}</td>
                            <td>R$${carrinhoModal[i].produtoValor}</td>
                            <td>
                                <div style="display:flex;">
                                    <button class="btn btn-default incrementar" data-produto="${carrinhoModal[i].produtoId}" >+</button>
                                    <input style="width:100px;" type="number" class="form-control inputQtde" data-produto="${carrinhoModal[i].produtoId}" value="${carrinhoModal[i].quantidade}" />
                                    <button class="btn btn-default decrementar" data-produto="${carrinhoModal[i].produtoId}">-</button>
                                </div>
                            </td>
                            <td>R$${valorTotalItem}</td>
                            <td>
                                <button class="btn btn-danger remover" data-produto="${carrinhoModal[i].produtoId}"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>`;
            }
            
            document.querySelector("#tabelaCarrinho > tbody").innerHTML = html;

            if(valorTotalCarrinho > 0) {
                document.querySelector("#valorTotal").innerHTML = `<h2>Valor total do pedido: R$ ${valorTotalCarrinho}</h2>`
            }
            document.querySelector("#msgCarrinhoVazio").style["display"] = "none";
            document.querySelector("#tabelaCarrinho").style["display"] = "inline-table";
            document.querySelector("#valorTotal").style["display"] = "block";
            
            iniciarEventos();
        }
        else{
            document.querySelector("#msgCarrinhoVazio").style["display"] = "block";
            document.querySelector("#tabelaCarrinho").style["display"] = "none";
            document.querySelector("#valorTotal").style["display"] = "none";
        }

    }

    function adicionarItemCarrinho(item) {
        let lista = localStorage.getItem("carrinho");

        if(lista != null) {
            carrinho = JSON.parse(lista);
            let achou = false;
            for(let i = 0; i < carrinho.length; i++){
                if(carrinho[i].produtoId == item.produtoId) {
                    carrinho[i].quantidade++;
                    achou = true;
                }
            }

            if(achou == false) {
                item.quantidade = 1;
                carrinho.push(item);
            }

            localStorage.setItem("carrinho", JSON.stringify(carrinho));
        }
        else{
            item.quantidade = 1;
            carrinho.push(item);
            localStorage.setItem("carrinho", JSON.stringify(carrinho));
        }

        //incrementar contador com a nova lista;
        carrinho = JSON.parse(localStorage.getItem("carrinho"));
        document.getElementById("contadorCarrinho").innerText = carrinho.length;
    }

    function adicionarAoCarrinho() {
        let id = this.dataset.produtoid;
        console.log(id);

        fetch("/produto/obter/" + id)
        .then(r=> {
            return r.json();
        })
        .then(r=> {
            if(r.produtoEncontrado != null) {
                adicionarItemCarrinho(r.produtoEncontrado);

                this.innerHTML = "<i class='fas fa-check'></i> Produto adicionado!";
                
                let that = this;
                setTimeout(function() {
                    that.innerHTML = `<i class="bi-cart-fill me-1"></i> Adicionar ao carrinho`;
                }, 5000);
            }
        })
    }

})