export const kGamesFeatures = new Map<number, string[]>([
	[
	  10902,
	  [
		'game_flow',
		'summoner_info',
		'champ_select',
		'lobby_info',
		'end_game',
		'lcu_info',
		'game_info',
		'clash'
	  ]
	],
	[
	  5426,
	  [
		'live_client_data',
		'matchState',
		'match_info',
		'death',
		'respawn',
		'abilities',
		'kill',
		'assist',
		'gold',
		'minions',
		'summoner_info',
		'gameMode',
		'teams',
		'level',
		'announcer',
		'counters',
		'damage',
		'heal'
	  ]
	],
  ]);
  
export const kGameClassIds = Array.from(kGamesFeatures.keys());

export const kWindowNames = {
	inGame: 'in_game',
	desktop: 'desktop'
};

export const kHotkeys = {
	toggle: 'sample_app_ts_showhide'		
};
  