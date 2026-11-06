# Artist Factory

Aplicação estática para preparar cópias independentes de sites de artistas a partir do ZIP original CHETTCOME V12.

## Abrir
Depois de activar GitHub Pages em **Settings → Pages → Build and deployment → Deploy from a branch**, seleccionar `main` e `/(root)`. O endereço será:
`https://rsainvestment2021.github.io/artist-factory/`

## Utilização
1. Abrir o endereço GitHub Pages.
2. Seleccionar o ZIP original CHETTCOME V12 que guardaste localmente.
3. Preencher os dados do artista e as credenciais **publicáveis** do seu próprio projecto Supabase.
4. Escolher a identidade visual e gerar o ZIP.
5. Rever o ZIP antes de publicar no projecto Netlify individual do artista.

O ZIP é processado localmente no navegador. A aplicação não envia o modelo nem as credenciais para um backend.

## IA gratuita — regra obrigatória do projecto
- Toda a construção e manutenção deve privilegiar ferramentas gratuitas e modelos open-source.
- Não integrar APIs de IA pagas, créditos, billing ou serviços que cobrem por pedido.
- A análise de imagens usa SmolVLM-256M localmente no navegador através de Transformers.js, com WebGPU ou WASM.
- O modelo é descarregado do Hugging Face na primeira utilização e fica em cache no navegador. A imagem é processada localmente; não é enviada para uma API de IA.
- A disponibilidade e velocidade dependem do navegador, da memória e do hardware do computador.

## Limitações desta versão
- O registo de artistas fica no armazenamento local do navegador; ainda não existe painel central sincronizado.
- A criação de projectos Supabase/Netlify e utilizadores Auth não é automatizada.
- As imagens carregadas são incluídas no ZIP, mas a integração automática no layout V12 ainda precisa de validação.
- O gerador deve ser testado com uma cópia de trabalho do ZIP V12 antes de publicar sites reais.

## Segurança
- Nunca introduzir `service_role`, `sb_secret_` ou palavras-passe no navegador.
- Cada artista deve usar um projecto Supabase separado.
- Não publicar o ZIP original CHETTCOME V12 neste repositório público: pode conter configurações e credenciais do projecto de origem.
- O ZIP original master não é alterado pela aplicação.

## Ficheiros
- `index.html`: aplicação completa, executada no navegador, incluindo análise visual local com IA gratuita.
- `SQL/`: scripts de permissões OWNER / ARTIST_ADMIN para adaptação e revisão.
