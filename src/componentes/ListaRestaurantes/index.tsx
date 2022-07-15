import { Button, TextField } from '@mui/material';
import { AxiosRequestConfig } from 'axios';
import { FormEvent, useEffect, useState } from 'react';
import { httpHome } from '../../http';
import { IPaginacao } from '../../interfaces/IPaginacao';
import IRestaurante from '../../interfaces/IRestaurante';
import style from './ListaRestaurantes.module.scss';
import Restaurante from './Restaurante';

interface IParametrosBusca {
  ordering?: string;
  search?: string;
}

const ListaRestaurantes = () => {
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [proximaPagina, setProximaPagina] = useState('');
  const [paginaAnterior, setPaginaAnterior] = useState('');

  const [buscaRestaurante, setBuscaRestaurante] = useState('');
  const [buscaOrdenacao, setBuscaOrdenacao] = useState('');

  const carregarDados = (url: string, opcoes: AxiosRequestConfig = {}) => {
    httpHome
      .get<IPaginacao<IRestaurante>>(url, opcoes)
      .then((resposta) => {
        setRestaurantes(resposta.data.results);
        setProximaPagina(resposta.data.next);
        setPaginaAnterior(resposta.data.previous);
      })
      .catch((error) => console.log(error));
  };

  function buscar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const opcoes = {
      params: {} as IParametrosBusca,
    };

    if (buscaRestaurante) {
      opcoes.params.search = buscaRestaurante;
    }

    if (buscaOrdenacao) {
      opcoes.params.ordering = buscaOrdenacao;
    }

    carregarDados('restaurantes/', opcoes);
  }

  useEffect(() => {
    // obter restaurantes
    carregarDados('restaurantes/');
  }, []);

  // FUNÇÃO PARA ADICIONAR MAIS ITENS NA LISTA DE RESTAURANTES
  // const verMais = () => {
  //   axios
  //     .get<IPaginacao<IRestaurante>>(proximaPagina)
  //     .then((response) => {
  //       setRestaurantes([...restaurantes, ...response.data.results]);
  //       setProximaPagina(response.data.next);
  //     })
  //     .catch((erro) => {
  //       console.log(erro);
  //     });
  // };

  return (
    <section className={style.ListaRestaurantes}>
      <h1>
        Os restaurantes mais <em>bacanas</em>!
      </h1>
      <form onSubmit={buscar}>
        <TextField
          type="text"
          value={buscaRestaurante}
          onChange={(evento) => setBuscaRestaurante(evento.target.value)}
          label="Nome do Restaurante"
          variant="standard"
        />
        <div>
          <label htmlFor="select-ordenacao">Ordenação</label>
          <select
            name="select-ordenacao"
            id="select-ordenacao"
            value={buscaOrdenacao}
            onChange={(evento) => setBuscaOrdenacao(evento.target.value)}
          >
            <option value="">Padrão</option>
            <option value="id">Por ID</option>
            <option value="nome">Por Nome</option>
          </select>
        </div>
        <Button type="submit" variant="outlined">
          Buscar
        </Button>
      </form>
      {restaurantes.map((item) => (
        <Restaurante restaurante={item} key={item.id} />
      ))}
      {
        <button
          onClick={() => carregarDados(paginaAnterior)}
          disabled={!paginaAnterior}
        >
          Página Anterior
        </button>
      }
      {
        <button
          onClick={() => carregarDados(proximaPagina)}
          disabled={!proximaPagina}
        >
          Próxima página
        </button>
      }
    </section>
  );
};

export default ListaRestaurantes;
