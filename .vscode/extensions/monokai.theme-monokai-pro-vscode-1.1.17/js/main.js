const vscode = require('vscode');
const App = require('./app');

const app = new App.default(vscode);

exports['activate'] = function(extensionContext) {
	app.activate(extensionContext);
};

exports['deactivate'] = function() {
	app.deactivate();
};