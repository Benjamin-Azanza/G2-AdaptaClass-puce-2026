# AdaptaClass

## Descripción
**AdaptaClass** es un videojuego educativo interactivo diseñado para evaluar y fortalecer habilidades de **Lenguaje y Literatura**. A través de dinámicas de plataformas, el jugador debe esquivar obstáculos, recolectar puntos y responder preguntas sobre comprensión lectora, inferencia, uso del lenguaje, gramática y análisis de textos. 

Es una herramienta MVP estructurada bajo una arquitectura limpia orientada a la mantenibilidad y futura escalabilidad.

### Arquitectura del Proyecto

```text
PMV-cats/
├── app/                  (Rutas de Expo Router)
│   ├── _layout.tsx
│   ├── index.tsx         (Redirige a /game si hay sesión o a login)
│   └── game.tsx          (Ruta principal del juego)
├── assets/               (Imágenes y recursos estáticos)
├── src/
│   ├── core/
│   │   └── auth/         (Capa de Negocio / Core)
│   │       └── AuthService.ts
│   ├── data/             (Capa de Datos)
│   │   └── questions.ts  (Preguntas de Lenguaje)
│   ├── game/             (Motor del Juego Phaser)
│   │   ├── gameHtmlBuilder.ts
│   │   ├── gameScript.ts
│   │   └── gameStyles.ts
│   └── ui/               (Capa de Presentación / UI)
│       ├── components/
│       │   └── GameWebView.tsx
│       └── screens/
│           └── LoginScreen.tsx
├── package.json
└── README.md
```

## Integrantes y Roles

| Integrante | Rol Scrum | Responsabilidad Técnica |
| :--- | :--- | :--- |
| Benjamin Azanza | Product Owner | Definición de requerimientos y gestión del MVP |
| Josué Tenesaca | Scrum Master / Developer | Arquitectura, refactorización modular y despliegue (Vercel) |
| Mateo Torres | Frontend Developer | Implementación UI (LoginScreen) y estilos responsivos |
| Paula Coronel | Game/Content Developer | Integración del motor Phaser y estructuración de datos (Preguntas) |

## Stack Técnico 
* **Frontend:** React Native, Expo Router.
* **Motor de Videojuego:** Phaser 3 (Ejecutado a través de WebView / Iframe).
* **Lenguaje:** TypeScript, HTML5, CSS3.
* **Arquitectura:** Modular / Basada en capas (UI Components, Domain Core/Auth, Data).

## ¿Cómo se instala y se usa?

### Requisitos previos
- Tener [Node.js](https://nodejs.org/) instalado.
- (Opcional) Aplicación de **Expo Go** en tu celular para probarlo nativamente.

### Pasos para instalar
1. Abre una terminal y navega hasta la carpeta del proyecto.
2. Instala todas las dependencias ejecutando:
   ```bash
   npm install
   ```

### ¿Cómo prenderlo / jugar?
Tienes dos formas principales de iniciar el proyecto:

**Opción A: Jugar en el navegador web (Recomendado para pruebas rápidas)**
Ejecuta el siguiente comando:
```bash
npm run web
```
*Esto abrirá automáticamente `http://localhost:8081` en tu navegador con el juego.*

**Opción B: Jugar en el celular (App Nativa)**
Ejecuta el siguiente comando:
```bash
npm start
```
*Aparecerá un código QR en la terminal. Escanéalo con la cámara de tu iPhone o con la app de Expo Go en Android.*

### Flujo de la Aplicación
1. Al iniciar la aplicación, serás recibido por la **Pantalla de Login**.
2. **Credenciales de prueba:**
   - **Opción A:** Usuario: `admin@puce.edu.ec` | Clave: `MVP`
   - **Opción B:** Usuario: `admin` | Clave: `1234`
3. Una vez autenticado, el motor de Phaser arrancará y podrás jugar. Si chocas con una bomba, aparecerá una pregunta de Lenguaje. ¡Responde bien para continuar!

## URL de Deploy 
[Enlace al proyecto en Vercel](https://g2-adapta-class-puce-2026-o2u4.vercel.app)
