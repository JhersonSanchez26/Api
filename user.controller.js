const Users = require('./User')
const user = {

    getId: async(req, res) => {
        const { id } = req.params;
        const user = await Users.findOne({ _id: id });
        res.status(200).send(user)
    },

    get: async(req, res) => {
        const users = await Users.find();
        res.status(200).send(users)
    },

    create: async(req, res) => {
        console.log(req.body);
        const user = new Users(req.body);
        const saveUser = await user.save();

        res.status(201).send(saveUser._id);
    },

    update: async(req, res) => {
        const { id } = req.params;
        const user = await Users.findOne({ _id: id });
        Object.assign(user, req.body);
        await user.save();
        console.log(req.params);
        res.sendStatus(204);
    },

    destroy: async(req, res) => {
        const { id } = req.params;
        const user = await Users.findOne({ _id: id });
        if (user) {
            await user.deleteOne();
        } else { console.log('No hay registros para eliminar'); }
        res.sendStatus(204);
    },

    listen: async() => {

        console.log('Arrancando la aplicación');
    }

}

module.exports = user;