# cody-music

Cody Music is an open source package designed to help you perform Mac iTunes and Spotify Web API playback functionality

## Player control support

-   Mac Spotify and iTunes desktop
-   Spotify Web

## Spotify web API support

-   Fetching Spotify audio features
-   Playlists
    (create, delete, fetch playlist tracks, replace playlist tracks)
-   Genre search (Recently updated to return highest frequency Spotify Genre)
-   Fetching Spotify devices
-   Access token refresh retry
-   Track recommendations from Spotify
-   Add and remove to the Liked playlist
-   Prevents adding duplicate playlists by name
-   Follow or unfollow a playlist
-   Spotify Recommendations

## iTunes API support

-   Genre search

## Installation

```
npm

$ npm install cody-music --save

yarn

$ yarn add cody-music
```

## Running unit tests

```
$ npm test
```

Load the module

```javascript
import {
    getRunningTrack,
    Track,
    PlayerType,
    TrackStatus,
    setConfig } from "cody-music";

...

// update the CodyMusic spotify credentials and other settings
setConfig({
    spotifyAccessToken: <spotify_access_token>,
    spotifyRefreshToken: <spotify_refresh_token>;
    spotifyClientSecret: <spotify_client_secret>;
    spotifyClientId: <spotify_client_id>;
    enableItunesDesktop: <enable_itunes_desktop_track_lookup>;
    enableSpotifyDesktop: <enable_spotify_desktop_track_lookup>;
    enableSpotifyApi: <enable_spotify_api>;
});

const track:Track = await getRunningTrack();

if (track.state === TrackStatus.Playing) {
    // track is playing
}

if (track.playerType === PlayerType.WebSpotify) {
    // track running has been identified as your spotify web player
}

```

OR

```javascript
import * as CodyMusic from "cody-music";
```

OR

```javascript
const CodyMusic = require("cody-music");
```

## API

### playTrack(uri)

Play a track with Music URI `uri`.

Specify either "Spotify" or "iTunes" (case-insensitive).

```javascript
// get the track info using get state
await CodyMusic.getRunningTrack().then((track: Track) => {
    // returns the Track data
});

// play a specific spotify track
await CodyMusic.playTrack(
    "spotify",
    "spotify:track:2YarjDYjBJuH63dUIh9OWv"
).then((result) => {
    // track is playing
});

// play an iTunes track number
await CodyMusic.playTrack("itunes", 1).then((result) => {
    // track is playing
});

// handling errors
await CodyMusic.playTrack("spotify", 1000000000).then((result) => {
    // result will contain the "error" attribute with the error message
    if (result.error) {
        console.log(`Unable to play track, error: ${result.error}`);
    }
});
await CodyMusic.getRunningTrack().then((result) => {
    // result will be the best effort track that is playing.
    // i.e. if you have your itunes app running, it would show you that track
});
```

Full set of APIs

```js
/**
 * Initialize/set music credentials and settings
 * @param config <CodyConfig>
 */
setConfig(config: CodyConfig)

/**
 * Valid types are: album, artist, playlist, and track
 * keywords: send the keywords to search against.
 * Use specific filter name if you want to search against certain
 * fields.
 * Example searchTracks("track:what a time artist:tom")
 * If you use track and artist and internally it doesn't return a match,
 * it will search again with only the track part of the query.
 *
 * @param string
 * @param limit (min of 1 and a max of 50)
 */
searchTracks(keywords: string, limit: number = 50)

/**
 * Valid types are: album, artist, playlist, and track
 * keywords: send the keywords to search against.
 * Use specific filter name if you want to search against certain
 * fields.
 * Example searchTracks("track:what a time artist:tom")
 *
 * @param string
 * @param limit (min of 1 and a max of 50)
 */
searchArtists(keywords: string, limit: number = 50)

/**
 * Returns true if the user has granted Mac OS access for iTunes control
 */
isItunesAccessGranted()

/**
 * Set this if you would like a general flag itunes is not supported,
 * but you will also need to set isItunesDesktopSongTrackingEnabled
 * to the same value if you want to ensure it's not returning itunes songs.
 *
 * Returns false if cody music has been configured to to disable it
 * or if it's the OS is not Mac,
 * otherwise it's set to true by default
 */
isItunesDesktopEnabled()

/**
 * This will allow or disallow song tracking.
 * Returns false if cody music has been configured to to disable it
 * or if it's the OS is not Mac,
 * otherwise it's set to true by default
 */
isItunesDesktopSongTrackingEnabled()

/**
 * Get the Spotify accessToken provided via through the setConfig api
 * @returns {string} the spotify access token string
 */
getSpotifyAccessToken()

/**
 * Returns false if cody music has been configured to to disable it,
 * otherwise it's set to true by default
 */
isSpotifyDesktopEnabled()

/**
 * Checks if the Spotify desktop or web player is running or not
 * @returns {Promise<boolean>}
 */
isSpotifyRunning()

/**
 * Checks if the iTunes desktop player is running or not
 * @returns {Promise<boolean>}
 */
isItunesRunning()

/**
 * Checks if one of the specified players is running
 * @param player {spotify|spotify-web|itunes}
 * @returns {Promise<boolean>}
 */
isPlayerRunning(player: PlayerName)

/**
 * Returns whether there's an active track,
 * (spotify web, spotify desktop, or itunes desktop)
 * @returns {Promise<boolean>}
 */
hasActiveTrack(): Promise<boolean>

/**
 * Returns the recommended tracks for the
 * @param trackIds (optional) track IDs or URIs (5 max)
 * @param limit (optional) will default to 40 if not specified
 * @param market (optional) will default to none if not specified
 * @param min_popularity (optional) will default to a min or 20
 * @param target_popularity (optional) will default to 100
 * @param seed_genres (optional) the supported spotify genres (5 max)
 * @param seed_genres (optional) artist IDs or URIs (5 max)
 * @param features (optional) supports the tunable track attributes using min_*, max_*, and target_*
 *   i.e. {max_valence: 0.3, target_valence: 0.1}
 */
getRecommendationsForTracks(
    trackIds: string[] = [],
    limit: number = 40,
    market: string = "",
    min_popularity: number = 20,
    target_popularity: number = 100,
    seed_genres: string[] = [],
    seed_artists: string[] = [],
    features: any = {}
): Promise<Track[]> {

/**
 * Returns the currently running track.
 * Spotify web, desktop, or itunes desktop.
 * If it finds a spotify device but it's not playing, and mac iTunes is not playing
 * or paused, then it will return the Spotify track.
 * It will return an empty Track object if it's unable to
 * find a running track.
 * @returns {Promise<Track>}
 **/
getRunningTrack(): Promise<Track>

/**
 * Fetch the recently played spotify tracks
 * @param limit
 */
getSpotifyRecentlyPlayedTracks(limit: number): Promise<Track[]>

/**
 * Fetch the spotify player context
 * Info about the device, is playing state, etc.
 */
getSpotifyPlayerContext(): Promise<PlayerContext>

/**
 * Returns a track by the given spotify track id
 * @param id
 * @param includeFullArtistData (optional - if true it will return full artist info)
 * @package includeAudioFeaturesData (optional)
 * @param includeGenre (optional)
 */
getSpotifyTrackById(
    id: string,
    includeFullArtistData: boolean = false,
    includeAudioFeaturesData: boolean = false,
    includeGenre: boolean = false
): Promise<Track>

/**
 * Returns tracks by the given spotify track ids
 * @param ids
 * @param includeFullArtistData (optional - if true it will return full artist info)
 * @package includeAudioFeaturesData (optional)
 * @param includeGenre (optional)
 */
export async function getSpotifyTracks(
    ids: string[],
    includeFullArtistData: boolean = false,
    includeAudioFeaturesData: boolean = false,
    includeGenre: boolean = false
): Promise<Track[]>

/**
 * Returns the track of a given player {spotify|spotify-web|itunes}
 * - Spotify does not return a "genre"
 * - duration is in milliseconds
 * @param player {spotify|spotif-web|itunes}
 * @returns {artist, album, genre, disc_number, duration, played_count, track_number, id, name, state}
 */
getTrack(player: PlayerName): Promise<Track>

/**
 * Returns the tracks that are found for itunes
 * @param player {itunes}
 * @param playListName
 */
getTracksByPlaylistName(
    player: PlayerName,
    playListName: string
): Promise<Track[]>

/**
 * Currently only returns Spotify Web tracks not associated with a playlist.
 * @param player
 * @param qsOptions
 */
getSpotifyLikedSongs(
    qsOptions: any = {}
): Promise<Track[]>

/**
 * Currently only returns Spotify Web tracks not associated with a playlist.
 * @param player
 * @param qsOptions
 */
getSavedTracks(player: PlayerName, qsOptions: any = {}): Promise<Track[]>


/**
 * Returns a playlist by ID
 * @param playlist_id ID is preferred, but we'll transform a URI to an ID
 */
getSpotifyPlaylist(playlist_id: string): Promise<PlaylistItem>

/**
 * Returns the tracks that are found by the given playlist name
 * - currently spofity-web support only
 * @param player {spotify-web}
 * @param playlist_id (optional)
 * @param qsOptions (optional) {offset, limit}
 */
getPlaylistTracks(
    player: PlayerName,
    playlist_id: string,
    qsOptions: any = {}
): Promise<CodyResponse>

/**
 * Plays a playlist at the beginning if the starting track id is not provided.
 * @param playlistId either the ID or URI of the playlist
 * @param startingTrackId either the ID or URI of the track
 * @param deviceId
 */
playSpotifyPlaylist(
    playlistId: string,
    startingTrackId: string = "",
    deviceId: string = ""
)

/**
 * Plays a specific track on the Spotify or iTunes desktop
 * @param player
 * @param params
 * spotify example  ["spotify:track:0R8P9KfGJCDULmlEoBagcO", "spotify:album:6ZG5lRT77aJ3btmArcykra"]
 *   -- provide the trackID then the album or playlist ID
 *   -- they can either be in either URI or ID format
 * itunes example   ["Let Me Down Slowly", "MostRecents"]
 *   -- provide the track name then the playlist name
 */
playTrackInContext(player: PlayerName, params: any[])

/**
 * Mac iTunes only
 * This will allow you to play a playlist starting at a specific playlist track number.
 */
playItunesTrackNumberInPlaylist(
    playlistName: string,
    trackNumber: number
)

/**
 * Quits/closes the mac Spotify or iTunes player
 * @param player
 */
quitMacPlayer(player: PlayerName)

/**
 * This is only meant for Mac iTunes or Mac Spotify desktop
 * @param player
 * @param params
 */
playTrackInLibrary(player: PlayerName, params: any[])

/**
 * Initiate and play the specified Spotify device
 * @param device_id {string}
 */
playSpotifyDevice(device_id: string)

/**
 * Initiate and play the specified Spotify device
 * @param device_id {string}
 * @param play {boolean} true to play and false to keep current play state
 */
transferSpotifyDevice(device_id: string, play: boolean)

/**
 * Fetch the user's profile
 */
getUserProfile(): Promise<SpotifyUser>

/**
 * Helper API to return whether or not the user is logged in to their spotify account or not.
 * It's not fool proof as it only determines if there are any devices found or not.
 * {oauthActivated, loggedIn}
 */
spotifyAuthState(): Promise<SpotifyAuthState>

/**
 * Initiate the play command for a specific player
 * @param player {spotify|spotify-web|itunes}
 * @param options { uris, device_id }
 * example
 * -- the uris can be in either URI or ID format
 * {device_id: <spotify_device_id>, uris: ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"], context_uri: <playlist_uri, album_uri>}
 */
play(player: PlayerName, options: any = {})

/**
 * Play a specific spotify track by trackId (it can be the URI or the ID)
 * @param trackId
 * @param deviceId (optional)
 */
playSpotifyTrack(trackId: string, deviceId: string = "")

/**
 * Initiate the play command for a given trackId for a specific player
 * @param player {spotify|spotify-web|itunes}
 * @param trackId {any (string|number)}
 */
playTrack(PlayerName: PlayerName, trackId: any)

/**
 * Initiate the pause command for a given player
 * @param player {spotify|spotify-web|itunes}
 * @param options
 */
pause(player: PlayerName, options: any = {})

/**
 * Initiate the play/pause command for a given player
 * @param player {spotify|spotify-web|itunes}
 * @param options
 */
playPause(player: PlayerName)

/**
 * Initiate the next command for a given player
 * @param player {spotify|spotify-web|itunes}
 * @param options
 */
next(player: PlayerName, options: any = {})

/**
 * Initiate the previous command for a given player
 * @param player {spotify|spotify-web|itunes}
 * @param options
 */
previous(player: PlayerName, options: any = {})

/**
 * Repeats a playlist
 * @param player
 * @param deviceId
 */
setRepeatPlaylist(player: PlayerName, deviceId: string = "")

/**
 * Repeats a track
 * @param player
 * @param deviceId
 */
setRepeatTrack(player: PlayerName, deviceId: string = "")

/**
 * Turn repeat off
 * @param player
 * @param deviceId
 */
setRepeatOff(player: PlayerName, deviceId: string = "")

/**
 * Turn on/off repeat for a given player
 * @param player {spotify|spotify-web|itunes}
 * @param options
 */
setRepeat(player: PlayerName, repeat: boolean)

/**
 * Turn on/off shuffling for a given player
 * @param player {spotify|spotify-web|itunes}
 * @param shuffle (true or false)
 * @param deviceId (optional)
 */
setShuffle(player: PlayerName, shuffle: boolean, deviceId: string = "")

/**
 * Return whether shuffling is on or not
 * @param player {spotify|spotify-web|itunes}
 */
isShuffling(player: PlayerName)

/**
 * Returns whether the player is on repeat or not
 * - spotify returns true or false, and itunes returns "off", "one", "all"
 * @param player {spotify|spotify-web|itunes}
 */
isRepeating(player: PlayerName)

/**
 * Update the players volume
 * @param player {spotify|spotify-web|itunes}
 * @param volume {0-100}
 */
setVolume(player: PlayerName, volume: number)

/**
 * Increments the players volume by a number
 * @param player {spotify|spotify-web|itunes}
 */
volumeUp(player: PlayerName)

/**
 * Decrements the players volume by a number
 * @param player {spotify|spotify-web|itunes}
 */
volumeDown(player: PlayerName)

/**
 * Mutes the players volume
 * @param player {spotify|spotify-web|itunes}
 */
mute(player: PlayerName)

/**
 * Unmutes the players volume
 * @param player {spotify|spotify-web|itunes}
 */
unmute(player: PlayerName)

/**
 * Unmutes the players volume
 * @param player {spotify|spotify-web|itunes}
 */
setItunesLoved(loved: boolean)

/**
 * Save tracks to your liked playlist
 * @param trackIds (i.e. ["4iV5W9uYEdYUVa79Axb7Rh", "1301WleyT98MSxVHPZCA6M"])
 */
saveToSpotifyLiked(trackIds: string[]): Promise<CodyResponse>

/**
 * Remove tracks from your liked playlist
 * @param trackIds (i.e. ["4iV5W9uYEdYUVa79Axb7Rh", "1301WleyT98MSxVHPZCA6M"])
 */
removeFromSpotifyLiked(
    trackIds: string[]
): Promise<CodyResponse>

/**
 * Returns the playlists for a given player
 * @param player {spotify|spotify-web|itunes}
 * @param (optional) {limit, offset, all}
 */
getPlaylists(
    player: PlayerName,
    qsOptions: any = {}
): Promise<PlaylistItem[]>

/**
 * Get the full list of the playlist names for a given player
 * @param player {spotify|spotify-web|itunes}
 * @param qsOptions (optional) {limit, offset}
 */
getPlaylistNames(
    player: PlayerName,
    qsOptions: any = {}
): Promise<string[]>

/**
 * Launches a player device
 * @param playerName {spotify|spotify-web|itunes}
 * @param options (spotify-web only) {playlist_id | album_id | track_id }
 */
launchPlayer(playerName: PlayerName, options: any = {})

/**
 * Plays a Spotify track within a playlist.
 * It will also launch Spotify if it is not already available by checking the device Ids.
 * @param trackId (optional) If it's not supplied then the playlistId must be provided
 * @param playlistId (optional) If it's not supplied then the trackId must be provided
 * @param playerName (optional) SpotifyWeb or SpotifyDesktop
 */
launchAndPlaySpotifyTrack(trackId: string = "", playlistId: string = "", playerName: string = PlayerName.SpotifyWeb)

/**
 * Plays a Spotify Mac Desktop track within a playlist.
 * It will also launch Spotify if it is not already available by checking the device Ids.
 * @param trackId (optional) If it's not supplied then the playlistId must be provided
 * @param playlistId (optional) If it's not supplied then the trackId must be provided
 */
playSpotifyMacDesktopTrack(trackId: string = "", playlistId: string = "")

/**
 * Returns available Spotify devices
 * @returns {Promise<PlayerDevice[]>}
 */
getSpotifyDevices(): Promise<PlayerDevice[]>

/**
 * Returns the genre for a provided arguments
 * @param artist {string} is required
 * @param songName {string} is optional
 * @param spotifyArtistId {string} is optional (uri or id is fine)
 */
getGenre(
    artist: string,
    songName: string = "",
    spotifyArtistId: string = ""
): Promise<string>

/**
 * Returns the spotify genre for a provided arguments
 * @param artist {string} is required
 */
getSpotifyGenre(artist: string): Promise<string>

/**
 * Returns the highest frequency single genre from a list
 **/
getHighestFrequencySpotifyGenre(genreList: string[]): string

/**
 * Returns the spotify genre for a provided arguments
 * @param spotifyArtistId {string} is required (uri or id is fine)
 */
getSpotifyGenreByArtistId(spotifyArtistId: string): Promise<string> {

/**
 * Returns the recent top tracks Spotify for a user.
 */
getTopSpotifyTracks(): Promise<Track[]>

/**
 * Returns the audio features of the given track IDs
 * @param ids these are the track ids (sans spotify:track)
 */
getSpotifyAudioFeatures(
    ids: string[]
): Promise<SpotifyAudioFeature[]>

/**
 * Create a playlist for a Spotify user. (The playlist will be empty until you add tracks.)
 * @param name the name of the playlist you want to create
 * @param isPublic if the playlist will be public or private
 * @param description (Optioal) displayed in Spotify Clients and in the Web API
 */
createPlaylist(
    name: string,
    isPublic: boolean,
    description: string = ""
)

/**
 * Deletes a playlist of a given playlist ID.
 * @param playlist_id
 */
deletePlaylist(playlist_id: string): CodyResponse

/**
 * Follow a playlist of a given playlist ID.
 * @param playlist_id (uri or id)
 */
followPlaylist(playlist_id: string): CodyResponse

/**
 * Replace tracks of a given playlist. This will wipe out
 * the current set of tracks and add the tracks specified.
 * @param playlist_id
 * @param track_ids
 */
replacePlaylistTracks(
    playlist_id: string,
    track_ids: string[]
)

/**
 * Add tracks to a given Spotify playlist.
 * @param playlist_id the Spotify ID for the playlist
 * @param tracks Tracks should be the uri (i.e. "spotify:track:4iV5W9uYEdYUVa79Axb7Rh")
 * but if it's only the id (i.e. "4iV5W9uYEdYUVa79Axb7Rh") this will add
 * the uri part "spotify:track:"
 * @param position The position to insert the tracks, a zero-based index.
 */
addTracksToPlaylist(
    playlist_id: string,
    tracks: string[],
    position: number = 0
)

/**
 * Remove tracks from a given Spotify playlist.
 * @param playlist_id the Spotify ID for the playlist
 * @param tracks Tracks should be the uri (i.e. "spotify:track:4iV5W9uYEdYUVa79Axb7Rh")
 * but if it's only the id (i.e. "4iV5W9uYEdYUVa79Axb7Rh") this will add
 * the uri part "spotify:track:"
 */
removeTracksFromPlaylist(
    playlist_id: string,
    tracks: string[]
)

/**
 * Returns whether or not the spotify access token has been provided.
 * @returns <boolean>
 */
requiresSpotifyAccessInfo(): boolean

/**
 * Deprecated - use "getTrack(player)"
 */
getPlayerState(player: PlayerName): Promise<Track>

/**
 * Deprecated - use "getRunningTrack()" instead
 */
getCurrentlyRunningTrackState(): Promise<Track>

/**
 * Deprecated - please use "getPlayerState"
 */
getState(player: PlayerName): Promise<Track>

/**
 * Deprecated - please use "launchPlayer('spotify')"
 **/
startSpotifyIfNotRunning()

/**
 * Deprecated - please use "launchPlayer('itunes')"
 */
startItunesIfNotRunning()

/**
 * Deprecated - please use "isSpotifyRunning" or "isItunesRunning"
 */
isRunning(player: PlayerName): Promise<boolean>

/**
 * Deprecated - please use "setRepat(player, repeat)"
 */
repeatOn(player: PlayerName)

/**
 * Deprecated - please use "setRepat(player, repeat)"
 */
repeatOff(player: PlayerName)

/**
 * Deprecated - please use "unmute(player)"
 */
unMute(player: PlayerName)

/**
 * Deprecated - please use "setConfig(config: CodyConfig)"
 * Set Credentials (currently only supports Spotify)
 * Accepted credentials: clientId, clientSecret, refreshToken, accessToken
 * @param credentials
 */
setCredentials(credentials: any)

/**
 * Deprecated - please use "getSpotifyAccessToken()"
 * Get the accessToken provided via through the setCredentials api
 * @returns {string} the access token string
 */
getAccessToken()
```

## Contributors

-   [Cody](https://github.com/codyxio)

## License
