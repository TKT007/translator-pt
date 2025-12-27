# Tradutor PT ↔ EN

Tradutor com IA usando OpenAI API, hospedado no Cloudflare Pages.

## Estrutura do Projeto

```
translator-cloudflare/
├── functions/
│   └── api/
│       └── translate.js   # Cloudflare Function
├── public/
│   ├── index.html         # Frontend
│   └── favicon.svg        # Ícone
└── README.md
```

## Deploy no Cloudflare Pages

### 1. Suba para o GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/SEU_USUARIO/translator-pt-en.git
git push -u origin main
```

### 2. Conecte no Cloudflare Pages

1. Vá em [dash.cloudflare.com](https://dash.cloudflare.com)
2. Clique em **Workers & Pages** → **Create application** → **Pages**
3. Conecte sua conta do GitHub
4. Selecione o repositório
5. Configure:
   - **Build command:** (deixe vazio)
   - **Build output directory:** `public`
6. Clique em **Save and Deploy**

### 3. Configure a API Key

1. Após o deploy, vá em **Settings** → **Environment variables**
2. Adicione:
   - **Variable name:** `OPENAI_API_KEY`
   - **Value:** `sk-proj-...` (sua chave da OpenAI)
3. Clique em **Save**
4. Vá em **Deployments** e clique em **Retry deployment** no último deploy

## Uso

- Digite o texto em português e pressione **Enter** para traduzir
- Clique no botão de **swap** (↔) para inverter a direção
- Clique no **X** para limpar o texto
- Clique em **COPIAR** para copiar a tradução
