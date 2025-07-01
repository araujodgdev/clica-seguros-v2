# Guia de Otimização de Imagens - Hero Section

## Dimensões Recomendadas

### Desktop (car-on-road.jpg)
- **Dimensões**: 1920x1080px ou 2000x1125px
- **Aspect Ratio**: 16:9
- **Formato**: JPG (melhor compressão para fotos)
- **Qualidade**: 85-90%
- **Tamanho máximo**: 400KB

### Mobile (car-on-road-mobile.jpg)
- **Dimensões**: 800x1200px
- **Aspect Ratio**: 2:3 (mais vertical)
- **Formato**: JPG
- **Qualidade**: 85%
- **Tamanho máximo**: 200KB

## Ferramentas de Otimização

1. **TinyPNG/TinyJPG** (online): https://tinypng.com
2. **Squoosh** (Google): https://squoosh.app
3. **ImageOptim** (macOS)
4. **Sharp** (Node.js): Para automação

## Script de Otimização com Sharp

```bash
npm install sharp --save-dev
```

```javascript
// optimize-hero-images.js
const sharp = require('sharp');

// Desktop version
sharp('public/car-on-road-original.jpg')
  .resize(1920, 1080, {
    fit: 'cover',
    position: 'center'
  })
  .jpeg({ quality: 85, progressive: true })
  .toFile('public/car-on-road.jpg');

// Mobile version
sharp('public/car-on-road-original.jpg')
  .resize(800, 1200, {
    fit: 'cover',
    position: 'center 65%' // Ajusta o foco para parte inferior
  })
  .jpeg({ quality: 85, progressive: true })
  .toFile('public/car-on-road-mobile.jpg');
```

## Dicas Importantes

1. **Use imagens progressivas**: Carregam gradualmente
2. **Considere WebP**: Formato moderno com melhor compressão
3. **Lazy loading**: Já configurado como `eager` na hero (correto)
4. **CDN**: Para produção, use um CDN como Cloudflare ou Vercel

## Implementação WebP (Opcional)

```jsx
<picture>
  <source 
    media="(max-width: 768px)" 
    srcSet="/car-on-road-mobile.webp" 
    type="image/webp"
  />
  <source 
    media="(max-width: 768px)" 
    srcSet="/car-on-road-mobile.jpg" 
    type="image/jpeg"
  />
  <source 
    srcSet="/car-on-road.webp" 
    type="image/webp"
  />
  <img 
    src="/car-on-road.jpg" 
    alt="Seguro de carro moderno"
    className="h-[120%] w-full object-cover hero-image-mobile"
    loading="eager"
  />
</picture>
``` 