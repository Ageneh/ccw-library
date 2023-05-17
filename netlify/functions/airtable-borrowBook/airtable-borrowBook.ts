import { Handler } from '@netlify/functions'
import AirtableMiddleware from '@/airtableMiddleware';

export const handler: Handler = async (event, context) => {
  const queryStringParameters = event.queryStringParameters as {
    book_id: string,
    username: string,
    book_ref: string,
  }
  const airtableMiddleware = new AirtableMiddleware();
  return {
    statusCode: 200,
    data: await airtableMiddleware.borrowBook(queryStringParameters.book_id, queryStringParameters.username, queryStringParameters.book_ref),
  }
}
