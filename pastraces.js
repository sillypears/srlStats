//Global stuffs

var srlAPI = "http://api.speedrunslive.com"; 

function find_games(player) {
	var response = $.ajax({
		type : "GET",
        url : srlAPI + "/ratings/" + player,
        cache : false,
        async: false,
        dataType: 'json',
        }).responseText
    return JSON.parse(response);
};

function get_games(game, player, count) {
	var response = $.ajax({
		type : "GET",
        url : srlAPI + "/pastraces/?game=" + game+ "&player=" + player + "&pageSize=" + count,
        cache : false,
        async: false,
        dataType: 'json',
        }).responseText
    return JSON.parse(response);
};

function gup(name){
	name=name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS="[\\?&]"+name+"=([^&#]*)";
	var regex=new RegExp(regexS);
	var results=regex.exec(window.location.href);
	if(results==null) return "default"; else return results[1];
};

function display_time(seconds){
	if (seconds > 0) {
		var sec = Math.floor(seconds % 60);
		if (sec < 10) {
			sec = "0" + sec;
		}
		var min = Math.floor(seconds / 60);
		if (min < 10) {
			min = "0" + Math.floor(min);
		}
		if (min > 60) {
			var hour = Math.floor(min/60);
			min = Math.floor(min%60);
			if (min < 10) {
				min = "0" + Math.floor(min);
			}
			if (hour < 10){
				hour = "0" + Math.floor(hour);
			}
			return hour + ":" + min + ":" + sec
		} else {
			return min + ":" + sec 
		}
		
	}
}
$(document).ready( function(){
	player = gup('player');
	game = gup('game');
	var html = $("<select id='game' name='game'></select>");
	html.append("<option value=default>Select a game</option>");
	if (player != "default") {
		games = find_games(player);
		$.each(games, function(x, object){
			html.append("<option value=" +object.gameAbbrev+">"+object.gameName+"</option>");
			
		});

		$('#player').val(player);
		$(html).appendTo("#form");

		//$('#drop').append(html);
	}
	if (game != "default" && player != "default") {
		var html = $("<div id='stuff'></div>");
		var count = 0;
		count = get_games(game, player, count);
		if (count.count > 0) {
			var race_list = [];
			games = get_games(game, player, count.count);
			$.each(games.pastraces, function(x, races){
				$.each(races.results, function(y, results) {
					var race = [];
					if (results.player.toLowerCase() == player.toLowerCase()) {
						race["race_time"] = results.time;
						race["place"] = results.place;
						race["skill"] = results.newtrueskill;
						race["display_time"] = "00:00";
						if (results.time > 0) {
							race["display_time"] = display_time(results.time);
						}
				   		race_list[races.id] = race;
						
					}
				});
			});
			var complete = 0;
			var total_time = 0;
			for (var key in race_list) {

				if (race_list[key].place < 9994) {
					total_time += race_list[key].race_time;
					complete++;

				}
			}
			html = $("<table><tr><th>Stats for " + player + " in " + game + "</th></tr><tr><td>Completed "+ complete + " out of "+ count.count + " (" + Math.floor((complete / count.count) * 100) + "%) races with an avg time of " + display_time(Math.floor(total_time/complete)) + "</td></tr></table>");
			$('#first').html(html);	
		} else { 
			html.html("found nothing for " + player);
		}
		
	}

	
})
