const Database = require("../db/database");

const banco = new Database();

class PedidoItemModel {

    #pedidodoItemId;
    #pedidoId;
    #produtoId;
    #pedidoItemQuantidade;
    #pedidoItemValor;
    #pedidoItemValorTotal;
    #pedidoData;
    #produtoNome;

    get produtoNome(){
        return this.#produtoNome;
    }

    set produtooNome(produtooNome){
        this.#produtoNome = produtoNome;
    }

    get pedidoData(){
        return this.#pedidoData;
    }

    set pedidoData(pedidoData){
        this.#pedidoData = pedidoData;
    }

    get pedidoItemId() {
        return this.#pedidodoItemId;
    }
    set pedidoItemId(pedidoItemId) {
        this.#pedidodoItemId = pedidoItemId;
    }

    get pedidoId() {
        return this.#pedidoId;
    }
    set pedidoId(pedidoId) {
        this.#pedidoId = pedidoId;
    }

    get produtoId() {
        return this.#produtoId;
    }
    set produtoId(produtoId) {
        this.#produtoId = produtoId;
    }

    get pedidoItemQuantidade() {
        return this.#pedidoItemQuantidade;
    }
    set pedidoItemQuantidade(pedidoItemQuantidade) {
        this.#pedidoItemQuantidade = pedidoItemQuantidade;
    }

    get pedidoItemValor() {
        return this.#pedidoItemValor;
    }
    set pedidoItemValor(pedidoItemValor) {
        this.#pedidoItemValor = pedidoItemValor;
    }

    get pedidoItemValorTotal() {
        return this.#pedidoItemValorTotal;
    }
    set pedidoItemValorTotal(pedidoItemValorTotal) {
        this.#pedidoItemValorTotal = pedidoItemValorTotal;
    }

    constructor(pedidodoItemId, pedidoId, produtoId, pedidoItemQuantidade, pedidoItemValor, pedidoItemValorTotal, pedidoData, produtoNome) {
        this.#pedidodoItemId = pedidodoItemId;
        this.#pedidoId = pedidoId;
        this.#produtoId = produtoId;
        this.#pedidoItemQuantidade = pedidoItemQuantidade;
        this.#pedidoItemValor = pedidoItemValor;
        this.#pedidoItemValorTotal = pedidoItemValorTotal;
        this.#pedidoData = pedidoData;
        this.#produtoNome = produtoNome;
    }

    async listarPedidos(termo, filtro){

        let sqlFiltro = "";
        if(termo != ""){
            if(filtro == "1") {
                termo = "%"+ termo + "%";
                sqlFiltro = ` where prd_nome like ?`
            }
            else if(filtro == "2") {
                sqlFiltro = ` where p.ped_id = ?`;
            }
        }

        let sql = `select * from tb_pedidoAula p 
                    inner join tb_pedidoitens i on p.ped_id = i.ped_id
                    inner join tb_produto pr on i.prd_id = pr.prd_id
                    ${sqlFiltro}`;
        let valores = [];
        if (sqlFiltro != ""){
            valores.push(termo);
        }

        let rows = await banco.ExecutaComando(sql, valores);

        let lista = [];

        for(let i = 0; i<rows.length; i++){
            let row = rows[i];

            lista.push(new PedidoItemModel(row["pit_id"], row["ped_id"], row["prd_id"], row["pit_quantidade"], row["pit_valorunidade"], row["pit_valortotal"], row["ped_data"], row["prd_nome"]));
        }

        return lista;
    }

    async listar() {
        let sql = "select * from tb_pedidoitens";

        let valores = [];

        let rows = await banco.ExecutaComando(sql, valores);

        let listaItens = [];

        for(let i = 0; i< rows.length; i++) {
            let row = rows[i];
            listaItens.push(new PedidoItemModel(row["pit_id"], row["ped_id"], row["prd_id"], row["pit_quantidade"], row["pit_valorunidade"], row["pit_valortotal"]));
        }

        return listaItens;
    }

    async gravar() {
        let sql = "insert into tb_pedidoitens (ped_id, prd_id, pit_quantidade, pit_valorunidade, pit_valortotal) values (?, ?, ?, ?, ?)";

        let valores = [this.#pedidoId, this.#produtoId, this.#pedidoItemQuantidade, this.#pedidoItemValor, this.#pedidoItemValorTotal];

        let result = await banco.ExecutaComandoNonQuery(sql, valores);

        return result;
    }

    toJSON(){
        return {
            "pedidoId": this.#pedidoId,
            "produtoId": this.#produtoId,
            "pedidoData": this.#pedidoData,
            "pedidoItemQuantidade": this.#pedidoItemQuantidade,
            "pedidoItemValor": this.#pedidoItemValor,
            "produtoNome": this.#produtoNome,
            "pedidoValorTotal": this.#pedidoItemValorTotal,           
        }
    }
}

module.exports = PedidoItemModel;