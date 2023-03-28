-- 1 - Deverá existir um banco de dados chamado `catalogo_pokemons` com as tabelas descritas abaixo e todo código de criação das tabelas deverá se colocado no arquivo `dump.sql`

create database catalogo_pokemons;

-- a) Tabela `usuarios` com os campos:

create table if not exists usuarios(
    id serial primary key,
    nome text not null,
    email text not null unique,
    senha text not null
);

-- b) Tabela `pokemons` com os campos

create table if not exists pokemons(
    id serial primary key,
    usuario_id integer not null references usuarios(id),
    nome text not null,
    habilidades text not null,
    imagem text,
    apelido text
);

alter table pokemons drop column senha;

select * from pokemons where id = 1;
