--drop database if exists latinoteca;
--create database latinoteca;
--\c latinoteca


--tabelas
create table autor(
    id serial primary key,
    nome varchar(200) not null,
    nacionalidade varchar(200) not null,
    sobre text not null
);

create table genero(
    id serial primary key,
    nome varchar(200) not null
);

create table editora(
    id serial primary key,
    nome varchar(200) not null
);

create table livro(
    isbn char(13) primary key,
    titulo varchar(200) not null,
    descricao text not null,
    ano int not null,
    editora int not null references editora(id)
);

create table autor_livro(
    autor int not null references autor(id),
    livro char(13) not null references livro(isbn),
    primary key (autor, livro)
);

create table genero_livro(
    genero int not null references genero(id),
    livro char(13) not null references livro(isbn),
    primary key (genero, livro)
);

create table usuario(
    cpf char(11) primary key,
    nome varchar(200) not null,
    nascimento date not null check (nascimento < current_date),
    genero char(1) not null default 'N' check (genero in ('N', 'M', 'F'))
);

create table exemplar(
    codigo serial primary key,
    livro char(13) not null references livro(isbn)
);

create table emprestimo(
    codigo serial primary key,
    data_emprestimo date not null default(current_date) check (data_emprestimo <= current_date),
    data_devolucao date not null check (data_emprestimo < data_devolucao),
    exemplar int not null references exemplar(codigo),
    cpf_usuario char(11) not null references usuario(cpf)
);
