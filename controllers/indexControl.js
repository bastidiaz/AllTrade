const indexControl = {
    async showHome(req, res){
        res.render('index');
    },

    async showServices(req,res){
        res.render("services");
    },

    async showCore(req,res){
        res.render("core");
    }
}

module.exports = indexControl;