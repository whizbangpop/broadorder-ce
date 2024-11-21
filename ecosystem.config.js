module.exports = {
    apps : [{
      name :"broadorder-ce",
      script : "vite --host",
      error_file : "./pm2-error.log",
      out_file : "./pm2-out.log",
    }]
  }