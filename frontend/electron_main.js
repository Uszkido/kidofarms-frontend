const { app, BrowserWindow, Menu, shell, Notification } = require('electron');
const path = require('path');

let mainWindow;

function createKidoWindow() {
    mainWindow = new BrowserWindow({
        width: 1440,
        height: 900,
        minWidth: 1024,
        minHeight: 768,
        backgroundColor: '#0A150B',
        title: 'Kido OS v5.2 Management Platform',
        icon: path.join(__dirname, 'public/logo.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        },
        frame: true,
        titleBarStyle: 'hiddenInset'
    });

    mainWindow.loadURL('https://kidofarms.vercel.app');

    new Notification({
        title: 'Kido OS Node Initialized',
        body: 'Management console securely synchronized with main network registry.'
    }).show();

    const template = [
        {
            label: 'Kido OS',
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services' },
                { role: 'hide' },
                { role: 'quit' }
            ]
        },
        {
            label: 'Network',
            submenu: [
                { label: 'Sync Registry', click: () => mainWindow.reload() },
                { label: 'Cloud Terminal', click: () => shell.openExternal('https://vercel.com') },
                { label: 'Database Oracle', click: () => shell.openExternal('https://console.neon.tech') }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', createKidoWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createKidoWindow();
    }
});
