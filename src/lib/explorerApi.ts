const {customAxios} = require('./api')

export async function getExplorers(
    offset: number,
    pageLimit: number,
    country: string
  ) {
    try {
      const res = await customAxios.get(`/apps?offset=${offset}&limit=${pageLimit}` +
          (country ? `&search=${country}` : '')
      );
      return res.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }