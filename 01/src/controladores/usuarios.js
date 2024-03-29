const pool = require("../conexao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const senhaJwt = require("../senhaJwt");

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const emailExiste = await pool.query(
            'select * from usuarios where email = $1',
            [email]
        )

        if (emailExiste.rowCount > 0) {
            return res.status(400).json({ mensagem: 'Email já existe' })
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const { rows } = await pool.query(
            `insert into usuarios (nome, email, senha) 
            values ($1, $2, $3) returning *`,
            [nome, email, senhaCriptografada]
        )

        const { senha: _, ...usuario } = rows[0]

        return res.status(201).json(usuario)
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const validarLogin = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: "Preencha os campos senha e email." });
    }

    try {
        const usuario = await pool.query(
            "select * from usuarios where email = $1",
            [email]
        )

        if (usuario.rowCount < 1) {
            return res.status(401).json({ mensagem: 'Email ou senha inválido.' });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.rows[0].senha)

        if (!senhaCorreta) {
            return res.status(401).json({ mensagem: 'Senha inválida.' });
        }

        const token = jwt.sign({ id: usuario.rows[0].id }, senhaJwt, { expiresIn: "8h" });

        const { senha: _, ...usuarioLogado } = usuario.rows[0];

        return res.status(200).json({ usuario: usuarioLogado, token })

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const obterPerfil = async (req, res) => {
    return res.status(200).json(req.usuario);
}

module.exports = {
    cadastrarUsuario,
    validarLogin,
    obterPerfil
}