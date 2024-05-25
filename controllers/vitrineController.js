const ProdutoModel = require("../models/produtoModel");


class VitrineController {

    async vitrineView(req, res) {
        let produto = new ProdutoModel();
        let listaProdutos = await produto.listarProdutos();

        res.render('vitrine/index', { layout: 'vitrine/index', produtos: listaProdutos });
    }

}

module.exports = VitrineController;