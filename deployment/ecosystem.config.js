// ! name must be same as sink-id post relayer::
// e.g. relayer::withdraw_queue => withdraw_queue
// Else monitor wont work.

module.exports = {
  apps: [
    {
      name: "withdraw_queue",
      script: "/root/.local/share/apibara/bin/apibara",
      args: [
        "run",
        "--allow-env=.env",
        "src/indexers/withdraw_queue/withdrawQueue.ts",
        "--sink-id=relayer::withdraw_queue",
        "--status-server-address=0.0.0.0:4140"
      ],
      cwd: "/app",
      instances: 1,
      autorestart: true,
      watch: false,
      interpreter: "none",
    },
    {
      name: "blocks",
      script: "/root/.local/share/apibara/bin/apibara",
      args: [
        "run",
        "--allow-env=.env",
        "src/indexers/lst/blocks.ts",
        "--sink-id=relayer::blocks",
        "--status-server-address=0.0.0.0:4150"
      ],
      cwd: "/app",
      instances: 1,
      autorestart: true,
      watch: false,
      interpreter: "none",
    },
    {
      name: "users",
      script: "/root/.local/share/apibara/bin/apibara",
      args: [
        "run",
        "--allow-env=.env",
        "src/indexers/lst/users.ts",
        "--sink-id=relayer::users",
        "--status-server-address=0.0.0.0:4160"
      ],
      cwd: "/app",
      instances: 1,
      autorestart: true,
      watch: false,
      interpreter: "none",
    },
    // Commented out as it was disabled in supervisord
    // {
    //   name: "depositWithReferral2", // must match sink-id post relayer::
    //   script: "/root/.local/share/apibara/bin/apibara",
    //   args: [
    //     "run",
    //     "--allow-env=.env",
    //     "src/indexers/lst/depositWithReferral.ts",
    //     "--sink-id=relayer::depositWithReferral2",
    //     "--status-server-address=0.0.0.0:4170"
    //   ],
    //   cwd: "/app",
    //   instances: 1,
    //   autorestart: true,
    //   watch: false,
    //   interpreter: "none",
    // },
    {
      name: "ekubo::positions",
      script: "/root/.local/share/apibara/bin/apibara",
      args: [
        "run",
        "--allow-env=.env",
        "src/indexers/external/ekubo.positions.ts",
        "--sink-id=relayer::ekubo::positions",
        "--status-server-address=0.0.0.0:4180"
      ],
      cwd: "/app",
      instances: 1,
      autorestart: true,
      watch: false,
      interpreter: "none",
    },
    {
      name: "ekubo::nfts",
      script: "/root/.local/share/apibara/bin/apibara",
      args: [
        "run",
        "--allow-env=.env",
        "src/indexers/external/ekubo.nfts.ts",
        "--sink-id=relayer::ekubo::nfts",
        "--status-server-address=0.0.0.0:4190"
      ],
      cwd: "/app",
      instances: 1,
      autorestart: true,
      watch: false,
      interpreter: "none",
    },
  ],
};
