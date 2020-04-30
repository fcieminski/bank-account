const path = require("path");

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/styles/_variables.scss";`
      }
    }
  },
  devServer: {
    proxy: "http://localhost:8081"
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@utils": path.resolve(__dirname, "src/components/utils"),
        "@services": path.resolve(__dirname, "src/services"),
        "@account": path.resolve(__dirname, "src/views/AccountViews")
      }
    }
  }
};
