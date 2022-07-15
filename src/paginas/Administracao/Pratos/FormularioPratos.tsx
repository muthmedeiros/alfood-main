import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { httpAdmin } from '../../../http';
import IPrato from '../../../interfaces/IPrato';
import IRestaurante from '../../../interfaces/IRestaurante';
import ITag from '../../../interfaces/ITag';

const FormularioPratos = () => {
  const parametros = useParams();
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tag, setTag] = useState('');
  const [restaurante, setRestaurante] = useState('');
  const [imagem, setImagem] = useState<File | null>(null);

  const [tags, setTags] = useState<ITag[]>([]);
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);

  useEffect(() => {
    httpAdmin
      .get<{ tags: ITag[] }>('tags/')
      .then((resposta) => setTags(resposta.data.tags));

    httpAdmin
      .get<IRestaurante[]>('restaurantes/')
      .then((resposta) => setRestaurantes(resposta.data));

    if (parametros.id) {
      httpAdmin.get<IPrato>(`pratos/${parametros.id}/`).then((resposta) => {
        setNome(resposta.data.nome);
        setDescricao(resposta.data.descricao);
        setTag(resposta.data.tag);

        getRestaurante(resposta.data.restaurante);
        
        // TODO: create function to convert URL to File
        // setImagem(resposta.data.imagem);
      });
    }
  }, [parametros]);

  const getRestaurante = async (restauranteId: number) => {
    const restaurante = await httpAdmin.get<IRestaurante>(
      `restaurantes/${restauranteId}/`
    );

    setRestaurante(String(restaurante.data.id));
  };

  const selecionarArquivo = (evento: React.ChangeEvent<HTMLInputElement>) => {
    if (evento.target.files?.length) {
      setImagem(evento.target.files[0]);
    } else {
      setImagem(null);
    }
  };

  const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    let url = 'pratos/';
    let method = 'POST';

    if (parametros.id) {
      method = 'PUT';
      url += `${parametros.id}/`;
    }

    const formData = new FormData();

    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('tag', tag);
    formData.append('restaurante', restaurante);

    if (imagem) {
      formData.append('imagem', imagem);
    }

    httpAdmin
      .request({
        url,
        method,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          formData,
        },
      })
      .then((_) => {
        setNome('');
        setDescricao('');
        setTag('');
        setRestaurante('');
        setImagem(null);

        alert('Prato cadastrado com sucesso!');

        navigate('/admin/pratos');
      })
      .catch((error) => console.log(error));
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
        Formulário de Pratos
      </Typography>
      <Box component="form" sx={{ width: '100%' }} onSubmit={aoSubmeterForm}>
        <TextField
          fullWidth
          value={nome}
          onChange={(evento) => setNome(evento.target.value)}
          label="Nome do Prato"
          variant="standard"
          required
          margin="dense"
        />
        <TextField
          fullWidth
          value={descricao}
          onChange={(evento) => setDescricao(evento.target.value)}
          label="Descrição do Prato"
          variant="standard"
          required
          margin="dense"
        />
        <FormControl margin="dense" fullWidth>
          <InputLabel id="select-tag">Tag</InputLabel>
          <Select
            labelId="select-tag"
            value={tag}
            onChange={(evento) => setTag(evento.target.value)}
          >
            {tags.map((tag) => (
              <MenuItem key={tag.id} value={tag.value}>
                {tag.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl margin="dense" fullWidth>
          <InputLabel id="select-restaurante">Restaurantes</InputLabel>
          <Select
            labelId="select-restaurante"
            value={restaurante}
            onChange={(evento) => setRestaurante(evento.target.value)}
          >
            {restaurantes.map((restaurante) => (
              <MenuItem key={restaurante.id} value={restaurante.id}>
                {restaurante.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <input type="file" onChange={selecionarArquivo} />

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

export default FormularioPratos;
