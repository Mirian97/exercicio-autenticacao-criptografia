const express = require("express");
const verificarUsuarioLogado = require("./intermediarios/autenticação");
const {
    cadastrarPokemon,
    alterarApelidoPokemon,
    listarPokemons,
    listarUmPokemon,
    excluirPokemon
} = require("./controladores/pokemons");
const {
    cadastrarUsuario,
    validarLogin,
    obterPerfil
} = require("./controladores/usuarios");

const rotas = express();

rotas.post("/usuario", cadastrarUsuario);
rotas.post("/login", validarLogin);

rotas.use(verificarUsuarioLogado);

rotas.get("/perfil", obterPerfil);

rotas.post("/pokemon", cadastrarPokemon);
rotas.patch("/pokemon/:idPokemon", alterarApelidoPokemon);
rotas.get("/pokemon", listarPokemons);
rotas.get("/pokemon/:idPokemon", listarUmPokemon);
rotas.delete("/pokemon/:idPokemon", excluirPokemon);

module.exports = rotas;