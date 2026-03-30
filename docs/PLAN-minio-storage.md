# PLAN: Integração de Storage S3 com MinIO

## 1. Contexto e Objetivo
Configurar um bucket S3-compatível (MinIO) para ser o provedor oficial de arquivos, armazenando, gerenciando e devolvendo todas as URLs de mídias usadas no painel administrativo e na loja, através da inserção do módulo oficial `@medusajs/file-s3` (suportado pelo Medusa 2.0).

---

## 2. Perguntas Socrativas (Socratic Gate)
Para eu definir a melhor rota de instrução, por favor responda estas questões de contexto:

1. **Local x Remoto**: O MinIO já está hospedado e rodando remotamente, ou devo adicionar a imagem docker do MinIO (`bitnami/minio`) neste projeto no `docker-compose` do Medusa para rodar localmente durante o desenvolvimento?
2. **Credenciais Prontas**: Você já tem um Bucket criado, com a chave de acesso (Access Key) e chave secreta (Secret Key) geradas e em mãos?
3. **Público x Privado (Acesso Externo)**: Mídias de loja tradicionalmente dependem de *buckets públicos* (Public Read) para que o URL da imagem retorne a foto diretamente pro cliente. Seus buckets estão permitindo leitura pública?
4. **Endpoint Customizado**: Qual a URL base do MinIO que você está utilizando (ex.: `https://minio.seu-dominio.com` ou `http://localhost:9000`)?

---

## 3. Tarefas de Implementação (Pendente de Revisão / /enhance)

### Fase 1: Instalação das Dependências
- Executar `npm install @medusajs/file-s3` para adicionar o pacote de integração oficial S3 do Medusa.

### Fase 2: Configuração do Módulo de Arquivos (`medusa-config.ts`)
- Configurar o módulo "File" de forma que utilize o plugin recém instalado.
- Mapear a sobreposição do endpoint da AWS para o Endpoint Customizado do seu MinIO (`options.endpoint`).
- Forçar o uso de Path Style HTTP para suportar minio (`options.s3ForcePathStyle = true`).

### Fase 3: Variáveis de Ambiente (`.env`)
- Injetar no fluxo de Dev / Docker e Nuvem:
  - `S3_URL` (Sua URL acessível por clientes/publica)
  - `S3_BUCKET` (Nome do bucket)
  - `S3_ENDPOINT` (URL API do Minio)
  - `S3_ACCESS_KEY_ID`
  - `S3_SECRET_ACCESS_KEY`

### Fase 4: Opcional (Infra Docker Local)
- (Se requisitado) Adicionar container do MinIO no `docker-compose.yml`, gerar buckets e usuários através de scripts `mc` (minio client) via docker-entrypoint para inicialização limpa.

### Fase 5: Verificação de Ponta a Ponta
- Reiniciar o Medusa SDK.
- Fazer upload de imagem via Medusa Admin em uma Category/Collection.
- Auditar a URL de retorno registrada no banco para confirmar apontamento base da imagem hospedada.
