import React, { useEffect, useState } from 'react'
import '../../public/cart.css'
import '../../public/general.css'
import '../../public/header.css'
import '../../public/ingame.css'

const OverlayComponent: React.FC = () => {
	const [participants, setParticipants] = useState<any[]>([])

	useEffect(() => {
		const closeButton = document.getElementById('closeButton')
		const header = document.getElementById('header')
		const hotkeyElement = document.getElementById('hotkey')

		if (header) {
			header.addEventListener('mousedown', () => {
				overwolf.windows.getCurrentWindow(result => {
					if (result.success) {
						overwolf.windows.dragMove(result.window.id)
					}
				})
			})
		}

		overwolf.settings.hotkeys.get(result => {
			if (result.success && result.games) {
				const hotkey = result.games['5426']?.find(
					hk => hk.name === 'show_hide_in_game'
				)
				if (hotkey && hotkey.binding && hotkeyElement) {
					hotkeyElement.textContent = hotkey.binding
				}
			}
		})

		const closeHandler = () => overwolf.windows.minimize('in_game')
		closeButton?.addEventListener('click', closeHandler)

		return () => {
			closeButton?.removeEventListener('click', closeHandler)
			if (header) {
				header.removeEventListener('mousedown', () => {
					overwolf.windows.getCurrentWindow(result => {
						if (result.success) {
							overwolf.windows.dragMove(result.window.id)
						}
					})
				})
			}
		}
	}, [])

	useEffect(() => {
		let interval: NodeJS.Timeout

		const pollGameState = async () => {
			try {
				const statsRes = await fetch(
					'https://127.0.0.1:2999/liveclientdata/gamestats'
				)
				if (!statsRes.ok) throw new Error('Game not live')

				if (participants.length === 0) {
					const nameRes = await fetch(
						'https://127.0.0.1:2999/liveclientdata/activeplayername'
					)
					const summonerFullName = await nameRes.text()
					const [name, tag] = summonerFullName.replace(/"/g, '').split('#')

					const backendRes = await fetch(
						`http://localhost:8080/account/${name}/${tag}`
					)
					const data = await backendRes.json()

					if (data?.currentGame?.participants) {
						setParticipants(data.currentGame.participants)
					}
				}
			} catch (err) {
				if (participants.length > 0) {
					setParticipants([])
				}
			}
		}

		interval = setInterval(pollGameState, 5000)

		return () => clearInterval(interval)
	}, [participants])

	const team100 = participants.filter(p => p.teamId === 100)
	const team200 = participants.filter(p => p.teamId === 200)

	return (
		<div className='overlay-container'>
			<div className='overlay-gradient' />

			<header id='header' className='app-header'>
				<h1>AbTracker</h1>
				<h1 className='hotkey-text'>
					Show/Hide Hotkey: <kbd id='hotkey'></kbd>
				</h1>
				<div className='window-controls-group'>
					<button
						id='closeButton'
						className='window-control window-control-close'
					/>
				</div>
			</header>

			<main className='cards-container'>
				<div className='team-column'>
					<div className='team-row'>
						{team100.map((p, index) => (
							<div className='card' key={index}>
								<div className='header'>{p.summonerName || 'UNKNOWN'}</div>

								<div className='champ-info'>
									<img
										className='champ-icon'
										src={`https://cdn.communitydragon.org/15.8.1/champion/${p.championName}/square`}
										alt={p.championName}
									/>
									<div className='champ-text'>
										<div>{p.championName}</div>
										<div>GAMES W/R</div>
										<div>
											Mastery: {p.mastery.level} ({p.mastery.points})
										</div>
									</div>
								</div>

								<div className='rank-section'>
									<img
										className='rank-icon'
										src={`../../public/img/ranks/${p.tier}.png`}
										alt={p.tier}
									/>
									<div className='rank-text'>
										{p.tier} {p.rank}
										<br />
										S25.S1 WR (GAMESPLAYED)
										<br />
										SERVER RANK
									</div>
								</div>

								<div className='roles'>MAIN ROLES: UNKNOWN</div>

								<div className='stats'>
									<div className='stats-item'>
										12H: 20
										<div className='tooltip-content'>
											<h4>Recent Matches</h4>
											<ul>
												{p.stats?.recentMatches?.map((match: any, i: any) => (
													<li key={i}>
														{match.champion}: {match.kda} ({match.mode})
													</li>
												))}
											</ul>
										</div>
									</div>

									<div className='stats-item'>
										LAST 20M WR
										<div className='tooltip-content'>
											<h4>Top Champions</h4>
											<ul>
												{p.stats?.topChampions?.map((champion: any, i: any) => (
													<li key={i}>
														{champion.champion}: {champion.winRate} (
														{champion.games} games)
													</li>
												))}
											</ul>
										</div>
									</div>
								</div>

								<div className='abilities'>
									{Object.entries(p.ability).map(([key, value]: any) => (
										<div className='ability' key={key}>
											<div className='ability-label'>{key.toUpperCase()}</div>
											<img
												className='ability-icon'
												src={`https://cdn.communitydragon.org/15.8.1/champion/${p.championName}/ability-icon/${key}`}
											/>
											<div className='tooltip-content'>
												<h4>{key.toUpperCase()} Description</h4>
												<p>{value}</p>
											</div>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</div>

				<div className='team-column team-200'>
					<div className='team-row'>
						{team200.map((p, index) => (
							<div className='card' key={index}>
								<div className='header'>{p.summonerName || 'UNKNOWN'}</div>

								<div className='champ-info'>
									<img
										className='champ-icon'
										src={`https://cdn.communitydragon.org/15.8.1/champion/${p.championName}/square`}
										alt={p.championName}
									/>
									<div className='champ-text'>
										<div>{p.championName}</div>
										<div>GAMES W/R</div>
										<div>
											Mastery: {p.mastery.level} ({p.mastery.points})
										</div>
									</div>
								</div>

								<div className='rank-section'>
									<img
										className='rank-icon'
										src={`../../public/img/ranks/${p.tier}.png`}
										alt={p.tier}
									/>
									<div className='rank-text'>
										{p.tier} {p.rank}
										<br />
										S25.S1 WR (GAMESPLAYED)
										<br />
										SERVER RANK
									</div>
								</div>

								<div className='roles'>MAIN ROLES: MID</div>

								<div className='stats'>
									<div className='stats-item'>
										<span>12H: {p.stats?.recentMatches?.length || 0}</span>
										<div className='tooltip'>
											<div className='tooltip-content'>
												<h4>Recent Matches</h4>
												<ul>
													{p.stats?.recentMatches?.map((match: any, i: any) => (
														<li key={i}>
															{match.champion}: {match.kda} ({match.mode})
														</li>
													))}
												</ul>
											</div>
										</div>
									</div>
									<div className='stats-item'>
										<span>LAST 20M WR</span>
										<div className='tooltip'>
											<div className='tooltip-content'>
												<h4>Top Champions</h4>
												<ul>
													{p.stats?.topChampions?.map(
														(champion: any, i: any) => (
															<li key={i}>
																{champion.champion}: {champion.winRate} (
																{champion.games} games)
															</li>
														)
													)}
												</ul>
											</div>
										</div>
									</div>
								</div>

								<div className='abilities'>
									{Object.entries(p.ability).map(([key, value]: any) => (
										<div className='ability' key={key}>
											<div className='ability-label'>{key.toUpperCase()}</div>
											<img
												className='ability-icon'
												src={`https://cdn.communitydragon.org/15.8.1/champion/${p.championName}/ability-icon/${key}`}
											/>
											<div className='tooltip-content'>
												<h4>{key.toUpperCase()} Description</h4>
												<p>{value}</p>
											</div>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</main>
		</div>
	)
}

export default OverlayComponent
