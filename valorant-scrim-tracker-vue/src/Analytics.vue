<script lang="ts">
import axios from 'axios';
export default {
  data() {
    return {
      matches: [],
      players: [],
      matchStats: []
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      axios.get('/parser_output.json')
        .then(response => {
          this.matches = response.data;

          //BUILD PLAYER/MATCH STATS
          this.players = [];
          this.matches.forEach(match => {
            //MATCH STATS
            var existingMatchStat = this.matchStats.find(m => m.Map == match.Map);
            if (existingMatchStat) {
              var roundsWon = match.MainTeam == 0 ? match.Team0Rounds : match.Team1Rounds;
              var roundsLost = match.MainTeam == 0 ? match.Team1Rounds : match.Team0Rounds;
              existingMatchStat.Wins += roundsWon > roundsLost ? 1 : 0;
              existingMatchStat.Losses += roundsWon < roundsLost ? 1 : 0;
              existingMatchStat.RoundsWon += roundsWon;
              existingMatchStat.RoundsLost += roundsLost;
            }
            else {
              var newMatchStat = {};
              newMatchStat.Map = match.Map;
              var roundsWon = match.MainTeam == 0 ? match.Team0Rounds : match.Team1Rounds;
              var roundsLost = match.MainTeam == 0 ? match.Team1Rounds : match.Team0Rounds;
              newMatchStat.RoundsWon = roundsWon;
              newMatchStat.RoundsLost = roundsLost;
              newMatchStat.Wins = roundsWon > roundsLost ? 1 : 0;
              newMatchStat.Losses = roundsWon < roundsLost ? 1 : 0;
              this.matchStats.push(newMatchStat);
            }

            //PLAYER STATS
            var players = match.Players.filter(p => p.Team == match.MainTeam);
            players.forEach(player => {
              var existingPlayer = this.players.find(p => p.Name == player.Name);
              if (existingPlayer) {
                existingPlayer.Kills += player.Kills;
                existingPlayer.Deaths += player.Deaths;
                existingPlayer.Assists += player.Assists;
                existingPlayer.FirstKills += player.FirstKills;
                existingPlayer.FirstDeaths += player.FirstDeaths;
                existingPlayer.TrueFirstKills += player.TrueFirstKills;
                existingPlayer.TrueFirstDeaths += player.TrueFirstDeaths;
                existingPlayer.TradedKills += player.TradedKills;
                existingPlayer.TradedDeaths += player.TradedDeaths;
                existingPlayer.KASTRounds += player.KASTRounds;
                existingPlayer.KASTTotalRounds += 24;
              }
              else {
                var playersToHide = ["PodX12", "炎死炎"];
                if (playersToHide.indexOf(player.Name) < 0) {
                  this.players.push(
                    {
                      Name: player.Name,
                      Kills: player.Kills,
                      Deaths: player.Deaths,
                      Assists: player.Assists,
                      FirstKills: player.FirstKills,
                      FirstDeaths: player.FirstDeaths,
                      TrueFirstKills: player.FirstDeaths,
                      TrueFirstDeaths: player.FirstDeaths,
                      TradedKills: player.FirstDeaths,
                      TradedDeaths: player.FirstDeaths,
                      KASTRounds: player.KASTRounds,
                      KASTTotalRounds: 24
                    }
                  );
                }
              }
            });

            this.players.sort((a, b) => a.Kills < b.Kills);
          });
        })
        .catch(error => {
          console.error('There was an error fetching the data:', error);
        });
    },
    getKASTPercent(player) {
      return `${Math.round(player.KASTRounds / (player.KASTTotalRounds / 100))}%`;
    },
    getFKPercent(player) {
      return `${Math.round(player.FirstKills / ((player.FirstDeaths + player.FirstKills) / 100))}%`;
    },
    getRoundWinPercent(match) {
      return `${Math.round(match.RoundsWon / ((match.RoundsWon + match.RoundsLost) / 100))}%`;
    },
    getWinPercent(match) {
      return `${Math.round(match.Wins / ((match.Wins + match.Losses) / 100))}%`;
    }
  }
}
</script>

<template>
  <div class="main-content">
    <div class="pad-top-20"></div>
    <div class="panel">
      <div class="container">
        <div class="flex-1">Map Stats</div>
      </div>
      <div class="pad-top-20"></div>
      <table class="scoreboard">
        <thead>
          <tr>
            <th width="150px">Map</th>
            <th>Wins%</th>
            <th>Round Win%</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="match in matchStats" :key="match.Map">
            <td>{{ match.Map }}</td>
            <td>{{ getWinPercent(match) }} ( {{ match.Wins }} / {{ match.Losses }} )</td>
            <td>{{ getRoundWinPercent(match) }} ( {{ match.RoundsWon }} / {{ match.RoundsLost }} )</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pad-top-20"></div>
    <div class="panel">
      <div class="container">
        <div class="flex-1">Player Stats</div>
      </div>
      <div class="pad-top-20"></div>
      <table class="scoreboard">
        <thead>
          <tr>
            <th width="150px">Player</th>
            <th>Kills</th>
            <th>Deaths</th>
            <th>Assists</th>
            <th>K/D</th>
            <th>FK</th>
            <th>FD</th>
            <th>FK Success%</th>
            <th>True FK</th>
            <th>True FD</th>
            <th>Traded Kills</th>
            <th>Traded Deaths</th>
            <th>KAST%</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="player in players" :key="player.Key">
            <td>{{ player.Name }}</td>
            <td>{{ player.Kills }}</td>
            <td>{{ player.Deaths }}</td>
            <td>{{ player.Assists }}</td>
            <td>{{ (player.Kills / player.Deaths).toFixed(2) }}</td>
            <td>{{ player.FirstKills }}</td>
            <td>{{ player.FirstDeaths }}</td>
            <td>{{ getFKPercent(player) }}</td>
            <td>{{ player.TrueFirstKills }}</td>
            <td>{{ player.TrueFirstDeaths }}</td>
            <td>{{ player.TradedKills }}</td>
            <td>{{ player.TradedDeaths }}</td>
            <td>{{ getKASTPercent(player) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>