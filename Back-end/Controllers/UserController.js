const UserModel = require('../mysql/Models/UserModel.js');
const generateToken = require('../Tokens/GenerateTokens.js');

exports.create_new_user = (req, res) => {
    var user = new UserModel(req.body);
    UserModel.registerAccount(user, function callback(error, result) {
        if (error) {
            return res.status(400).send(error);
        }
        return res.status(200).send(result);
    })
}

exports.login_user_password = async(req, res) => {
    var user = new UserModel(req.body);
    await UserModel.loginAccount(user, async function callback(error, result) {
        if (error) {
            return res.status(400).send(error);
        }
        console.log(result);
        try {
            const user = result[0];
            const { userId, userName, fullName } = user;
            const token = await generateToken(res, userId, userName, fullName);
            res.cookie("token", token[0], token[1]);
            return res.status(200).send(user);
        } catch (err) {
            return res.status(500).json(err.toString());
        }

    })
}

exports.logout = async(req, res) => {
    res.cookie("token", "", "");
    return res.status(200).send("Logout successfull.");
}

exports.edit_profile = (req, res) => {
    var user = new UserModel(req.body);
    UserModel.editProfile(req.params.id, user, function callback(error, result) {
        if (error) {
            return res.status(400).send(error);
        }
        return res.status(200).send(result);
    })
}

exports.change_password = (req, res) => {
    UserModel.changePassword(req.body, function callback(error, result) {
        if (error) {
            return res.status(400).send(error);
        }
        return res.status(200).send(result);
    })
}

exports.searchUserByName = (req, res) => {
    UserModel.searchByName(req.params.userId, req.params.search, (error, result) => {
        if (error) {
            return res.status(400).send(error);
        }
        if (result && result.length !== 0) {
            return res.status(200).send(result);
        } else {
            return res.status(404).send("Get user does not found!");
        }
    })
}