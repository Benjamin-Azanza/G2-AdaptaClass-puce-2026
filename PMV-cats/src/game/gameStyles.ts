export const gameStyles = `
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
`;
