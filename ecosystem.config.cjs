module.exports = {
    apps: [
        {
            name: 'OSIS 2.0',
            script: '/opt/cpanel/ea-php83/root/usr/bin/php',
            interpreter: 'none',
            args: 'artisan queue:work --queue=default --tries=3 --timeout=90',
            cwd: '/home/syndicateadmin/public_html/subdomains/osiss2.0',
            exec_mode: 'fork',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '200M',
        },
        {
            name: 'OSIS Legacy Sync',
            script: '/opt/cpanel/ea-php83/root/usr/bin/php',
            interpreter: 'none',
            args: 'artisan queue:work --queue=legacy-sync --tries=5',
            cwd: '/home/syndicateadmin/public_html/subdomains/osiss2.0',
            exec_mode: 'fork',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '200M',
        },
    ],
};
