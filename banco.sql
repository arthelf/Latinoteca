drop database if exists latinoteca;
create database latinoteca;
\c latinoteca


--tabelas

create table autor(
    id serial primary key,
    nome varchar(50) not null,
    nacionalidade varchar(50) not null,
    sobre varchar(50) not null
);

create table genero(
    id serial primary key,
    nome varchar(50) not null
);

create table editora(
    id serial primary key,
    nome varchar(50) not null
);

create table livro(
    isbn serial primary key,
    titulo varchar(50) not null,
    descricao text(50) not null,
    ano int not null,
    editora_livro varchar(50) not null references editora(id)
);

create table autorLivro(
    autor int references autor(id),
    livro int references livro(isbn),
    primary key (autor, livro)
);

create table generoLivro(
    genero int references genero(id),
    livro int references livro(isbn),
    primary key (genero, livro)
);

create table usuario(
    cpf char(11) primary key,
    nome varchar(50) not null,
    nascimento date not null check (nascimento < current_date),
    genero char(1) not null default 'N' check (genero in ('N', 'M', 'F '))
);

create table emprestimo(
    codigo serial primary key,
    data_emprestimo date not null default(current_date) check (data_emprestimo <= current_date),
    data_devolucao date not null check (data_emprestimo < data_devolucao),
    cpf_usuario char(11) not null references usuario(cpf)
);





