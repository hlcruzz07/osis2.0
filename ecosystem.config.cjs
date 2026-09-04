module.exports = {
    apps: [
        {
            name: 'OSIS 2.0',
            script: '/opt/cpanel/ea-php83/root/usr/bin/php',
            interpreter: 'none',
            args: 'artisan queue:work --tries=3 --timeout=90',
            cwd: '/home/syndicateadmin/public_html/subdomains/osiss2.0',
            exec_mode: 'fork',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '200M',
        },
    ],
};
