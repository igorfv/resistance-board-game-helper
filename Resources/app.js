var settings = {
	'status': false,
	'step': 0,
	'time': 2 * 1000,
	'modes' : [],
	'players' : [],
	'playlist' : {
		'modes' : [],
		'players' : []
	},
	'audioPlayer' : null,
	'timeout' : null
};

var availableModes = [
	{name: "Comandante", action: 'commander'},
	{name: "Guarda Costa", action: 'bodyguard'}
];

var availablePlayers = [
	{name: "Básico", action: 'basic'},
	{name: "Educado", action: 'polite'},
	{name: "André", action: 'andre'},
	{name: "Cris", action: 'cris'},
	{name: "Moisés", action: 'moises'},
	{name: "Pedrito", action: 'pedrito'},
	{name: "Roni", action: 'roni'}
];

var settingsWindow = Titanium.UI.createWindow({
	fullscreen: true,
	navBarHidden:true,
	backgroundColor: 'white'
});

// Title
var settingsTitleView = Ti.UI.createView({
	top: 0,
	height: '10%',
	layout: 'horizontal',
	backgroundColor: '#A00'
});
settingsWindow.add(settingsTitleView);

var settingsLabel = new Ti.UI.createLabel({
    text:'LA RESISTENCIA',
    width:'100%',
    height: '100%',
    color: '#FFF',
    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
    verticalAlign: Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
    font: {
    	fontSize:30,
    	fontWeight: 'bold'
    }
});
settingsTitleView.add(settingsLabel);

// Scroll
var settingsScrollView = Ti.UI.createScrollView({
  height: '80%',
  width: '95%',
  showVerticalScrollIndicator: true
});
settingsWindow.add(settingsScrollView);

var settingsScrollContainerView = Ti.UI.createView({
	height: 50 + (availableModes.length * 50) + 50 + (availablePlayers.length * 50),
	layout: 'vertical'
});
settingsScrollView.add(settingsScrollContainerView);


// Containers
var settingsCardsView = Ti.UI.createView({
	height: 50 + (availableModes.length * 50),
	layout: 'vertical'
});
settingsScrollContainerView.add(settingsCardsView);

var settingsPlayersView = Ti.UI.createView({
	height: 50 + (availablePlayers.length * 50),
	layout: 'vertical'
});
settingsScrollContainerView.add(settingsPlayersView);


// Cards
var settingsCardsLabel = new Ti.UI.createLabel({
    text:'Cartas especiais',
    top: 20,
    width:'100%',
    color: '#666',
    textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
    font: {
    	fontSize:16,
    	fontWeight: 'bold'
    }
});
settingsCardsView.add(settingsCardsLabel);

availableModes.forEach(function(val, key) {
	var cardButton = Titanium.UI.createButton({
		title: val.name,
		backgroundColor: '#ddd',
		top: 10,
		width: '100%',
		height: 40
	});
	settingsCardsView.add(cardButton);
	
	(function(cardButton){
		cardButton.addEventListener('click',function(e)
		{
		   setCardButton(cardButton, val);
		});
	})(cardButton);

});

// Players
var settingsPlayersLabel = new Ti.UI.createLabel({
    text:'Falas especiais dos jogadores',
    top: 20,
    width:'100%',
    color: '#666',
    textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
    font: {
    	fontSize:16,
    	fontWeight: 'bold'
    }
});
settingsPlayersView.add(settingsPlayersLabel);

availablePlayers.forEach(function(val, key) {
	var playerButton = Titanium.UI.createButton({
		title: val.name,
		backgroundColor: '#ddd',
		top: 10,
		width: '100%',
		height: 40
	});
	settingsPlayersView.add(playerButton);
	
	(function(playerButton){
		playerButton.addEventListener('click',function(e)
		{
		   setPlayerButton(playerButton, val);
		});
	})(playerButton);

});


// Buttons
var settingsButtonsView = Ti.UI.createView({
	bottom: 0,
	height: '10%',
	backgroundColor: '#000'
});
settingsWindow.add(settingsButtonsView);

var playButton = Titanium.UI.createButton({
   title: 'PLAY',
   width: '90%',
   height: '90%'
});
settingsButtonsView.add(playButton);

playButton.addEventListener('click',function(e)
{
   setButtonAction();
});


settingsWindow.open();




// FUNCTIONS

// Add remove
var setCardStyle = function(button, active) {
	if(active) {
		button.backgroundColor = '#8A8';
	}
	else
	{
		button.backgroundColor = '#ddd';
	}
};

var toggleInArray = function(item, arrName) {
	var index = settings[arrName].indexOf(item.action);
	
	if(index >= 0) {
		settings[arrName].splice(index, 1);
		return false;
	}
	else
	{
		settings[arrName].push(item.action);
		return true;
	}
};

var setCardButton = function(button, card) {
	var active = toggleInArray(card, 'modes');
	setCardStyle(button, active);
};

var setPlayerButton = function(button, player) {
	var active = toggleInArray(player, 'players');
	setCardStyle(button, active);
};



// Audio

var setButtonAction = function(forceDeactive) {
	if(settings.status || forceDeactive){
		settings.status = false;
		playButton.title = "PLAY";
		
		if(settings.audioPlayer && settings.audioPlayer.stop) {
			settings.audioPlayer.stop();
		}
		
		clearTimeout(settings.timeout);
	}
	else
	{
		settings.status = true;
		playButton.title = "STOP";
		playPlaylist();
	}
};

var playPlaylist = function() {
	buildPlaylistSequence();
	buildPlaylistPlayers();
	
	settings.step = 0;
	
	playlistPlayNext();
};

var playlistPlayNext = function(){
	if(!settings.status){
		return;
	};
	
	var url = [
		"audio_source",
		settings.playlist.modes[settings.step],
		settings.playlist.players[parseInt(Math.random() * settings.playlist.players.length)]
	];
	
	var player = Ti.Media.createSound({
		url: url.join('/') + ".mp3"
	});
	player.play();
	
	player.addEventListener('complete',function(e)
	{
		settings.step++;
		
		if(!settings.playlist.modes[settings.step]) {
			return setButtonAction(true);
		}
		else
		{
			settings.timeout = setTimeout(playlistPlayNext, settings.time);			
		}
	});
	
	settings.audioPlayer = player;
};

var buildPlaylistSequence = function() {
	settings.playlist.modes = [
		'all_close_eyes',
		'spies_open_eyes',
		'spies_close_eyes'
	];
	
	if(settings.modes.indexOf('commander') >= 0 && settings.modes.indexOf('bodyguard') < 0) {
		settings.playlist.modes.push('commander_open_eyes');
		settings.playlist.modes.push('commander_close_eyes');
	}
	
	if(settings.modes.indexOf('bodyguard') >= 0) {
		settings.playlist.modes.push('commander_open_eyes');
		settings.playlist.modes.push('commander_close_eyes');
		settings.playlist.modes.push('bodyguard_open_eyes');
		settings.playlist.modes.push('bodyguard_close_eyes');
	}
	
	settings.playlist.modes.push('all_open_eyes');
};

var buildPlaylistPlayers = function() {
	settings.playlist.players = [];
	
	if(settings.players.length < 1) {
		settings.playlist.players = ['basic', 'polite'];		
	}
	
	settings.players.forEach(function(val, key){
		settings.playlist.players.push(val);
	});
};