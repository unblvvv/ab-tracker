# Backend Setup Instructions

## 🚨 Important Notice

The AbTracker frontend requires a backend server to fetch player data from Riot Games API. Currently, you're seeing errors because the backend is not running.

## Error Messages You Might See

```
[ERROR] Backend API error
{url: 'http://localhost:8080/account/username/tag', status: 500}

[ERROR] Failed to fetch participants
Error: Backend server error. Please check if the backend is running.
```

## 🛠️ Backend Requirements

The backend server should:

1. **Run on `http://localhost:8080`** (or update `API_ENDPOINTS.BACKEND` in `src/constants/game.constants.ts`)
2. **Provide the following endpoints:**

### Required Endpoints

#### GET `/account/:name/:tag`

Fetches account information and current game data.

**Example Request:**
```
GET http://localhost:8080/account/PlayerName/TAG
```

**Expected Response:**
```json
{
  "puuid": "player-unique-id",
  "gameName": "PlayerName",
  "tagLine": "TAG",
  "currentGame": {
    "participants": [
      {
        "summonerName": "PlayerName",
        "championName": "Ahri",
        "teamId": 100,
        "tier": "GOLD",
        "rank": "II",
        "mastery": {
          "level": 7,
          "points": 250000
        },
        "ability": {
          "q": "Orb of Deception description",
          "w": "Fox-Fire description",
          "e": "Charm description",
          "r": "Spirit Rush description"
        },
        "stats": {
          "recentMatches": [
            {
              "champion": "Ahri",
              "kda": "10/2/15",
              "mode": "Ranked",
              "win": true
            }
          ],
          "topChampions": [
            {
              "champion": "Ahri",
              "winRate": 65,
              "games": 100,
              "kda": 3.5
            }
          ],
          "winRate": 0.55,
          "gamesPlayed": 200
        }
      }
      // ... more participants
    ],
    "gameMode": "CLASSIC",
    "gameStartTime": 1234567890,
    "mapId": 11
  }
}
```

#### Optional Endpoints

- `GET /summoner/:summonerId` - Get summoner details
- `GET /match/:matchId` - Get match details

## 🚀 Quick Backend Setup Options

### Option 1: Node.js/Express Backend

Create a simple Express server:

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// Your Riot API Key
const RIOT_API_KEY = 'YOUR_RIOT_API_KEY_HERE';

app.get('/account/:name/:tag', async (req, res) => {
  try {
    const { name, tag } = req.params;
    
    // Fetch from Riot API
    const accountResponse = await axios.get(
      `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tag}`,
      { headers: { 'X-Riot-Token': RIOT_API_KEY } }
    );
    
    const { puuid } = accountResponse.data;
    
    // Fetch current game
    const gameResponse = await axios.get(
      `https://euw1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${puuid}`,
      { headers: { 'X-Riot-Token': RIOT_API_KEY } }
    );
    
    // Process and return data
    res.json({
      puuid,
      gameName: name,
      tagLine: tag,
      currentGame: processGameData(gameResponse.data)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
```

Run:
```bash
npm install express cors axios
node server.js
```

### Option 2: Python/Flask Backend

```python
# app.py
from flask import Flask, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

RIOT_API_KEY = 'YOUR_RIOT_API_KEY_HERE'

@app.route('/account/<name>/<tag>')
def get_account(name, tag):
    try:
        # Fetch from Riot API
        account_url = f'https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{name}/{tag}'
        headers = {'X-Riot-Token': RIOT_API_KEY}
        
        account_data = requests.get(account_url, headers=headers).json()
        puuid = account_data['puuid']
        
        # Fetch current game
        game_url = f'https://euw1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/{puuid}'
        game_data = requests.get(game_url, headers=headers).json()
        
        return jsonify({
            'puuid': puuid,
            'gameName': name,
            'tagLine': tag,
            'currentGame': process_game_data(game_data)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=8080, debug=True)
```

Run:
```bash
pip install flask flask-cors requests
python app.py
```

### Option 3: Use Mock Data (for development)

Create a simple mock server:

```javascript
// mock-server.js
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/account/:name/:tag', (req, res) => {
  res.json({
    puuid: 'mock-puuid',
    gameName: req.params.name,
    tagLine: req.params.tag,
    currentGame: {
      participants: [
        {
          summonerName: 'Player1',
          championName: 'Ahri',
          teamId: 100,
          tier: 'GOLD',
          rank: 'II',
          mastery: { level: 7, points: 250000 },
          ability: {
            q: 'Orb of Deception',
            w: 'Fox-Fire',
            e: 'Charm',
            r: 'Spirit Rush'
          }
        }
        // Add more mock participants
      ],
      gameMode: 'CLASSIC',
      gameStartTime: Date.now(),
      mapId: 11
    }
  });
});

app.listen(8080, () => {
  console.log('Mock server running on http://localhost:8080');
});
```

## 🔑 Getting Riot API Key

1. Go to [Riot Developer Portal](https://developer.riotgames.com/)
2. Sign in with your Riot account
3. Register your application
4. Copy your API key
5. **Important:** Development keys expire every 24 hours. For production, apply for a production key.

## 🌍 Region Configuration

Update the region in your backend based on your location:

- **Europe West:** `euw1.api.riotgames.com`
- **North America:** `na1.api.riotgames.com`
- **Korea:** `kr.api.riotgames.com`
- **Others:** See [Riot API Regions](https://developer.riotgames.com/docs/lol#routing-values)

## ⚙️ Frontend Configuration

If your backend runs on a different port, update:

**File:** `src/constants/game.constants.ts`

```typescript
export const API_ENDPOINTS = {
  RIOT_CLIENT: 'https://127.0.0.1:2999/liveclientdata',
  BACKEND: 'http://localhost:YOUR_PORT', // Change this
} as const;
```

## 🐛 Troubleshooting

### Backend Not Responding

1. **Check if backend is running:**
   ```bash
   curl http://localhost:8080/account/test/test
   ```

2. **Check CORS settings:**
   Make sure CORS is enabled in your backend

3. **Check firewall:**
   Ensure port 8080 is not blocked

### 500 Internal Server Error

- Check backend logs for detailed error messages
- Verify Riot API key is valid and not expired
- Ensure the summoner name and tag are correct
- Check if the player is in an active game

### Rate Limiting (429 Error)

- Riot API has rate limits:
  - Development key: 20 requests/second, 100 requests/2 minutes
  - Implement caching in your backend
  - Add request throttling

### Player Not Found (404 Error)

- Player might not be in an active game
- Summoner name or tag might be incorrect
- Check the region setting

## 📝 Production Considerations

1. **Environment Variables:**
   ```bash
   RIOT_API_KEY=your_key_here
   PORT=8080
   REGION=euw1
   ```

2. **Caching:**
   - Cache participant data for 30-60 seconds
   - Cache champion/ability data indefinitely

3. **Error Handling:**
   - Implement retry logic for Riot API
   - Return meaningful error messages
   - Log errors for debugging

4. **Security:**
   - Never expose your Riot API key in frontend code
   - Use HTTPS in production
   - Validate input parameters
   - Implement rate limiting

## 📚 Resources

- [Riot Games API Documentation](https://developer.riotgames.com/docs/lol)
- [League of Legends API Reference](https://developer.riotgames.com/apis)
- [Community Dragon (Assets CDN)](https://communitydragon.org/)

## 💡 Tips

- Use [Postman](https://www.postman.com/) to test Riot API endpoints
- Check [League of Legends API Community](https://riot-api-libraries.readthedocs.io/) for helper libraries
- Consider using existing League of Legends API wrappers:
  - Node.js: `twisted`, `kayn`, `teemojs`
  - Python: `riot-watcher`, `cassiopeia`
  - .NET: `Camille`, `RiotSharp`

---

**Need Help?**

If you're still having issues:
1. Check the browser console for detailed error messages
2. Check backend logs
3. Verify Riot API key is valid
4. Ensure the player is in an active League of Legends game
5. Open an issue on GitHub with error logs

**Last Updated:** 2024-01-20