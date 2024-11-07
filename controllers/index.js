const { fn, col } = require('sequelize');
const { User, Tag, Post } = require('../models')
const bcrypt = require('bcrypt');

exports.home = async (req, res) => {    
    try {
        if(req.session.user.role == "netizen"){
            const data = await Post.findAll({
                attributes: ['id', 'title', 'content', 'imgUrl'],
                include: [{
                    model: Tag,
                    attributes: ['name']
                },{
                    model: User,
                    attributes: ['id', 'username', 'role'],
                }],
                order: [['createdAt', 'desc']]
            })
            const uuid = req.session.user.id
            // res.send(data)
            res.render('home', {data, uuid})
        }

        const count = await Post.findAll({
            include: {
                model: Tag,
                attributes: ['name']
            },
            attributes: [
                [fn("count", col("Post.TagId")), "totalPost"],
            ],
            group: ["Tag.id"],
        })

        let labels = [];
        let data = [];

        for (const item of count) {
            data.push(item.dataValues.totalPost);
            labels.push(item.Tag.name);
        }

        // res.send(data)
        res.render('admin', {labels, data})
    } catch (error) {
        res.send(error.message)
    }
}

exports.login = async (req, res) => {
    const {notification} = req.query
    try {
        res.render('login', {notification})
    } catch (error) {
        res.send(error.message)
    }
}

exports.actionLogin = async (req, res) => {
    try {
        const data = await User.findOne({
            where: {
                email: req.body.email
            }
        })

        if(data){
            const checkPassword = await bcrypt.compare(req.body.password, data.password)
            if(checkPassword){
                req.session.user = data
                req.session.loggedIn = true
                return res.redirect('/')
            }else{
                return res.redirect('/login?notification=Email dan password salah 😱😱')
            }
        }
        return res.redirect('/login?notification=Anda tidak terdaftar 🤧🤧')
    } catch (error) {
        res.send(error.message)
    }
}

exports.actionLogout = async (req, res) => {
    try {
        req.session.destroy(function(err) {
            if (err) next(err)
            res.redirect('login')
        })
    } catch (error) {
        res.send(error.message)
    }
}

exports.formPost = async (req, res) => {
    try {
        const data = await Tag.findAll()
        res.render('formPost', {data})
    } catch (error) {
        res.send(error.message)
    }
}

exports.createPost = async (req, res) => {
    if(req.file){
        req.body.imgUrl = 'uploads/' + req.file.filename
    }

    try {
        req.body.UserId = req.session.user.id
        await Post.create(req.body)
        res.redirect('/')
    } catch (error) {
        res.send(error.message)
    }
}

exports.editPost = async (req, res) => {
    try {
        const data = await Post.findOne({
            where: {id: req.params.id},
            include: Tag
        })
        const tag = await Tag.findAll()

        res.render('formEdit', {data, tag})
    } catch (error) {
        res.send(error.message)
    }
}

exports.updatePost = async (req, res) => {
    console.log(req.params, req.session.user, req.body);
    if(req.file){
        req.body.imgUrl = 'uploads/' + req.file.filename
    }

    try {
        req.body.UserId = req.session.user.id
        await Post.update(req.body, {
            where: {
                id:  req.params.id
            }
        })
        res.redirect('/')
    } catch (error) {
        res.send(error.message)
    }
}

exports.deletePost = async (req, res) => {
    try {
        await Post.destroy({
            where: {id: req.params.id}
        })
        res.redirect('/')
    } catch (error) {
        res.send(error.message)
    }
}