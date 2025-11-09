# Criando Ícones do PWA

Como os ícones precisam ser imagens PNG, você precisará criar manualmente ou usar ferramentas online.

## Opções para criar os ícones:

### 1. **PWA Asset Generator** (Recomendado)
Use: https://www.pwabuilder.com/imageGenerator

1. Faça upload do logo "Na Mídia"
2. Selecione tamanhos: 192x192 e 512x512
3. Baixe e coloque em `/public/`

### 2. **Usando Figma/Canva**
1. Crie um quadrado 512x512px
2. Adicione o logo "Na Mídia" centralizado
3. Fundo: Gradiente laranja (#f97316) para rosa (#ec4899)
4. Exporte como PNG em dois tamanhos:
   - `icon-192.png` (192x192)
   - `icon-512.png` (512x512)

### 3. **Usando ImageMagick (Terminal)**
Se você tiver o logo original em SVG ou PNG de alta resolução:

```bash
# Instalar ImageMagick (se não tiver)
brew install imagemagick

# Criar ícones
convert logotiponamidiavetorizado.svg -resize 192x192 icon-192.png
convert logotiponamidiavetorizado.svg -resize 512x512 icon-512.png
```

## Cores recomendadas para fundo:
- **Primária:** #f97316 (laranja)
- **Secundária:** #ec4899 (rosa)
- **Gradiente:** linear-gradient(135deg, #f97316, #ec4899)

## Posicionamento dos arquivos:
```
public/
├── icon-192.png
├── icon-512.png
├── manifest.json ✅
├── sw.js ✅
└── logotiponamidiavetorizado.svg ✅
```

## Screenshots (opcional):
Para melhor experiência PWA, adicione screenshots:
- `screenshot-mobile.png` (540x720)
- `screenshot-desktop.png` (1280x720)

Você pode capturar screenshots do seu app rodando e redimensionar.
