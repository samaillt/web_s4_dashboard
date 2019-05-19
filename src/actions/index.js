import { location as router } from '@hyperapp/router'
const format = require('format-number');

const API_URL = "https://api.twitch.tv/kraken/"
const CLIENT_ID = "v4la970ztrif17s6tvu56zb1gyticw"

export default {
	location: router.actions,

	getTopData: () => (state,actions) => {
		console.log("getTopData actions", API_URL)
		console.log('actions',actions)
		actions.getTopGames()
		actions.getTopStreams()
		return {...state}
	},

	getTopGames: () => (state, actions) => {
		console.log("getTopGames actions", API_URL)

		const headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Client-ID': CLIENT_ID
		}

		const options = {
			method: 'GET',
			headers: headers,
			mode: 'cors',
			cache: 'default'
		}

		const response = fetch(API_URL + 'games/top?limit=5', options)
			.then(response => response.json())
			.catch(function(error) {
				console.log(error)
			})

		response.then((data) => {
			const games = data.top
			const newGames = games.map(g => ({
				...g,
				viewers_formated: format({integerSeparator: ' ', suffix: ' viewers'})(g.viewers) // Number formatting
			}))
			actions.setTopGames(newGames)
		})

		return {
			...state,
			topGamesLoading: true
		}
	},

	setTopGames: (payload) => {
		console.log("payload", payload)
		return (state) => ({
			...state,
			topGames: payload,
			topGamesLoading: false
		})
	},

	getTopStreams: () => (state, actions) => {
		console.log("getTopStreams actions", API_URL)
		const headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Client-ID': CLIENT_ID
		}

		const options = {
			method: 'GET',
			headers: headers,
			mode: 'cors',
			cache: 'default'
		}

		const response = fetch(API_URL + 'streams?limit=5', {
			headers,
			...options
		}).then(response => response.json())
			.catch(function(error) {
				console.log(error)
			});

		response.then((data) => {
			const streams = data.streams
			console.log('STREAMS', streams)
			const newStreams = streams.map(s => ({
				...s,
				viewers_formated: format({integerSeparator: ' ', suffix: ' viewers'})(s.viewers) // Number formatting
			}))
			actions.setTopStreams(newStreams)
		})

		return {
			...state,
			topStreamsLoading: true
		}
	},

	setTopStreams: (payload) => {
		console.log("payload", payload)
		return (state) => ({
			...state,
			topStreams: payload,
			topStreamsLoading: false
		})
	},

	getTopStreamsFromGame: (game) => (state, actions) => {
		console.log("getTopStreamsFromGame actions", API_URL)
		const headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Client-ID': CLIENT_ID
		}

		const options = {
			method: 'GET',
			headers: headers,
			mode: 'cors',
			cache: 'default'
		}

		const response = fetch(API_URL + 'streams?limit=5&game=' + game, {
			headers,
			...options
		}).then(response => response.json())
			.catch(function(error) {
				console.log(error)
			});

		response.then((data) => {
			const streams = data.streams.map(s => ({
				...s,
				viewers_formated: format({integerSeparator: ' ', suffix: ' viewers'})(s.viewers) // Number formatting
			}))
			const newStreams = {
				searchedGame:game,
				results:[...streams]
			}
			actions.setTopStreamsFromGame(newStreams)
		})

		return {
			...state,
			topStreamsFromGameLoading: true
		}
	},

	setTopStreamsFromGame: (payload) => {
		console.log("payload", payload)
		return (state) => ({
			...state,
			topStreamsFromGame: payload,
			topStreamsFromGameLoading: false
		})
	},

	setChannelValue: (value) => (state) => {
		return {
			...state,
			channelInput: {
				...state.channelInput,
				value
			}
		}
	},

	setComparedChannelValue: (value) => (state) => {
		return {
			...state,
			comparedChannelInput: {
				...state.comparedChannelInput,
				value
			}
		}
	},

	setChannel: (payload) => (state) => {
		return {
			...state,
			channelLoaded: true,
			channels: [
				payload
			]
		}
	},

	addChannel: (payload) => (state) => {
		return {
			...state,
			channelLoading: false,
			channels: [
				...state.channels,
				payload
			]
		}
	},

	resetChannel: () => (state) => {
		return {
			...state,
			channelLoaded: false,
			channels : []
		}
	},

	clearChannels: () => (state) => {
		return {
			...state,
			channels : [
				state.channels[0]
			]
		}
	},

	getChannelByName: () => (state, actions) => {
		const headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Client-ID': CLIENT_ID
		}

		const options = {
			method: 'GET',
			headers: headers,
			mode: 'cors',
			cache: 'default'
		}

		const response = fetch(API_URL + 'channels/' + state.channelInput.value, options)
			.then(response => response.json())
			.catch(function(error) {
				console.log(error)
			})

		response.then((data) => {
			"error" in data ? actions.resetChannel() : actions.setChannel(data)
		})
		return state
	},

	getComparedChannelByName: () => (state, actions) => {
		const headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Client-ID': CLIENT_ID
		}

		const options = {
			method: 'GET',
			headers: headers,
			mode: 'cors',
			cache: 'default'
		}

		const response = fetch(API_URL + 'channels/' + state.comparedChannelInput.value, options)
			.then(response => response.json())
			.catch(function(error) {
				console.log(error)
			})

		response.then((data) => {
			if (!("error" in data)) {
				actions.addChannel(data)
			}
		})

		return {
			...state,
			channelLoading: true
		}
	},

	searchGameValueUpdate: (value) => (state) => {
		return {
			...state,
			searchGame: {
				...state.searchGame,
				value: value
			}
		}
	},

	searchGameQuery: () => (state, actions) => {
		const headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Client-ID': CLIENT_ID
		}

		const options = {
			method: 'GET',
			headers: headers,
			mode: 'cors',
			cache: 'default'
		}

		const response = fetch(API_URL + 'search/games?type=suggest&query=' + state.searchGame.value, options)
			.then(response => response.json())
			.catch(function(error) {
				console.log(error)
			})

		response.then((data) => {
			actions.setSearchGamesResults(data.games)
		})

		return state
	},

	setSearchGamesResults: (payload) => (state) => {
		return {
			...state,
			searchGame: {
				...state.searchGame,
				results: payload
			}
		}
	},

	resetSearchedGames: () => (state) => {
		return {
			...state,
			searchGame: {
				...state.searchGame,
				results: []
			}
		}
	},
};