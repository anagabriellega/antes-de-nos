"""Junta index.html, css/livro.css e js/livro.js num único arquivo em dist/.

Esse arquivo único é o que vai para o link compartilhável (Artifact do Claude),
que já cria sozinho as tags <html>, <head> e <body>.

Uso:  python ferramentas/montar_arquivo_unico.py
"""
import pathlib
import re

RAIZ = pathlib.Path(__file__).resolve().parent.parent


def ler(caminho: str) -> str:
    return (RAIZ / caminho).read_text(encoding="utf-8")


def main() -> None:
    html = ler("index.html")
    css = ler("css/livro.css")
    js = ler("js/livro.js")

    cabeca = re.search(r"<head>(.*?)</head>", html, re.S).group(1)
    corpo = re.search(r"<body[^>]*>(.*?)</body>", html, re.S).group(1)

    cabeca = re.sub(r"\s*<meta charset[^>]*>", "", cabeca)
    cabeca = re.sub(r'\s*<meta name="viewport"[^>]*>', "", cabeca)
    link_css = '<link rel="stylesheet" href="css/livro.css">'
    script_js = '<script src="js/livro.js"></script>'
    assert link_css in cabeca and script_js in corpo, "index.html mudou: confira os links do CSS e do JS"
    cabeca = cabeca.replace(link_css, "<style>\n" + css + "\n</style>")
    corpo = corpo.replace(script_js, "<script>\n" + js + "\n</script>")

    saida = RAIZ / "dist" / "antes-de-nos.html"
    saida.parent.mkdir(exist_ok=True)
    saida.write_text(cabeca.strip() + "\n" + corpo.strip() + "\n", encoding="utf-8")
    print(f"Gerado: {saida.relative_to(RAIZ)} ({saida.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
