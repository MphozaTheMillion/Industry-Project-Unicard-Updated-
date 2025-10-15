import {genkit, Flow, FlowAuth} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {NextRequest} from 'next/server';

const allowCors = (fn: Flow<any, any, any>) => {
  return async (payload, streamingCallback, context) => {
    if (context) {
      context.res.setHeader('Access-Control-Allow-Origin', '*');
      context.res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS'
      );
      context.res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, x-genkit-api-key, x-google-api-key'
      );
    }
    return fn(payload, streamingCallback, context);
  };
};

const apiKeyAuth: FlowAuth<any> = async (auth, context) => {
  const req = context.req as NextRequest;
  const apiKey =
    req.headers.get('x-genkit-api-key') ??
    req.headers.get('x-google-api-key');

  if (apiKey) {
    (context as any)['apiKey'] = apiKey;
  }
};

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: async (context?: any) => {
        return context?.apiKey;
      },
    }),
  ],
  model: 'googleai/gemini-2.5-flash',
  flowAuth: apiKeyAuth,
  flowWrapper: allowCors,
});
