$(document).ready(function() {
  console.log("I'm main !")
  var contentNewSurvey = "<form action='#'> <div class='mdl-textfield mdl-js-textfield mdl-textfield--full-width mdl-textfield--floating-label'> <input class='mdl-textfield__input' type='text' name='nameNewSurvey'> <label class='mdl-textfield__label'>Nom du Sondage</label> </div> <div class='mdl-textfield mdl-js-textfield mdl-textfield--full-width mdl-textfield--floating-label'> <input class='mdl-textfield__input' type='text' name='content'> <label class='mdl-textfield__label'>Contenu (100 caractères max)</label> </div> <div class='mdl-textfield mdl-js-textfield mdl-textfield--full-width mdl-textfield--floating-label'> <input class='mdl-textfield__input' type='text' name='choice1'> <label class='mdl-textfield__label'>Choix 1 (Obligatoire)</label> </div> <div class='mdl-textfield mdl-js-textfield mdl-textfield--full-width mdl-textfield--floating-label'> <input class='mdl-textfield__input' type='text' name='choice2'> <label class='mdl-textfield__label'>Choix 2 (Obligatoire)</label> </div> <div class='mdl-textfield mdl-js-textfield mdl-textfield--full-width mdl-textfield--floating-label'> <input class='mdl-textfield__input' type='text' name='choice3'> <label class='mdl-textfield__label'>Choix 3 (Optionnel)</label> </div> <div class='mdl-textfield mdl-js-textfield mdl-textfield--full-width mdl-textfield--floating-label'> <input class='mdl-textfield__input' type='text' name='choice4'> <label class='mdl-textfield__label'>Choix 4 (Optionnel)</label> </div> <button type='submit' class='mdl-button mdl-js-button mdl-button--raised mdl-button--accent mdl-js-ripple-effect'>Envoyer</button> </form>"

  var contentLogin = "<form action='#'> <div class='mdl-textfield mdl-js-textfield mdl-textfield--full-width mdl-textfield--floating-label'> <input class='mdl-textfield__input' type='text' name='login'> <label class='mdl-textfield__label'>Nom</label> </div> <div class='mdl-textfield mdl-js-textfield mdl-textfield--full-width mdl-textfield--floating-label'> <input class='mdl-textfield__input' type='password' name='password'> <label class='mdl-textfield__label'>Mot de passe</label> </div> <button type='submit' class='mdl-button mdl-js-button mdl-button--raised mdl-button--accent mdl-js-ripple-effect'>Envoyer</button> </form>"

  $('#newSurvey').click(function(event) {event.preventDefault();swal({   title: "<h2 class='mdl-color-text--blue-800'>Ajouter un Sondage</h2>",text: contentNewSurvey,  animation: "slide-from-top", showConfirmButton: false ,html:true});});

  $('#login').click(function(event) {event.preventDefault();swal({   title: "<h2 class='mdl-color-text--blue-800'>Se Connecter</h2>",text: contentLogin,  animation: "slide-from-top", showConfirmButton: false ,html:true});});

});