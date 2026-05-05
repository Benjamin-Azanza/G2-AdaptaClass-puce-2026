import { gameStyles } from './gameStyles';
import { getGameScript } from './gameScript';
import { questions } from '../data/questions';

export const buildGameHTML = () => {
    // Convertimos las preguntas a JSON para pasarlas a la lógica del juego
    const questionsJson = JSON.stringify(questions);
    
    // Obtenemos el script con las preguntas inyectadas
    const script = getGameScript(questionsJson);
    
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
            <script src="https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.min.js"></script>
            <style>
                ${gameStyles}
            </style>
        </head>
        <body>
            <div id="console-container">
                <div id="screen-bezel">
                    <div id="game-screen"></div>
                </div>
                <div id="controls-area">
                    <div id="dpad">
                        <div class="dpad-center"></div>
                        <div class="dpad-part dpad-up" id="btn-up"></div>
                        <div class="dpad-part dpad-down" id="btn-down"></div>
                        <div class="dpad-part dpad-left" id="btn-left"></div>
                        <div class="dpad-part dpad-right" id="btn-right"></div>
                        <div class="dpad-center-circle"></div>
                    </div>
                    <div id="action-buttons">
                        <div class="action-btn btn-b" id="btn-b">B</div>
                        <div class="action-btn btn-a" id="btn-a">A</div>
                    </div>
                    <div class="logo">Microsoft</div>
                </div>
            </div>
            <script>
                ${script}
            </script>
        </body>
        </html>
    `;
};
