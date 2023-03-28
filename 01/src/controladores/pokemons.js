const pool = require("../conexao");

const cadastrarPokemon = async (req, res) => {
    const { nome, habilidades, imagem, apelido } = req.body;
    const { id } = req.usuario;

    if (!nome) {
        return res.status(400).json({ mensagem: "Preencha o campo nome." });
    }
    if (!habilidades) {
        return res.status(400).json({ mensagem: "Preencha o campo habilidades." });
    }

    try {
        const { rows } = await pool.query(
            `insert into pokemons (usuario_id, nome, habilidades, imagem, apelido)
            values ($1, $2, $3, $4, $5) returning *`,
            [id, nome, habilidades, imagem, apelido]
        )

        return res.status(201).json(rows[0]);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const alterarApelidoPokemon = async (req, res) => {
    const { apelido } = req.body;
    const { idPokemon } = req.params;

    if (isNaN(idPokemon)) {
        return res.status(400).json({ mensagem: "O ID deve ser um número válido." })
    }

    if (!apelido) {
        return res.status(400).json({ mensagem: "Preencha o campo apelido." });
    }

    try {
        const { rowCount } = await pool.query(
            'select * from pokemons where id = $1 and usuario_id = $2',
            [idPokemon, req.usuario.id]
        )

        if (rowCount === 0) {
            return res.status(404).json({ mensagem: 'Pokemon não encontrado' })
        }

        await pool.query(
            'update pokemons set apelido = $1 where id = $2',
            [apelido, idPokemon]
        )

        return res.status(204).send()

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const listarPokemons = async (req, res) => {
    const { nome, id: usuarioId } = req.usuario;

    try {
        const { rows } = await pool.query(
            `select id, nome, apelido, habilidades, imagem from pokemons
             where usuario_id = $1`,
            [usuarioId]
        )

        const listaDePokemons = rows.map(pokemon => {
            const { id, ...restoPokemon } = pokemon;
            restoPokemon.habilidades = restoPokemon.habilidades.split(", ");

            return {
                id,
                usuario: nome,
                ...restoPokemon
            }
        })

        return res.status(200).json(listaDePokemons);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const listarUmPokemon = async (req, res) => {
    const { idPokemon } = req.params;
    const { id, nome } = req.usuario;

    if (isNaN(idPokemon)) {
        return res.status(400).json({ mensagem: "O ID deve ser um número válido." })
    }
    try {
        const { rows, rowCount } = await pool.query(
            `select * from pokemons 
            where id = $1 and usuario_id = $2`,
            [idPokemon, id]
        )

        if (rowCount === 0) {
            return res.status(404).json({ mensagem: 'Pokemon não encontrado' })
        }

        const { id, ...restoPokemon } = rows[0];

        restoPokemon.habilidades = restoPokemon.habilidades.split(", ");

        const pokemon = {
            id,
            usuario: nome,
            ...restoPokemon
        }

        return res.status(200).json(pokemon)

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const excluirPokemon = async (req, res) => {
    const { idPokemon } = req.params;

    if (isNaN(idPokemon)) {
        return res.status(400).json({ mensagem: "O ID deve ser um número válido." })
    }
    try {
        const { rowCount } = await pool.query(
            'select * from pokemons where id = $1',
            [idPokemon]
        )

        if (rowCount === 0) {
            return res.status(404).json({ mensagem: 'Pokemon não encontrado' })
        }

        await pool.query(
            'delete from pokemons where id = $1',
            [idPokemon]
        )

        return res.status(204).send()

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

module.exports = {
    cadastrarPokemon,
    alterarApelidoPokemon,
    listarPokemons,
    listarUmPokemon,
    excluirPokemon
}