const { app, BrowserWindow} = require('electron');
const path = require('path');
const {exec} = require('child_process')

const http = require('http');

function waitForServer(url, callback) {
    const interval = setInterval(() => {
        http.get(url, (res) => {
            if (res.statusCode === 200) {
                clearInterval(interval);
                callback();
            }
        }).on('error', () => {
            // Servidor ainda não está ativo, esperar mais um pouco
        });
    }, 1000);  // Verifica a cada segundo
}

let mainWindow;

app.whenReady().then(() => {
    exec('nodemon server.js', (err, stdout, stderr) => {
        if (err){
            console.error('Erro ao iniciar servidor: ', stderr);
            return;
        }
        console.log(stdout);
    });

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    waitForServer('http://localhost:3000', () => {
        mainWindow.loadURL(path.join(__dirname, 'public', 'index.html'));
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    })
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin'){
        app.quit();
    }
});
