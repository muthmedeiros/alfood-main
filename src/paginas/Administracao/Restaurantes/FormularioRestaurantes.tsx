import { Box, Button, TextField, Typography } from '@mui/material';
import { Method } from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { httpAdmin } from '../../../http';
import IRestaurante from '../../../interfaces/IRestaurante';

const FormularioRestaurantes = () => {
  const parametros = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (parametros.id) {
      httpAdmin
        .get<IRestaurante>(`restaurantes/${parametros.id}/`)
        .then((resposta) => setNome(resposta.data.nome));
    }
  }, [parametros]);

  const [nome, setNome] = useState('');

  const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    let url = '/v2/restaurantes/';
    let method: Method = 'POST';

    if (parametros.id) {
      method = 'PUT';
      url += `${parametros.id}/`;
    }

    httpAdmin
      .request({
        url,
        method,
        data: {
          nome,
        },
      })
      .then(() => {
        navigate('/restaurantes');
      });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexGrow: 1,
      }}
    >
      <Typography component="h1" variant="h6">
        Formulário de Restaurantes
      </Typography>
      <Box component="form" sx={{ width: '100%' }} onSubmit={aoSubmeterForm}>
        <TextField
          fullWidth
          value={nome}
          onChange={(evento) => setNome(evento.target.value)}
          label="Nome do Restaurante"
          variant="standard"
          required
        />
        <Button
          sx={{ marginTop: 1 }}
          type="submit"
          variant="outlined"
          fullWidth
        >
          Salvar
        </Button>
      </Box>
    </Box>
  );
};

export default FormularioRestaurantes;
