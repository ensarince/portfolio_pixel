import axios from 'axios';
import querystring from 'querystring';
import { Base64 } from 'js-base64';

//spotify variables to access data
const client_id = import.meta.env.VITE_APP_SPOTIFY_CLIENT_ID;
const client_secret = import.meta.env.VITE_APP_SPOTIFY_CLIENT_SECRET;
const refresh_token = import.meta.env.VITE_APP_SPOTIFY_REFRESH_TOKEN;

const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;

export interface SpotifyData {
  is_playing: boolean;
  item: {
    name: string;
    album: {
      name: string;
      artists: Array<{ name: string }>;
      images: [{ url: string }];
    };
    external_urls: {
      spotify: string;
    };
  };
  currently_playing_type: string;
}

interface AccessTokenResponse {
    access_token: string;
  }

  //get access token using refresh token
export const getAccessToken = async (): Promise<string> => {
    const authString = `${client_id}:${client_secret}`;
    const authHeader = `Basic ${Base64.encode(authString)}`;
  
    const response = await axios.post<AccessTokenResponse>(
      TOKEN_ENDPOINT,
      querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token,
      }),
      {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
  
    const { access_token } = response.data;
  
    return access_token;
  };

  //getnowpiaying data
export const getNowPlaying = async (): Promise<SpotifyData | null> => {
    const access_token = await getAccessToken();
    try {
        const response = await axios.get<SpotifyData>(NOW_PLAYING_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        });

        if (
        response.status === 204 ||
        response.status > 400 ||
        response.data.currently_playing_type !== 'track'
        ) {
        return null;
        }

        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
    };

