import { Button, TextField } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';

const FormularioRestaurantes = () => {
  const [nomeRestaurante, setNomeRestaurante] = useState('');

  const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    axios
      .post('http://localhost:8000/api/v2/restaurantes/', {
        nome: nomeRestaurante,
      })
      .then(() => alert('Restaurante cadastrado com sucesso!'))
      .catch(() => alert('Falha ao cadastrar restaurante!'));
  };

  return (
    <form
      onSubmit={(evento) => {
        aoSubmeterForm(evento);
      }}
    >
      <TextField
        value={nomeRestaurante}
        onChange={(evento) => setNomeRestaurante(evento.target.value)}
        label="Nome do Restaurante"
        variant="standard"
      />
      <Button type="submit" variant="outlined">
        Salvar
      </Button>
    </form>
  );
};

export default FormularioRestaurantes;