import axios from 'axios'

import { API_HOST } from '../utils/constants'
import { getTokenApi } from './auth'

export const getStatementsBySocio = async (ficha) => {
  const token = getTokenApi()

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  return axios.get(`${API_HOST}/statements/socio/${ficha}`, { headers })
}

export const getStatementsByRazon = async (razon) => {
  const token = getTokenApi()

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  return axios.get(`${API_HOST}/statements/razon?tipo=${razon}`, { headers })
}

// Download a file from the server
export const downloadPDF = async (ficha) => {
  const token = getTokenApi()

  const headers = {
    'Content-Type': 'application/pdf',
    Authorization: `Bearer ${token}`,
    responseType: 'blob',
  }

  return axios.get(`${API_HOST}/statements/pdf/${ficha}`, { headers })
}

export const sendEmail = async (ficha) => {
  const token = getTokenApi()

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  return axios.get(`${API_HOST}/statements/email/${ficha}`, { headers })
}

export const urlDownloadPDF = (ficha) =>
  `${API_HOST}/statements/pdf/${ficha}?q=${btoa(getTokenApi())}`
