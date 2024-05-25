document.addEventListener("DOMContentLoaded", function() {

    let btns = document.querySelectorAll(".btnExclusao");

    for(let i = 0; i<btns.length; i++) {
        btns[i].addEventListener("click", excluir);
    }

    let btnExport = document.getElementById("btnExportarExcel");
    btnExport.addEventListener('click', exportarExcel);

    function exportarExcel(){
        var wb = XLSX.utils.table_to_book(document.getElementById("tableUsuario"));
        /* Export to file (start a download) */
        XLSX.writeFile(wb, "tabela_usuario.xlsx");
    }

    function excluir() {
        let id = this.dataset.codigoexclusao;

        if(id != null) {
            if(confirm("Tem certeza que deseja excluir esse usuário?")) {
                let obj = {
                    id: id
                }

                fetch('/usuarios/excluir', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(obj)
                })
                .then(r => {
                    return r.json()
                })
                .then(r=> {
                    if(r.ok) {
                        window.location.reload();
                    }
                    else{
                        alert(r.msg);
                    }

                })

            }
        }
        else{
            alert("Nenhum ID encontrado para exclusão");
        }
    }


})