const path = require('path');

module.exports = {
    outputDir: path.resolve(__dirname, './dist'),

    devServer: {
		proxy: 'http://localhost:3000',
	},

    pluginOptions: {
      i18n: {
        locale: 'pl',
        fallbackLocale: 'en',
        localeDir: 'locales',
        enableLegacy: true,
        runtimeOnly: false,
        compositionOnly: true,
        fullInstall: true
      }
    }
};
