<div align="center">

# 🎵 Soundlore

**Descubra a história por trás da música.**

Uma plataforma web para explorar artistas, músicas e gêneros — com curiosidades, capas e vídeos integrados automaticamente via APIs externas.

[![Laravel](https://img.shields.io/badge/Laravel-13-FF2D20?logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-TypeScript-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-9553E9?logo=inertia&logoColor=white)](https://inertiajs.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Filament](https://img.shields.io/badge/Admin-Filament-FDAE4B)](https://filamentphp.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## 📖 Sobre o projeto

**Soundlore** é uma plataforma de catálogo musical construída com **Laravel** no backend e **React + TypeScript** no frontend, unidos pelo **Inertia.js** (sem precisar de uma API REST separada). O projeto reúne artistas, músicas e gêneros em um só lugar, enriquecendo cada página automaticamente com capas de álbum e fotos de artista via **Deezer** e vídeos via **YouTube**, além de um painel administrativo completo construído com **Filament**.

## ✨ Funcionalidades

- 🎧 Catálogo de músicas organizado por gênero (`/generos/{genero}`)
- 📄 Página de detalhes de cada música (`/musicas/{id}`), com curiosidades e comentários
- 👤 Perfil de artista com discografia (`/artistas/{id}`)
- 🖼️ Busca automática de capas de álbum e fotos de artista via **API pública do Deezer**
- ▶️ Reprodução/integração com **YouTube** para os vídeos das músicas
- 💬 Comentários de usuários autenticados nas músicas
- 🛠️ Painel administrativo em `/admin` (Filament) para gerenciar Artistas, Músicas, Gêneros, Curiosidades e Comentários
- 🔷 Interface tipada em **TypeScript** com React via Inertia.js
- 🎨 Estilização com Tailwind CSS v4 (fontes: Bodoni Moda, Inter, Space Mono)

## 🧱 Stack

| Camada | Tecnologia |
|---|---|
| Backend | Laravel 13 (PHP 8.4) |
| Frontend | React + TypeScript (via Inertia.js) |
| Estilos | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Admin | Filament |
| Banco de dados | MySQL 8.4 |
| Ambiente | Docker via Laravel Sail |
| APIs externas | Deezer (capas/fotos), YouTube Data API (vídeos) |
| Build | Vite |

## 📋 Pré-requisitos

- [Docker](https://www.docker.com/) e Docker Compose
- PHP 8.4+ (opcional na máquina host, o Sail já traz)
- Composer
- Node.js 20+ e npm

## 🚀 Montando o ambiente de desenvolvimento

```bash
# 1. Clone o repositório
git clone https://github.com/Mayza414/soundlore.git
cd soundlore

# 2. Copie o arquivo de ambiente
cp .env.example .env

# 3. Instale as dependências PHP (via Composer + Docker, sem precisar de PHP local)
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v "$(pwd):/var/www/html" \
    -w /var/www/html \
    laravelsail/php84-composer:latest \
    composer install --ignore-platform-reqs

# 4. Suba os containers (app + MySQL)
./vendor/bin/sail up -d

# 5. Gere a chave da aplicação
./vendor/bin/sail artisan key:generate

# 6. Rode as migrations com os dados de exemplo (seeds)
./vendor/bin/sail artisan migrate --seed

# 7. Instale as dependências do frontend
./vendor/bin/sail npm install

# 8. Suba o servidor de desenvolvimento do Vite
./vendor/bin/sail npm run dev
```

A aplicação estará disponível em **http://localhost**.

### Criando um usuário admin (Filament)

```bash
./vendor/bin/sail artisan make:filament-user
```

Acesse o painel em **http://localhost/admin**.

### Buscando capas e fotos via Deezer

```bash
./vendor/bin/sail artisan songs:fetch-images
# use --force para sobrescrever imagens já existentes
./vendor/bin/sail artisan songs:fetch-images --force
```

## 🔑 Variáveis de ambiente

Além das variáveis padrão do Laravel, configure:

```env
# YouTube Data API (necessária chave de API do Google Cloud Console)
YOUTUBE_API_KEY=

# A API pública do Deezer não exige chave de autenticação
```

Veja `.env.example` para a lista completa.

## 🗺️ Rotas principais

| Rota | Descrição |
|---|---|
| `GET /` | Home — artista em destaque, gêneros e novidades |
| `GET /musicas/{song}` | Detalhes da música (curiosidades, comentários) |
| `GET /artistas/{artist}` | Perfil do artista e sua discografia |
| `GET /generos/{genre}` | Catálogo filtrado por gênero |
| `POST /musicas/{song}/comentarios` | Cria comentário (requer autenticação) |
| `DELETE /comentarios/{comment}` | Remove comentário (requer autenticação) |
| `GET /admin` | Painel administrativo (Filament) |

## 🗄️ Estrutura do banco (principais entidades)

- **Artist** — artistas cadastrados
- **Song** — músicas, vinculadas a artista e gênero
- **Genre** — gêneros musicais (rock, pop, mpb, samba, jazz, ...)
- **Curiosity** — curiosidades associadas a músicas/artistas
- **Comment** — comentários de usuários nas músicas

## 🛠️ Comandos úteis

```bash
# Rodar migrations do zero
./vendor/bin/sail artisan migrate:fresh --seed

# Ver rotas registradas
./vendor/bin/sail artisan route:list

# Tinker (console interativo)
./vendor/bin/sail artisan tinker

# Ver logs em tempo real
./vendor/bin/sail logs -f

# Rodar testes
./vendor/bin/sail artisan test
```

## 📁 Estrutura de pastas (resumo)

soundlore/
├── app/
│ ├── Filament/Resources/ # Recursos do painel admin
│ ├── Http/Controllers/ # SongController, ArtistController, GenreController...
│ ├── Models/ # Artist, Song, Genre, Curiosity, Comment
│ └── Console/Commands/ # songs:fetch-images
├── database/
│ ├── migrations/
│ └── seeders/
├── resources/
│ └── js/
│ ├── app.tsx # Entry point React/Inertia
│ ├── Layouts/
│ ├── Components/ # Home, Songs, Genre, UI...
│ └── Pages/ # Home, Songs/Show, Artist/Show, Genre/Show...
└── docker-compose.yml # Laravel Sail


## 🗺️ Roadmap

- [ ] Autenticação de usuários completa (login/registro com Breeze)
- [ ] Favoritar músicas e artistas
- [ ] Busca/filtro avançado no catálogo
- [ ] Testes automatizados (Feature/Unit)
- [ ] Deploy em produção (CI/CD)

## 🤝 Contribuindo

Contribuições são bem-vindas! Para colaborar:

1. Faça um fork do projeto
2. Crie uma branch (`git checkout -b feature/nome-da-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nome-da-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT — veja o arquivo [LICENSE](LICENSE) para mais detalhes.