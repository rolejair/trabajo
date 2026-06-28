# CNC Design Pro

Una aplicación web profesional para diseño CNC compatible con Carbide Create y controladores GRBL (como TwoTrees CNC 3018).

## Características

- ✅ Diseño interactivo en canvas HTML5
- ✅ Importación y trazado de imágenes (potrace)
- ✅ Generador de códigos QR con corrección de error M
- ✅ Selector de brocas (V-bit, flauta, etc) con parámetros personalizables
- ✅ Configuración completa de parámetros CNC (RPM, feed rate, plunge rate, etc)
- ✅ Generación de G-code compatible con GRBL/Candle
- ✅ Figuras básicas (círculo, cuadrado, corazón, estrella, etc)
- ✅ Herramienta de zoom (teclado, mouse, botones)
- ✅ Grid visual con referencias (1mm/5mm)
- ✅ Movimiento de objetos con mouse
- ✅ Guardado/carga de proyectos en JSON
- ✅ Mesa de trabajo personalizable (default 50x30mm)
- ✅ Optimización automática de stepover
- ✅ Soporte para pocket y contorno

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre `http://localhost:8080` en tu navegador.

## Compilación

```bash
npm run build
```

## Uso

1. **Crear proyecto**: Selecciona tamaño de mesa en las opciones
2. **Agregar objetos**: Usa el panel de herramientas (importar imagen, QR, formas, texto)
3. **Configurar parámetros CNC**: Panel derecho con brocas y parámetros
4. **Generar G-code**: Botón "Exportar NC"
5. **Guardar proyecto**: Botón "Guardar JSON"

## Compatibilidad

- **Controladores**: GRBL 1.1+ (TwoTrees CNC 3018)
- **Software**: Candle, Universal Gcode Sender, etc
- **Navegadores**: Chrome, Firefox, Safari, Edge (últimas versiones)

## Especificaciones por defecto

- **Depth per pass**: 0.05mm
- **Plunge rate**: 20mm/min
- **Feed rate**: 100mm/min
- **RPM**: 10000
- **Max depth**: 0.15mm
- **Mesa**: 50x30mm

## Licencia

MIT
