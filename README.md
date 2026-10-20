# Antes de Nós

Livro digital interativo sobre a história do Universo e da Terra, do Big Bang ao *Homo sapiens*, para adolescentes e adultos. As páginas viram como num livro de verdade e as ilustrações são vetoriais e animadas.

Capítulos prontos: 1 (O Big Bang), 2 (Nasce a Terra) e 9 (A era dos dinossauros). O livro terá 12.

**Ler online:** https://anagabriellega.github.io/antes-de-nos/

## Como abrir no computador

Abra `index.html` no navegador. É preciso internet para carregar as fontes e a biblioteca que vira as páginas ([StPageFlip](https://github.com/Nodlik/StPageFlip)).

## Estrutura

- `index.html`: as 14 páginas do livro, com as ilustrações em SVG
- `css/livro.css`: o visual (cores das eras, tipografia, animações)
- `js/livro.js`: as interações (virar páginas, linha do tempo, quiz, cenas animadas)
- `ferramentas/montar_arquivo_unico.py`: junta tudo em `dist/antes-de-nos.html`, a versão em arquivo único usada no link compartilhável

Para gerar o arquivo único:

```bash
python ferramentas/montar_arquivo_unico.py
```
