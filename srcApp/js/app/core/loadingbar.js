/**
 * Created by Michel Costa S on 2/24/2016.
 * @Description: Configurador da barra de carregamento para o Bloo Project inteiro usando as Promises.
 */
angular
	.module('core')
	.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
		cfpLoadingBarProvider.includeSpinner = false;
	}]);
