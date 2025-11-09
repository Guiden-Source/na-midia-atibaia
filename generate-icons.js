#!/usr/bin/env node

/**
 * Script para gerar ícones PWA a partir do logo SVG
 * 
 * Gera:
 * - icon-192.png (192x192) - PWA Android
 * - icon-512.png (512x512) - PWA Android/iOS
 * - favicon.ico (32x32, 16x16) - Navegadores
 * - apple-touch-icon.png (180x180) - iOS
 */

const fs = require('fs');
const path = require('path');

console.log('🎨 Gerador de Ícones PWA - Na Mídia\n');

// Verifica se o sharp está instalado
let sharp;
try {
  sharp = require('sharp');
  console.log('✅ Sharp instalado\n');
} catch (error) {
  console.log('❌ Sharp não encontrado. Instalando...\n');
  console.log('Execute: npm install --save-dev sharp\n');
  process.exit(1);
}

const publicDir = path.join(__dirname, 'public');
const logoPath = path.join(publicDir, 'logotiponamidiavetorizado.svg');

// Verifica se o logo existe
if (!fs.existsSync(logoPath)) {
  console.error('❌ Logo não encontrado:', logoPath);
  process.exit(1);
}

console.log('📂 Diretório:', publicDir);
console.log('🖼️  Logo:', logoPath);
console.log('\n🔄 Gerando ícones...\n');

// Configurações dos ícones
const icons = [
  { name: 'icon-192.png', size: 192, description: 'PWA Android (mínimo)' },
  { name: 'icon-512.png', size: 512, description: 'PWA Android/iOS (ideal)' },
  { name: 'apple-touch-icon.png', size: 180, description: 'iOS Safari' },
  { name: 'favicon-32x32.png', size: 32, description: 'Favicon moderna' },
  { name: 'favicon-16x16.png', size: 16, description: 'Favicon legado' },
];

// Função para gerar ícone com fundo
async function generateIcon(config) {
  try {
    const { name, size, description } = config;
    const outputPath = path.join(publicDir, name);

    // Criar fundo gradiente
    const svgBackground = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f97316;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ec4899;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size * 0.1}" />
      </svg>
    `;

    // Gerar fundo
    const background = await sharp(Buffer.from(svgBackground))
      .resize(size, size)
      .png()
      .toBuffer();

    // Redimensionar logo (80% do tamanho)
    const logoSize = Math.floor(size * 0.8);
    const padding = Math.floor((size - logoSize) / 2);

    const logo = await sharp(logoPath)
      .resize(logoSize, logoSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toBuffer();

    // Compor imagem final
    await sharp(background)
      .composite([
        {
          input: logo,
          top: padding,
          left: padding,
        }
      ])
      .png()
      .toFile(outputPath);

    console.log(`✅ ${name} (${size}x${size}) - ${description}`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao gerar ${config.name}:`, error.message);
    return false;
  }
}

// Gerar todos os ícones
async function generateAllIcons() {
  const results = [];

  for (const config of icons) {
    const result = await generateIcon(config);
    results.push(result);
  }

  // Gerar favicon.ico (multi-size)
  try {
    console.log('\n🔄 Gerando favicon.ico...');
    
    // Favicon.ico requer biblioteca especial, vamos criar um PNG simples
    const favicon32Path = path.join(publicDir, 'favicon-32x32.png');
    const faviconPath = path.join(publicDir, 'favicon.ico');
    
    // Copiar o 32x32 como favicon.ico (browsers modernos aceitam)
    fs.copyFileSync(favicon32Path, faviconPath);
    
    console.log('✅ favicon.ico (fallback para 32x32)');
  } catch (error) {
    console.error('❌ Erro ao gerar favicon.ico:', error.message);
  }

  // Resumo
  console.log('\n' + '='.repeat(50));
  const success = results.filter(r => r).length;
  const total = results.length;
  
  if (success === total) {
    console.log('✅ Todos os ícones gerados com sucesso!');
    console.log('\n📦 Ícones criados:');
    console.log('   - icon-192.png (PWA mínimo)');
    console.log('   - icon-512.png (PWA ideal)');
    console.log('   - apple-touch-icon.png (iOS)');
    console.log('   - favicon.ico (navegadores)');
    console.log('   - favicon-32x32.png');
    console.log('   - favicon-16x16.png');
    console.log('\n🚀 Próximos passos:');
    console.log('   1. Verifique os ícones em public/');
    console.log('   2. Teste o PWA no celular');
    console.log('   3. Deploy em HTTPS para instalar');
  } else {
    console.log(`⚠️  ${success}/${total} ícones gerados com sucesso`);
  }
  console.log('='.repeat(50) + '\n');
}

// Executar
generateAllIcons().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
