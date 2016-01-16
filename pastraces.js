//Global stuffs

var srlAPI = "http://api.speedrunslive.com"; 


function get_hash_args() {
    hashsplit = window.location.hash.substr(1).split(',');
    if (hashsplit[0]=='') return false;
    return hashsplit;
}

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

function print_response(data) {
	var race_list = [];
	$.each(data.pastraces, function (x, object) {
		$.each(object.results, function(y, results) {
			var race = [];
			if (results.player == player) {
				race["race_time"] = results.time;
				race["place"] = results.place;
				race["display_time"] = "00:00";
				if (results.time > 0) {
					sec = Math.floor(results.time % 60);
					if (sec < 10) {
						sec = "0" + sec;
					}
					min = Math.floor(results.time / 60);
					if (min < 10) {
						min = "0" + Math.floor(min);
					}
				    race["display_time"] = min + ":" + sec;
				}
				race["skill"] = results.newtrueskill;
			race_list[object.id] = race;

			}
			
		});
		//if (object.game.abbrev == current_game && object.statetext == "In Progress") {
		//if (object.state == "1" || object.state == "2" || object.state == "3") {
		//	if ((object.game.abbrev == current_game)) {
				//race_list[object.id] = object;
			//} else if (current_game == 'default') {
			//} else if (object.game.abbrev == current_game) {
			//	race_list[object.id] = object;
			//} else {
			//	race_list[object.id] = object;
			//}
	});
console.log(race_list);	

	//console.log(race_list);
}
function display_time(seconds){
	if (seconds > 0) {
		sec = Math.floor(seconds % 60);
		if (sec < 10) {
			sec = "0" + sec;
		}
		min = Math.floor(seconds / 60);
		if (min < 10) {
			min = "0" + Math.floor(min);
		}
		return min + ":" + sec 
	}
}
$(document).ready( function(){
	player = gup('player');
	game = gup('game');
	console.log(player + " " + game);
	var html = $("<select id='game' name='game'></select>");
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
		console.log("hi from both");
		var count = 0;
		count = get_games(game, player, count);
		if (count.count > 0) {
			var race_list = [];
			games = get_games(game, player, count.count);
			$.each(games.pastraces, function(x, races){
				$.each(races.results, function(y, results) {
					var race = [];
					if (results.player == player) {
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
			html = $("<div>Completed "+ complete + " out of "+ count.count + " races with an avg time of " + display_time(Math.floor(total_time/complete)) + "</div>");
			$('#first').html(html);	
		} else {
			html.html("found nothing");
		}
		
	}

	
})