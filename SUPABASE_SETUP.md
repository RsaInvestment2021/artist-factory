# Ligação Supabase — Artist Factory

## Ficheiros
- SQL/FACTORY_CENTRAL_SETUP.sql: perfil privado do proprietário.
- supabase/functions/analyse-brand-image/index.ts: análise de imagem por OpenAI Responses API.

## Configuração no Dashboard (sem instalar programas)
1. No projecto Artist Factory, abre SQL Editor e executa SQL/FACTORY_CENTRAL_SETUP.sql.
2. Abre Authentication > Users e cria o utilizador do proprietário.
3. Abre Edge Functions e cria uma função chamada analyse-brand-image; cola o ficheiro index.ts.
4. Em Edge Functions > Secrets, adiciona OPENAI_API_KEY com a tua chave OpenAI. Nunca a coloques no HTML, GitHub ou browser.
5. Mantém a verificação JWT activa para a função.

## Segurança
- URL e publishable key são públicas e podem ser usadas no cliente com RLS.
- Nunca usar service_role ou sb_secret_ no browser.
- O SQL não cria utilizadores nem concede acesso público.
- A função envia a imagem para a OpenAI, mas não persiste a imagem nem a resposta.
- Modelo configurado: gpt-4.1-mini. Endpoint: OpenAI Responses API.

## Estado
Isto prepara a camada backend. A interface de login, teste de ligação e botão de análise na fábrica serão ligados a estes recursos na próxima actualização do index.html.