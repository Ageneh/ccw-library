import { Handler } from '@netlify/functions'
import AirtableMiddleware from '@/airtableMiddleware';

export const handler: Handler = async (event, context) => {
  const airtableMiddleware = new AirtableMiddleware();
  return {
    statusCode: 200,
    data: await airtableMiddleware.getAllBooks(),
  }
}
