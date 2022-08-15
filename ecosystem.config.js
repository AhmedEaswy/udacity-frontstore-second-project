module.exports = {
    apps: [
        {
            name: "frontstore",
            script: './dist/index.js',
            cwd: 'E:/A/udacity-frontstore',
            max_memory_restart: '1G',
            exec_mode: 'fork',
            interpreter: "node",
            instances: 1,
            restart_delay: 3000,
            error_file: "./logs/app.err.log",
            out_file: "./logs/app.out.log",
            watch: true,
        },
    ],
};
