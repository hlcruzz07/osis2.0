module.exports = {
    apps: [
        {
            name: 'OSIS',
            script: 'artisan',
            interpreter: 'php',
            args: 'queue:work --tries=3 --timeout=90',
            exec_mode: 'fork',
            instances: 1, // Increase this to run multiple workers
            autorestart: true,
            watch: false,
            max_memory_restart: '200M',
        },
    ],
};
