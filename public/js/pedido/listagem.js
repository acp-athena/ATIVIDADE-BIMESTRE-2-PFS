document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("btnExportarExcel").addEventListener('click', exportarExcel);

    let itemFiltro = document.querySelectorAll(".itemFiltro");

    let filtroEscolhido = 0;

    document.getElementById("btnFiltrar").addEventListener('click', buscar);

    for(let i = 0; i<itemFiltro.length; i++){
        itemFiltro[i].addEventListener("click", mudarCriterioFiltragem);
    }

    function exportarExcel(){
        var wb = XLSX.utils.table_to_book(document.getElementById("tabelaPedidos"));
        /* Export to file (start a download) */
        XLSX.writeFile(wb, "tabela_pedidos.xlsx");
    }

    function mudarCriterioFiltragem(){
        let nome = this.dataset.nome;
        document.getElementById("btnEscolherFiltro").innerText = nome;
        filtroEscolhido = this.dataset.valor;
    }

    function buscar(){
        let termoFiltro = document.getElementById("filtro").value;

        if(termoFiltro == ""){
            termoFiltro = "todos";
        }

        fetch(`/pedido/filtrar/${termoFiltro}/${filtroEscolhido}`)
        .then(r=>{
            return r.json();
        })
        .then(r=>{
            console.log(r);
            if(r.length > 0){
                let htmlCorpo = "";
                for(let i =0; i<r.length; i++){
                    htmlCorpo += `
                        <tr>
                            <td>${r[i].pedidoId}</td>
                            <td>${new Date(r[i].pedidoData).toLocaleString()}</td>
                            <td>${r[i].produtoNome}</td>
                            <td>${r[i].pedidoItemValor}</td>
                            <td>${r[i].pedidoItemQuantidade}</td>
                            <td>${r[i].pedidoValorTotal}</td>
                        </tr>
                    `;
                }
                document.querySelector("#tabelaPedidos > tbody").innerHTML = htmlCorpo;
            }
        })
    }

})