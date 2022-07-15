import axios from 'axios';

export const httpAdmin = axios.create({
  baseURL: 'http://localhost:8000/api/v2/',
});

export const httpHome = axios.create({
  baseURL: 'http://localhost:8000/api/v1/',
});
