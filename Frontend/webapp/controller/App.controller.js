sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/resource/ResourceModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (Controller, JSONModel, ResourceModel, MessageToast, MessageBox, tx, oView, rdBtn, pDate) {
	"use strict";

	return Controller.extend("sap.ui.cineplex.controller.App", {

		onInit: function () {

			//dotnet dev-certs https --trust

			tx = this;
			oView = this.getView();
			rdBtn = oView.byId("hoursGroup");
			pDate = oView.byId("dateTicket");
			oView.addStyleClass("sapUiSizeCompact");
			this.setViewModel();
			this.load()
		},


		load: function () {
			this.oUser.oData.loginAccepted = false;
			this.oUI.oData.editLogin = false;
			this.oUI.oData.noLoginAlert = false;
			this.oUI.oData.selectedMovie = false;
			this.oUI.oData.selectedDate = false;
			this.oUI.oData.selectedHour = false;

			this.oUI.oData.payment = [
				{
					key: "CTN",
					type: "Contanti"
				},
				{
					key: "STP",
					type: "Satispay"
				},
				{
					key: "PPL",
					type: "Paypal"
				},
				{
					key: "CARD",
					type: "Carta"
				}
			]
			this.oUI.refresh()
			this.oUser.refresh()
		},

		okLogin: function () {

			var oUsername = oView.byId("loginUser").getValue();
			var oPassword = oView.byId("loginPassword").getValue();;

			if (!oUsername || !oPassword) {
				MessageBox.alert("Inserire un nome utente e password");
				return;
			}

			var jsonData = new JSONModel({
				username: oUsername,
				password: oPassword
			});



			oView.setBusy(true);
			$.ajax(
				{
					method: "POST",
					url: "https://localhost:5001/api/Visitatore",
					data: JSON.stringify(jsonData.oData),
					dataType: "json",
					contentType: 'application/json',
					async: false,
					cache: false,
					success: function (result) {
						if (result != null) {
							tx.oUser.oData = result;
							MessageToast.show("Login effettuato.");
							tx.oUser.oData.loginAccepted = true;
							tx.oUser.refresh()
							tx.setMoviesModel();
							tx.setUserTicket();

						} else {
							MessageBox.alert("Nome utente o Password non trovati");
							return;
						}
					},
					complete: function () {
						oView.setBusy(false)

					}
				});
		},

		backLogin: function () {
			oView.byId("loginUser").setValue("")
			oView.byId("loginPassword").setValue("");
		},

		resetLogin: function () {
			this.oUser.oData = [];
			this.oUser.oData.loginAccepted = false;
			this.oUser.refresh();
			this.backLogin();
			this.backTicket();
		},


		selectedMovie: function (oEvent) {
			var oMovie = oEvent.getSource().data("data");

			var jsonData = new JSONModel({
				cod_film: oMovie.cod_film
			});


			oView.setBusy(true);
			$.ajax(
				{
					method: "POST",
					url: "https://localhost:5001/api/Film",
					data: JSON.stringify(jsonData.oData),
					dataType: "json",
					contentType: 'application/json',
					async: false,
					cache: false,
					success: function (result) {
						tx.oSelectedMovie.oData = result;
						tx.oSelectedMovie.oData.total = 0;
						tx.oSelectedMovie.oData.cod_film = oMovie.cod_film
						tx.oSelectedMovie.oData.titolo = oMovie.titolo
						tx.oSelectedMovie.oData.regista = oMovie.regista
						tx.oSelectedMovie.oData.provincia = oMovie.provincia
						tx.oSelectedMovie.oData.capienza = oMovie.capienza
						tx.oSelectedMovie.oData.data_inizio = new Date(tx.oSelectedMovie.oData.data_inizio);
						tx.oSelectedMovie.oData.data_fine = new Date(tx.oSelectedMovie.oData.data_fine);
					},
					complete: function () {
						oView.setBusy(false)

					}
				});

			this.oUI.oData.selectedMovie = true;
			this.oUI.oData.selectedDate = false;
			this.oUI.oData.selectedHour = false;
			pDate.setValue("");
			this.oSelectedMovie.refresh();
			this.oUI.refresh()
		},

		selectedDate: function (oEvent) {
			this.oSelectedMovie.oData.date = oEvent.getParameter("value");
			this.oUI.oData.selectedDate = true;
			this.oUI.refresh()
			rdBtn.setSelectedIndex(-1);
			this.oSelectedMovie.refresh();
		},

		selectedHour: function () {
			this.oSelectedMovie.oData.hour = rdBtn.getSelectedButton().getText();
			this.oUI.oData.selectedHour = true;
			this.oUI.refresh()
			this.oSelectedMovie.refresh();



			var jsonData = new JSONModel({
				cod_film: this.oSelectedMovie.oData.cod_film,
				hour: this.oSelectedMovie.oData.hour,
				date: this.oSelectedMovie.oData.date,
				space: this.oSelectedMovie.oData.capienza
			})

			oView.setBusy(true)
			$.ajax(
				{
					method: "POST",
					url: "https://localhost:5001/api/Biglietto/OccupiedPlaces",
					data: JSON.stringify(jsonData.oData),
					dataType: "json",
					contentType: 'application/json',
					async: false,
					cache: false,
					success: function (result) {
						tx.oSelectedMovie.oData.spazioLibero = result;
					},
					complete: function () {
						oView.setBusy(false)

					}
				});

			if (this.oSelectedMovie.oData.spazioLibero < (this.oSelectedMovie.oData.capienza / 2)) {
				this.oSelectedMovie.oData.spaceStatus = "Warning";
			} else if (this.oSelectedMovie.oData.spazioLibero < 5) {
				this.oSelectedMovie.oData.spaceStatus = "Error";
			} else {
				this.oSelectedMovie.oData.spaceStatus = "Success";
			}

			this.oSelectedMovie.refresh();
		},

		changeNTicket: function (oEvent) {

			var nTicket = oEvent.getParameter("value");
			var oPrice = Number.parseFloat(this.oSelectedMovie.oData.prezzo);

			if (nTicket != 0) {
				this.oSelectedMovie.oData.total = nTicket * oPrice;
				this.oSelectedMovie.oData.totalPz = nTicket;
			}
			this.oSelectedMovie.refresh();

		},

		okTicket: function () {

			var jsonTicket = new JSONModel({
				cod_visitatore: this.oUser.oData.cod_visitatore,
				ora_proiezione: this.oSelectedMovie.oData.hour,
				data: this.oSelectedMovie.oData.date,
				tipo_pagamento: this.oSelectedMovie.oData.payment,
				qta: this.oSelectedMovie.oData.totalPz,
				cod_film: this.oSelectedMovie.oData.cod_film,
			});

			if (!this.oSelectedMovie.oData.payment) {
				MessageBox.error("Inserire un tipo di pagamento per proseguire");
				return;
			}

			if (this.oSelectedMovie.oData.spazioLibero - this.oSelectedMovie.oData.totalPz <= 0) {
				MessageBox.error("Sala piena, non è possibile prenotare tutti biglietti per lo spettacolo");
				return;
			}

			oView.setBusy(true)
			$.ajax(
				{
					method: "POST",
					url: "https://localhost:5001/api/Biglietto/GetDuplicateTicket",
					data: JSON.stringify(jsonTicket.oData),
					dataType: "json",
					contentType: 'application/json',
					async: false,
					cache: false,
					success: function (result) {

						if (result != null) {
							MessageBox.error("Esiste già una tua prenotazione per questo spettacolo, controlla l'area personale");
							return;
						} else {
							tx.addTicket(jsonTicket)
						}
					},
					complete: function () {
						oView.setBusy(false)

					}
				});

		},

		addTicket: function (ticket) {

			oView.setBusy(true)
			$.ajax(
				{
					method: "POST",
					url: "https://localhost:5001/api/Biglietto",
					data: JSON.stringify(ticket.oData),
					dataType: "json",
					contentType: 'application/json',
					async: false,
					cache: false,
					success: function (result) {
						MessageToast.show("Prenotazione completata")
						tx.setUserTicket()
						tx.backTicket()
					},
					complete: function () {
						oView.setBusy(false)

					}
				});
		},

		backTicket: function () {
			oView.byId("dateTicket").setValue("");
			oView.byId("nrTicket").setValue("");
			oView.byId("hoursGroup").setSelectedIndex();
			this.oSelectedMovie.oData = []
			this.oUI.oData.selectedMovie = false;
			this.oSelectedMovie.refresh();
			this.oUI.refresh();
		},

		editLogin: function () {
			this.oUI.oData.editLogin = true;
			this.oUI.refresh();
		},

		okEditLogin: function () {


			var oUsername = oView.byId("editUsr").getValue();
			var oPassword = oView.byId("editPsw").getValue();

			if (!oUsername || !oPassword) {
				MessageBox.alert("Inserire un nome utente e password");
				return;
			}
			if (oPassword.length < 4) {
				MessageBox.alert("La password deve contenere almeno 4 caratteri");
				return;
			}

			this.oUser.oData.username = oUsername
			this.oUser.oData.password = oPassword
			this.noEditLogin()
		},

		noEditLogin: function () {
			this.oUI.oData.editLogin = false;
			this.oUI.refresh();
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
			this.oSelectedMovie = new JSONModel();
			this.oTemp = new JSONModel();

			oView.setModel(this.oUI, "UI");
			oView.setModel(this.oUser, "User");
			oView.setModel(this.oMovie, "Movies");
			oView.setModel(this.oSelectedMovie, "SelectedMovie");
			oView.setModel(this.oTemp, "Temp");
			oView.setModel(this.oStrings, "Strings");
		},

		setMoviesModel: function () {
			oView.setBusy(true)
			$.ajax(
				{
					method: "GET",
					url: "https://localhost:5001/api/Film",
					contentType: 'application/json',
					async: false,
					cache: false,
					success: function (result) {
						tx.oMovie.oData = result;
					},
					complete: function () {
						oView.setBusy(false)

					},
					error: function (e) {
						MessageBox.alert(e)
					}
				});

			this.oMovie.refresh();

		},

		setUserTicket: function () {

			var oUrl = "https://localhost:5001/api/Biglietto/" + this.oUser.oData.cod_visitatore;

			oView.setBusy(true)
			$.ajax(
				{
					method: "GET",
					url: oUrl,
					contentType: 'application/json',
					async: false,
					cache: false,
					success: function (result) {
						result.forEach(element => {
							element.data = new Date(element.data),
							element.tipo_pagamento = tx.setPaymentType(element.tipo_pagamento),
							element.editOn = false
						});

						tx.oUser.oData.tickets = result
						tx.oUser.refresh();
					},
					complete: function () {
						oView.setBusy(false)

					}
				});

		},

		setPaymentType: function (key) {
			var payType;

			this.oUI.oData.payment.forEach(pm => {
				if (pm.key == key) {
					payType = pm.type;
				}
			});

			return payType
		},


		editUserTicket:function(oEvent){
			var oTicket = oEvent.getSource().data("data");

			if(this.oTemp.oData.index != undefined){
				this.oUser.oData.tickets[this.oTemp.oData.index].qta = this.oTemp.oData.qta
			}

			this.oTemp.oData.index = oEvent.getParameter("row").getIndex();
			this.oTemp.oData.qta = oTicket.qta;
			oTicket.editOn = true;

			this.oUser.refresh();


		},

		updateUserTicket:function(oEvent){
			var oTicket = oEvent.getSource().data("data");

			var jsonData = new JSONModel({
				cod_operazione: oTicket.cod_operazione,
				qta: Number.parseInt(oTicket.qta)
			})

			oView.setBusy(true)
			$.ajax(
				{
					method: "PATCH",
					url: "https://localhost:5001/api/Biglietto",
					data: JSON.stringify(jsonData.oData),
					dataType: "json",
					contentType: 'application/json',
					async: false,
					cache: false,
					success: function (result) {
						MessageToast.show("Prenotazione aggiornata")
						tx.setUserTicket()
					},
					complete: function () {
						oView.setBusy(false)

					}
				});

		},

		deleteUserTicket:function(oEvent){
			var oTicket = oEvent.getSource().data("data");

			var oUrl = "https://localhost:5001/api/Biglietto/"+oTicket.cod_operazione;


			oView.setBusy(true)
			$.ajax(
				{
					method: "DELETE",
					url: oUrl,
					data: {},
					dataType: "json",
					contentType: 'application/json',
					async: false,
					cache: false,
					success: function (result) {
						MessageToast.show("Prenotazione eliminata")
						tx.setUserTicket()
					},
					complete: function () {
						oView.setBusy(false)

					}
				});

		},

		backUserTicket:function(oEvent){
			var oTicket = oEvent.getSource().data("data");

			if(this.oTemp.oData.index != undefined){
				this.oUser.oData.tickets[this.oTemp.oData.index].qta = this.oTemp.oData.qta
			}

			this.oTemp.oData = {}
			oTicket.editOn = false;
			this.oUser.refresh();
			this.oTemp.refresh();
		}



	});

});