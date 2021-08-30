sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/resource/ResourceModel",
	"sap/ui/core/Fragment",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (Controller, JSONModel, ResourceModel, Fragment, MessageToast, MessageBox, oView) {
	"use strict";

	return Controller.extend("sap.ui.cineplex.controller.App", {

		onInit: function () {
			oView = this.getView()
			oView.addStyleClass(sap.ui.Device.support.touch ? "sapUiSizeCozy" : "sapUiSizeCompact");

			this.setViewModel();
			this.setMoviesModel();
			this.loadUi()
		},

		setViewModel: function () {
			this.oStrings = new ResourceModel({
				bundleUrl: "i18n/i18n.properties",
				fallbackLocale: "it",
				supportedLocales: [
					"en",
					"it"
				]
			});

			this.oUser = new JSONModel();
			this.oUI = new JSONModel();
			this.oMovie = new JSONModel();

			oView.setModel(this.oUI, "UI");
			oView.setModel(this.oUser, "User");
			oView.setModel(this.oMovie, "Movies");
			oView.setModel(this.oStrings, "Strings");
		},

		loadUi: function () {
			this.oUser.oData.loginAccepted = false;
			this.oUI.oData.noLoginAlert = false;
			this.oUI.refresh()
			this.oUser.refresh()

		},

		setMoviesModel: function () {

			// $.ajax({
			// 	url: "",
			// 	type: 'POST',
			// 	data:{},
			// 	contentType: '',
			// 	success: function(data){
			// 		console.log("success"+data);
			// 	},
			// 	error: function(e){
			// 		console.log("error: "+e);
			// 	}
			//   });

			this.oMovie.oData = [
				{
					title: "The Suicide Squad – Missione suicida",
					director: "James Gunn",
					year: "2021",
					genre: "Supereroi, Azione, Commedia",
					validFrom: "2021-08-05",
					validTo: "2021-08-30",
					image: "https://pad.mymovies.it/cinemanews/2021/175076/locandina-ver.jpg",
				},
				{
					title: "Fast & Furious 9 - The Fast Saga",
					director: "Justin Lin",
					year: "2021",
					genre: "Azione, Commedia",
					validFrom: "2021-08-15",
					validTo: "2021-09-15",
					image: "https://pad.mymovies.it/filmclub/2017/10/059/locandinapg2.jpg",
				},
				{
					title: "OLD",
					director: "M. Night Shyamalan",
					year: "2021",
					genre: "Thriller",
					validFrom: "2021-07-10",
					validTo: "2021-07-30",
					image: "https://pad.mymovies.it/filmclub/2020/05/015/locandina.jpg",
				},
				{
					title: "I Croods 2 - Una nuova era",
					director: "Kirk De Micco, Chris Sanders, Joel Crawford",
					year: "2020",
					genre: "Animazione, Avventura, Commedia",
					validFrom: "2021-07-21",
					validTo: "2021-08-10",
					image: "https://pad.mymovies.it/filmclub/2019/11/319/locandina.jpg",
				},
				{
					title: "Me Contro te - Il mistero della scuola incantata",
					director: "Gianluca Leuzzi",
					year: "2021",
					genre: "Commedia",
					validFrom: "2021-08-01",
					validTo: "2021-09-15",
					image: "https://pad.mymovies.it/filmclub/2021/06/165/locandina.jpg",
				},
				{
					title: "Jungle Cruise",
					director: "Jaume Collet-Serra",
					year: "2021",
					genre: "Avventura",
					validFrom: "2021-07-28",
					validTo: "2021-08-10",
					image: "https://pad.mymovies.it/filmclub/2018/07/051/locandina.jpg",
				}

			]

			this.oMovie.refresh();

		},

		openLoginDialog: function () {

			if (!this.pLoginDialog) {
				this.pLoginDialog = Fragment.load({
					id: oView.getId(),
					name: "sap.ui.cineplex.view.Login",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}
			this.pLoginDialog.then(function (oDialog) {
				oDialog.open();
			});
		},

		okLoginDialog: function () {

			var oUsername = oView.byId("loginUser").getValue();
			var oPassword = oView.byId("loginPassword").getValue();;

			if (!oUsername) {
				MessageBox.alert("Inserire un nome utente");
				return;
			}
			if (!oPassword) {
				MessageBox.alert("Inserire una password");
				return;
			}

			// $.ajax({
			// 	url: "",
			// 	type: 'POST',
			// 	data: {},
			// 	contentType: 'application/x-www-form-urlencoded',
			// 	success: function (data) {
			// 		console.log("success" + data);
			// 	},
			// 	error: function (e) {
			// 		console.log("error: " + e);
			// 	}
			// });

			MessageToast.show("Login effettuato.");
			this.backLoginDialog()
			this.oUser.oData.loginAccepted = true;
			this.oUser.refresh();

		},

		backLoginDialog: function () {
			oView.byId("loginUser").setValue("")
			oView.byId("loginPassword").setValue("");
			this.pLoginDialog.then(function (oDialog) {
				oDialog.close();
			});
		},

		resetLogin: function () {
			this.oUser.oData = [];
			this.oUser.oData.loginAccepted = false;
			this.oUser.refresh();
		}
	});

});