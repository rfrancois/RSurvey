
console.log("I'm survey !");

function getMap() {
  $.ajax({
    url: window.location.href+".json",
    type: 'GET',
    dataType: 'json'
  })
  .done(function(e) {
    console.log("success");
    test = e;
    var dateSurvey = e[0].dQuestionDate.date;
    $('.navigateButton').click(function() {
      var isTrue = $(this).data().next;
      navigateButtons(isTrue,dateSurvey);
    });

    $("#titleSurvey").text(test[0].sQuestionLibel);

    $('#cloreSurveyButton').click(function(event) {
      console.log(e);
      cloreSurvey(e[0].iQuestionId);
    });

    createMap("centermap",e)
    sharingCreator(e[0].iQuestionId,e[0].sQuestionLibel);
  })
  .fail(function(e) {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });

}

function createMap(mapPosition,datas) {
  var iSubCode = datas[0].oSub;
  var zone = "zone"+iSubCode;
  var sQuestionLibel = datas[0].sQuestionLibel;
  var dataAjax = "ressources/data/"+zone+".geojson";
  var containerChoice = $("<div></div>").text(sQuestionLibel);
  var choices = $("<form action='#' class='survey-box'></form>");
  $(containerChoice).append(choices);
  datas[1].forEach(function(e,i){
    console.log(e)
    var button = $("<button data-ichoixid="+e.iChoixId+" class='mdl-button mdl-js-button mdl-button--raised mdl-button--accent mdl-js-ripple-effect answerButton answerButton"+i+"'></button>").text(e.sChoixLibel);
    $(choices).append(button);
  });

  var map = L.map(mapPosition,{
    dragging:false,
    touchZoom:true,
    doubleClickZoom:false,
    scrollWheelZoom:false,
    boxZoom:false,
    keyboard:false
  }).setView([46.5, 2.234], 6.5);
  var mapContent = new L.geoJson(null,{
    onEachFeature: onEachFeature,
    style: customStyle
  });
  function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.nom) {
    layer.on('click',function(){
        showDialog({
                title: feature.properties.nom,
                text:$(containerChoice).html(),
                negative: false,
                positive:false,
                onLoaded:function(e) {
                  $('.answerButton').click(function(e) {
                    e.preventDefault();
                    hideDialog($('#orrsDiag'));
                    console.log(this);
                    var iChoixIdValue = $(this).data().ichoixid;
                    var iSubCodeValue = feature.properties.code;
                    sendAnswer(iChoixIdValue,iSubCodeValue);
                  });
                }
              });
      })
    }
}

function customStyle(feature) {
  if(feature.properties && feature.properties.nom){
    var rgb = {};
    var total=0;
    $(datas[1]).each(function(i){
      if (typeof this.aReponse[feature.properties.code] !== "undefined") {
        console.log(this.aReponse[feature.properties.code]);
        rgb[this.aReponse[feature.properties.code].iChoixId] = parseInt(this.aReponse[feature.properties.code].iReponseVotes);
      }
    });


    var totalRgb = 0;
    var formatRgb = [];
    for(var i in rgb) { totalRgb += rgb[i]; }
    console.warn(totalRgb);
    $(datas[1]).each(function(i){
      if(typeof rgb[this.iChoixId] !== "undefined"){
        console.log(rgb[this.iChoixId]);
        formatRgb.push(Math.round(rgb[this.iChoixId]/totalRgb*255));
      }
      else {
        formatRgb.push(0);
      }
    });
    console.log(formatRgb);
    return {fillColor:"rgb("+formatRgb[0]+","+formatRgb[1]+","+formatRgb[2]+")",fillOpacity:1}
  }
}
  mapContent.addTo(map);
  $.ajax({
  dataType: "json",
  url: dataAjax,
  success: function(data) {
      $(data.features).each(function(key, data) {
        mapContent.addData(data);
      });
  }
  }).error(function() {});
}




var sendAnswer = function(c,s) {

  $.ajax({
    url: 'answer-question.html',
    type: 'POST',
    dataType: 'json',
    data: {iIdChoix:c,iSubCode:s}
  })
  .done(function(e) {
    console.log("success");
    console.log(e);
  })
  .fail(function(e) {
    console.log("error");
    console.log(e);

  })
  .always(function() {
    console.log("complete");
  });

}


var navigateButtons = function(data,date) {
  $.ajax({
    url: 'change-question.html',
    type: 'POST',
    dataType: 'json',
    data: {next: data,dDate:date}
  })
  .done(function(e) {
    console.log("success");
    console.log(e);
    window.location = "http://localhost/RSurvey/"+e[0].iQuestionId;
  })
  .fail(function(e) {
    console.log("error");
    console.log(e.responseText);

  })
  .always(function() {
    console.log("complete");
  });

}

var cloreSurvey = function(e) {
  console.log(e);
  $.ajax({
    url: 'close-question.html',
    type: 'POST',
    dataType: 'json',
    data: {iIdQuestion: e}
  })
  .done(function() {
    console.log("success");
    location.reload(true);
  })
  .fail(function(e) {
    console.log("error");
    console.log(e.responseText)
  })
  .always(function() {
    console.log("complete");
  });

}

var sharingCreator = function(url,sQuestionLibelValue) {
      $('#fab').click(function(event) {
        showDialog({
            title: "<span class='mdl-color-text--green-800'>Partager ce sondage !</span>",
            text: sharingGenerator(url,sQuestionLibelValue),
            negative: false,
            positive: {
                title: 'Retour'
            }
        });
      });
}

$(document).ready(function() {
  console.log(window.location.href)
  getMap();

});
