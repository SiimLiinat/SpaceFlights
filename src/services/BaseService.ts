import { IFetchResponse } from '@/types/IFetchResponse'
import axios from 'axios'

const apiEndpoint = 'https://cosmos-odyssey.azurewebsites.net/api/'

export class BaseService<TEntity> {
  private authHeaders = {
    'Content-Type': 'application/json'
  };

  async get (url: string): Promise<IFetchResponse<TEntity>> {
    const apiEndpointUrl = apiEndpoint + url
    try {
      const response = await axios.get(apiEndpointUrl, {
        headers: this.authHeaders,
        withCredentials: false
      })
      if (response.status >= 200 && response.status < 300) {
        return {
          ok: true,
          statusCode: response.status,
          data: response.data as TEntity
        }
      }
      return {
        ok: false,
        statusCode: response.status,
        errorMessage: response.statusText
      }
    } catch (reason) {
      return {
        ok: false,
        statusCode: 0,
        errorMessage: reason
      }
    }
  }
}
