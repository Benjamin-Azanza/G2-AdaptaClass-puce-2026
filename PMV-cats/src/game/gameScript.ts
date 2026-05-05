export const getGameScript = (questionsJson: string) => `
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

    let questions = ${questionsJson};

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
                    scene.add.text(400, 200, 'GAME OVER\\\\n¡Respuesta Incorrecta!', { 
                        fontSize: '48px', fill: '#ff0000', align: 'center', fontStyle: 'bold' 
                    }).setOrigin(0.5);
                    
                    scene.add.text(400, 320, 'La respuesta correcta era:\\\\n' + correctAnswer, { 
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
`;
