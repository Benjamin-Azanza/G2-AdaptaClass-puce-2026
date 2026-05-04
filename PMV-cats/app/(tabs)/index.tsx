import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

const gameHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <script src="https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.min.js"></script>
        <style>
            html, body {
                margin: 0; padding: 0;
                width: 100%; height: 100%;
                background-color: #389b9e;
                display: flex;
                flex-direction: column;
                align-items: center;
                overflow: hidden;
                font-family: Arial, sans-serif;
                user-select: none;
                -webkit-user-select: none;
                touch-action: none;
            }

            #console-container {
                width: 100%;
                max-width: 600px;
                height: 100%;
                display: flex;
                flex-direction: column;
                position: relative;
            }

            #screen-bezel {
                background-color: #2b2b2b;
                border-radius: 10px;
                padding: 10px;
                margin: 10px;
                box-shadow: inset 0 0 10px rgba(0,0,0,0.8);
                flex: 0 0 auto;
                aspect-ratio: 4/3;
            }

            #game-screen {
                background-color: #000;
                width: 100%;
                height: 100%;
                border-radius: 5px;
                overflow: hidden;
                position: relative;
            }

            #game-screen canvas {
                width: 100% !important;
                height: 100% !important;
                display: block;
                object-fit: contain;
            }

            #controls-area {
                flex: 1;
                position: relative;
            }

            /* D-Pad */
            #dpad {
                position: absolute;
                left: 20px;
                top: 50%;
                transform: translateY(-50%);
                width: 120px;
                height: 120px;
            }

            .dpad-part {
                position: absolute;
                background-color: #b0b0b0;
                box-shadow: inset -2px -2px 4px rgba(0,0,0,0.3), inset 2px 2px 4px rgba(255,255,255,0.8);
                cursor: pointer;
            }
            .dpad-part:active, .dpad-part.active { background-color: #909090; }

            .dpad-up { width: 40px; height: 40px; left: 40px; top: 0; border-radius: 5px 5px 0 0; }
            .dpad-down { width: 40px; height: 40px; left: 40px; bottom: 0; border-radius: 0 0 5px 5px; }
            .dpad-left { width: 40px; height: 40px; left: 0; top: 40px; border-radius: 5px 0 0 5px; }
            .dpad-right { width: 40px; height: 40px; right: 0; top: 40px; border-radius: 0 5px 5px 0; }

            .dpad-center {
                position: absolute;
                width: 40px; height: 40px; left: 40px; top: 40px;
                background-color: #b0b0b0;
            }
            .dpad-center-circle {
                position: absolute; width: 24px; height: 24px; left: 48px; top: 48px;
                background-color: #333; border-radius: 50%;
            }

            /* Buttons */
            #action-buttons {
                position: absolute;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                width: 130px;
                height: 100px;
            }

            .action-btn {
                position: absolute;
                width: 50px; height: 50px;
                border-radius: 50%;
                background-color: #404040; color: #d0d0d0;
                display: flex; justify-content: center; align-items: center;
                font-size: 20px; font-weight: bold;
                box-shadow: 2px 2px 5px rgba(0,0,0,0.5), inset -2px -2px 4px rgba(0,0,0,0.6), inset 2px 2px 4px rgba(255,255,255,0.3);
                cursor: pointer;
            }
            .action-btn:active, .action-btn.active { background-color: #303030; box-shadow: inset 2px 2px 5px rgba(0,0,0,0.8); }

            .btn-b { left: 0; bottom: 0; }
            .btn-a { right: 0; top: 0; }

            .logo {
                position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%);
                color: #fff; font-size: 14px; font-weight: bold; opacity: 0.8;
                font-family: 'Segoe UI', sans-serif;
            }
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
            // Configurar variables globales
            window.moveLeft = false;
            window.moveRight = false;
            window.jump = false;

            const btnLeft = document.getElementById('btn-left');
            const btnRight = document.getElementById('btn-right');
            const btnA = document.getElementById('btn-a');
            const btnB = document.getElementById('btn-b');
            const btnUp = document.getElementById('btn-up');
            const btnDown = document.getElementById('btn-down');

            function addTouchEvents(btn, actionDown, actionUp) {
                btn.addEventListener('touchstart', (e) => { e.preventDefault(); actionDown(); btn.classList.add('active'); }, {passive: false});
                btn.addEventListener('touchend', (e) => { e.preventDefault(); actionUp(); btn.classList.remove('active'); }, {passive: false});
                btn.addEventListener('mousedown', (e) => { e.preventDefault(); actionDown(); btn.classList.add('active'); });
                btn.addEventListener('mouseup', (e) => { e.preventDefault(); actionUp(); btn.classList.remove('active'); });
                btn.addEventListener('mouseleave', (e) => { e.preventDefault(); actionUp(); btn.classList.remove('active'); });
            }

            addTouchEvents(btnLeft, () => window.moveLeft = true, () => window.moveLeft = false);
            addTouchEvents(btnRight, () => window.moveRight = true, () => window.moveRight = false);
            addTouchEvents(btnA, () => window.jump = true, () => window.jump = false);
            addTouchEvents(btnB, () => window.jump = true, () => window.jump = false);
            addTouchEvents(btnUp, () => {}, () => {});
            addTouchEvents(btnDown, () => {}, () => {});

            // Eventos de teclado global
            window.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') { window.moveLeft = true; btnLeft.classList.add('active'); }
                if (e.key === 'ArrowRight') { window.moveRight = true; btnRight.classList.add('active'); }
                if (e.key === 'ArrowUp' || e.key === ' ') { window.jump = true; btnA.classList.add('active'); btnB.classList.add('active'); }
            });
            window.addEventListener('keyup', (e) => {
                if (e.key === 'ArrowLeft') { window.moveLeft = false; btnLeft.classList.remove('active'); }
                if (e.key === 'ArrowRight') { window.moveRight = false; btnRight.classList.remove('active'); }
                if (e.key === 'ArrowUp' || e.key === ' ') { window.jump = false; btnA.classList.remove('active'); btnB.classList.remove('active'); }
            });

            const config = {
                type: Phaser.AUTO,
                parent: 'game-screen',
                scale: {
                    mode: Phaser.Scale.FIT,
                    autoCenter: Phaser.Scale.CENTER_BOTH,
                    width: 800,
                    height: 600
                },
                physics: {
                    default: 'arcade',
                    arcade: {
                        gravity: { y: 300 },
                        debug: false
                    }
                },
                backgroundColor: '#3498db',
                scene: {
                    preload: preload,
                    create: create,
                    update: update
                }
            };

            const game = new Phaser.Game(config);

            let player;
            let stars;
            let bombs;
            let platforms;
            let cursors;
            let score = 0;
            let gameOver = false;
            let scoreText;


             let questions = [
                // Historia del Ecuador
                { q: "¿Quién lideró la Revolución Liberal en Ecuador?", options: ["Gabriel García Moreno", "Eloy Alfaro", "José María Velasco Ibarra"], answer: 1 },
                { q: "¿En qué año se separó Ecuador de la Gran Colombia?", options: ["1822", "1830", "1895"], answer: 1 },
                { q: "¿En qué batalla se selló la independencia del Ecuador?", options: ["Batalla de Tarqui", "Batalla de Boyacá", "Batalla de Pichincha"], answer: 2 },
                { q: "¿Qué presidente abolió la esclavitud en Ecuador?", options: ["José María Urbina", "Vicente Rocafuerte", "García Moreno"], answer: 0 },
                { q: "¿Quién fue el primer presidente de la República del Ecuador?", options: ["Simón Bolívar", "Antonio José de Sucre", "Juan José Flores"], answer: 2 },
                // Historia de Quito
                { q: "¿En qué fecha se fundó San Francisco de Quito de forma definitiva?", options: ["6 de diciembre de 1534", "10 de agosto de 1809", "24 de mayo de 1822"], answer: 0 },
                { q: "¿Quién fundó la ciudad de Quito?", options: ["Sebastián de Benalcázar", "Francisco Pizarro", "Diego de Almagro"], answer: 0 },
                { q: "¿Qué evento histórico ocurrió el 10 de agosto de 1809 en Quito?", options: ["La fundación de la ciudad", "El Primer Grito de Independencia", "La Batalla de Pichincha"], answer: 1 },
                { q: "¿A qué líder indígena se enfrentaron los españoles en la conquista de Quito?", options: ["Rumiñahui", "Atahualpa", "Huáscar"], answer: 0 },
                { q: "¿Qué título histórico recibió Quito por su rol en la independencia?", options: ["Carita de Dios", "Luz de América", "Atenas del Ecuador"], answer: 1 },
                { q: "¿En qué año fue la Batalla de Pichincha?", options: ["1809", "1822", "1830"], answer: 1 },
                { q: "¿Cuál es la capital del Ecuador?", options: ["Guayaquil", "Cuenca", "Quito"], answer: 2 },
                { q: "¿Quién escribió la letra del himno nacional del Ecuador?", options: ["Juan León Mera", "Antonio Neumane", "Eugenio Espejo"], answer: 0 },
                { q: "¿En qué año Ecuador retornó definitivamente a la democracia?", options: ["1979", "1990", "2000"], answer: 0 },
                { q: "¿Qué presidente lideró la Revolución Liberal?", options: ["Gabriel García Moreno", "Eloy Alfaro", "José María Velasco Ibarra"], answer: 1 },
                { q: "¿Cuál es la moneda oficial actual del Ecuador?", options: ["Sucre", "Peso", "Dólar estadounidense"], answer: 2 },
                { q: "¿En qué ciudad se firmó el acta de independencia en 1809?", options: ["Quito", "Guayaquil", "Cuenca"], answer: 0 },
                { q: "¿Cómo se llama el volcán más alto del Ecuador?", options: ["Cotopaxi", "Chimborazo", "Cayambe"], answer: 1 },
                { q: "¿Cual es la orientacion sexual del benja?", options: ["gei", "hetero", "bi"], answer: 0 },
            ];

            let questionModalGroup;
            let isQuestionActive = false;
            let currentBomb = null;

            function preload ()
            {
                this.load.setBaseURL('https://labs.phaser.io/src/games/firstgame/');
                this.load.image('sky', 'assets/sky.png');
                this.load.image('ground', 'assets/platform.png');
                this.load.image('star', 'assets/star.png');
                this.load.image('bomb', 'assets/bomb.png');
                this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
            }

            function create ()
            {
                this.add.image(400, 300, 'sky');

                platforms = this.physics.add.staticGroup();
                platforms.create(400, 568, 'ground').setScale(2).refreshBody();
                platforms.create(600, 400, 'ground');
                platforms.create(50, 250, 'ground');
                platforms.create(750, 220, 'ground');

                player = this.physics.add.sprite(100, 450, 'dude');
                player.setBounce(0.2);
                player.setCollideWorldBounds(true);

                this.anims.create({
                    key: 'left',
                    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
                    frameRate: 10,
                    repeat: -1
                });
                this.anims.create({
                    key: 'turn',
                    frames: [ { key: 'dude', frame: 4 } ],
                    frameRate: 20
                });
                this.anims.create({
                    key: 'right',
                    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
                    frameRate: 10,
                    repeat: -1
                });

                cursors = this.input.keyboard.createCursorKeys();

                stars = this.physics.add.group({
                    key: 'star',
                    repeat: 11,
                    setXY: { x: 12, y: 0, stepX: 70 }
                });

                stars.children.iterate(function (child) {
                    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
                });

                bombs = this.physics.add.group();
                scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
                questionModalGroup = this.add.group();

                this.physics.add.collider(player, platforms);
                this.physics.add.collider(stars, platforms);
                this.physics.add.collider(bombs, platforms);
                this.physics.add.overlap(player, stars, collectStar, null, this);
                this.physics.add.collider(player, bombs, hitBomb, null, this);
            }

            function update ()
            {
                if (gameOver || isQuestionActive)
                {
                    if (isQuestionActive) {
                        player.setVelocityX(0);
                        player.anims.play('turn');
                    }
                    return;
                }

                if (cursors.left.isDown || window.moveLeft)
                {
                    player.setVelocityX(-160);
                    player.anims.play('left', true);
                }
                else if (cursors.right.isDown || window.moveRight)
                {
                    player.setVelocityX(160);
                    player.anims.play('right', true);
                }
                else
                {
                    player.setVelocityX(0);
                    player.anims.play('turn');
                }

                if ((cursors.up.isDown || window.jump) && player.body.touching.down)
                {
                    player.setVelocityY(-330);
                }
            }

            function collectStar (player, star)
            {
                if (isQuestionActive) return;
                star.disableBody(true, true);
                score += 10;
                scoreText.setText('Score: ' + score);

                if (stars.countActive(true) === 0)
                {
                    stars.children.iterate(function (child) {
                        child.enableBody(true, child.x, 0, true, true);
                    });

                    let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
                    let bomb = bombs.create(x, 16, 'bomb');
                    bomb.setBounce(1);
                    bomb.setCollideWorldBounds(true);
                    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
                }
            }

            function hitBomb (player, bomb)
            {
                if (isQuestionActive) return;

                this.physics.pause();
                player.setTint(0xff0000);
                player.anims.play('turn');
                
                isQuestionActive = true;
                currentBomb = bomb;
                showQuestion(this);
            }

            function showQuestion(scene) {
                const qData = Phaser.Utils.Array.GetRandom(questions);

                let overlay = scene.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
                questionModalGroup.add(overlay);

                let qText = scene.add.text(400, 150, qData.q, { 
                    fontSize: '28px', fill: '#fff', align: 'center', wordWrap: { width: 700 }
                }).setOrigin(0.5);
                questionModalGroup.add(qText);

                for (let i = 0; i < qData.options.length; i++) {
                    let yPos = 250 + (i * 80);
                    
                    let btnBg = scene.add.rectangle(400, yPos, 400, 60, 0x333333).setInteractive();
                    let btnText = scene.add.text(400, yPos, qData.options[i], { 
                        fontSize: '24px', fill: '#fff' 
                    }).setOrigin(0.5);

                    questionModalGroup.add(btnBg);
                    questionModalGroup.add(btnText);

                    btnBg.on('pointerover', () => btnBg.setFillStyle(0x555555));
                    btnBg.on('pointerout', () => btnBg.setFillStyle(0x333333));

                    btnBg.on('pointerdown', () => {
                        if (i === qData.answer) {
                            isQuestionActive = false;
                            player.clearTint();
                            
                            questionModalGroup.clear(true, true);
                            scene.physics.resume();
                        } else {
                            const correctAnswer = qData.options[qData.answer];
                            questionModalGroup.clear(true, true);
                            gameOver = true;
                            
                            scene.add.rectangle(400, 300, 800, 600, 0x000000, 0.9);
                            scene.add.text(400, 200, 'GAME OVER\\n¡Respuesta Incorrecta!', { 
                                fontSize: '48px', fill: '#ff0000', align: 'center', fontStyle: 'bold' 
                            }).setOrigin(0.5);
                            
                            scene.add.text(400, 320, 'La respuesta correcta era:\\n' + correctAnswer, { 
                                fontSize: '28px', fill: '#ffffff', align: 'center' 
                            }).setOrigin(0.5);

                            let retryBtn = scene.add.rectangle(400, 450, 300, 60, 0x27ae60).setInteractive();
                            let retryText = scene.add.text(400, 450, 'REINTENTAR JUEGO', { 
                                fontSize: '24px', fill: '#fff', fontStyle: 'bold' 
                            }).setOrigin(0.5);

                            retryBtn.on('pointerover', () => retryBtn.setFillStyle(0x2ecc71));
                            retryBtn.on('pointerout', () => retryBtn.setFillStyle(0x27ae60));
                            
                            retryBtn.on('pointerdown', () => {
                                score = 0;
                                gameOver = false;
                                isQuestionActive = false;
                                scene.scene.restart();
                            });
                        }
                    });
                }
            }
        </script>
    </body>
    </html>
`;

export default function HomeScreen() {
    if (Platform.OS === 'web') {
        return (
            <View style={styles.container}>
                <iframe
                    srcDoc={gameHTML}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <WebView
                source={{ html: gameHTML }}
                style={styles.webview}
                scrollEnabled={false}
                bounces={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                originWhitelist={['*']}
                allowFileAccess={true}
                allowUniversalAccessFromFileURLs={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    webview: {
        flex: 1,
        backgroundColor: 'transparent',
    },
});
