import type { NextApiRequest, NextApiResponse } from 'next';
import PlaylistApiResponse from '../../../interfaces/playlist';

const playlists = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const { authorization } = req.headers;

  switch (method) {
    case 'GET':
      try {
        const fetchPlaylists = async (
          url: string
        ): Promise<PlaylistApiResponse> => {
          const data = await fetch(url, {
            method: 'GET',
            headers: {
              method: 'GET',
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: authorization as string,
            },
          }).then((res) => res.json());
          return data;
        };

        const response = await fetchPlaylists(
          'https://api.spotify.com/v1/me/playlists'
        );

        if (response.next) {
          let nextURL = response.next;

          while (nextURL) {
            const data = await fetchPlaylists(nextURL);
            response.items.push(...data.items);
            nextURL = data.next as string;
          }
          res.status(200).json(response);
        } else {
          res.status(200).json(response);
        }
      } catch (error) {
        res
          .status(400)
          .json({ message: `Playlists cannot be fetched, ${error}` });
      }
  }
};

export default playlists;