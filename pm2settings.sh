{
    "pm2-logrotate": {
        "max_size": "300M",
        "retain": "5",
        "compress": false,
        "dateFormat": "YYYY-MM-DD_HH-mm-ss",
        "workerInterval": "600",
        "rotateInterval": "0 0 * * *",
        "rotateModule": true
    },
    "module-db-v2": {
        "pm2-logrotate": {}
    },
    "pme-logrotate": {
        "workerInterval": "600"
    }
}
