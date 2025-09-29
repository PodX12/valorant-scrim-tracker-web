<script>
import axios from 'axios';
export default {
  data() {
    return {
      matches: [],
      players: [],
      mapStats: []
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      axios.get('https://podx12.github.io/valorant-scrim-tracker-web/parser_output.json')
        .then(response => {
          this.matches = response.data;

          //BUILD PLAYER/MATCH STATS
          this.players = [];
          var pistolWins = 0;
          this.matches.forEach(match => {
            //MATCH STATS
            var existingMatchStat = this.mapStats.find(m => m.Map == match.Map);
            if (existingMatchStat) {
              var roundsWon = match.MainTeam == 0 ? match.Team0Rounds : match.Team1Rounds;
              var roundsLost = match.MainTeam == 0 ? match.Team1Rounds : match.Team0Rounds;
              existingMatchStat.Wins += roundsWon > roundsLost ? 1 : 0;
              existingMatchStat.Losses += roundsWon < roundsLost ? 1 : 0;
              existingMatchStat.RoundsWon += roundsWon;
              existingMatchStat.RoundsLost += roundsLost;

              var halfTimeRound = match.Rounds[11];
              var firstPistol = match.Rounds[0];
              var secondPistol = match.Rounds[12];

              //MainTeam == 1: Defence start
              if (match.MainTeam == 1) {
                existingMatchStat.AttackPistolRoundsWon += secondPistol.WinningTeam == match.MainTeam ? 1 : 0;
                existingMatchStat.AttackPistolRoundsLost += secondPistol.WinningTeam == match.MainTeam ? 0 : 1;
                existingMatchStat.DefencePistolRoundsWon += firstPistol.WinningTeam == match.MainTeam ? 1 : 0;
                existingMatchStat.DefencePistolRoundsLost += firstPistol.WinningTeam == match.MainTeam ? 0 : 1;
                existingMatchStat.DefenceRoundsWon += halfTimeRound.Team1Rounds;
                existingMatchStat.DefenceRoundsLost += halfTimeRound.Team0Rounds;
                existingMatchStat.AttackRoundsWon += roundsWon - halfTimeRound.Team1Rounds;
                existingMatchStat.AttackRoundsLost += roundsLost - halfTimeRound.Team0Rounds;
              }
              else {
                existingMatchStat.AttackPistolRoundsWon += firstPistol.WinningTeam == match.MainTeam ? 1 : 0;
                existingMatchStat.AttackPistolRoundsLost += firstPistol.WinningTeam == match.MainTeam ? 0 : 1;
                existingMatchStat.DefencePistolRoundsWon += secondPistol.WinningTeam == match.MainTeam ? 1 : 0;
                existingMatchStat.DefencePistolRoundsLost += secondPistol.WinningTeam == match.MainTeam ? 0 : 1;
                existingMatchStat.DefenceRoundsWon += halfTimeRound.Team1Rounds;
                existingMatchStat.DefenceRoundsLost += halfTimeRound.Team0Rounds;
                existingMatchStat.AttackRoundsWon += roundsWon - halfTimeRound.Team1Rounds;
                existingMatchStat.AttackRoundsLost += roundsLost - halfTimeRound.Team0Rounds;
              }
            }
            else {
              var newMatchStat = {};
              newMatchStat.Map = match.Map;
              var roundsWon = match.MainTeam == 0 ? match.Team0Rounds : match.Team1Rounds;
              var roundsLost = match.MainTeam == 0 ? match.Team1Rounds : match.Team0Rounds;

              var halfTimeRound = match.Rounds[11];
              var firstPistol = match.Rounds[0];
              var secondPistol = match.Rounds[12];

              //MainTeam == 1: Defence start
              if (match.MainTeam == 1) {
                newMatchStat.AttackPistolRoundsWon = secondPistol.WinningTeam == match.MainTeam ? 1 : 0;
                newMatchStat.AttackPistolRoundsLost = secondPistol.WinningTeam == match.MainTeam ? 0 : 1;
                newMatchStat.DefencePistolRoundsWon = firstPistol.WinningTeam == match.MainTeam ? 1 : 0;
                newMatchStat.DefencePistolRoundsLost = firstPistol.WinningTeam == match.MainTeam ? 0 : 1;
                newMatchStat.DefenceRoundsWon = halfTimeRound.Team1Rounds;
                newMatchStat.DefenceRoundsLost = halfTimeRound.Team0Rounds;
                newMatchStat.AttackRoundsWon = roundsWon - halfTimeRound.Team1Rounds;
                newMatchStat.AttackRoundsLost = roundsLost - halfTimeRound.Team0Rounds;
              }
              else {
                newMatchStat.AttackPistolRoundsWon = firstPistol.WinningTeam == match.MainTeam ? 1 : 0;
                newMatchStat.AttackPistolRoundsLost = firstPistol.WinningTeam == match.MainTeam ? 0 : 1;
                newMatchStat.DefencePistolRoundsWon = secondPistol.WinningTeam == match.MainTeam ? 1 : 0;
                newMatchStat.DefencePistolRoundsLost = secondPistol.WinningTeam == match.MainTeam ? 0 : 1;
                newMatchStat.AttackRoundsWon = halfTimeRound.Team0Rounds;
                newMatchStat.AttackRoundsLost = halfTimeRound.Team1Rounds;
                newMatchStat.DefenceRoundsWon = roundsWon - halfTimeRound.Team1Rounds;
                newMatchStat.DefenceRoundsLost = roundsLost - halfTimeRound.Team0Rounds;
              }

              newMatchStat.RoundsWon = roundsWon;
              newMatchStat.RoundsLost = roundsLost;
              newMatchStat.Wins = roundsWon > roundsLost ? 1 : 0;
              newMatchStat.Losses = roundsWon < roundsLost ? 1 : 0;
              this.mapStats.push(newMatchStat);
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
                var playersToHide = ["PodX12", "炎死炎", "foreign"];
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

            if (match.Rounds[0].WinningTeam == match.MainTeam)
              pistolWins++;
            if (match.Rounds[11].WinningTeam == match.MainTeam)
              pistolWins++;
          });

          console.log(`Pistol Wins: ${pistolWins}/${this.matches.length * 2}`);
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
    },
    getTradedPercent(partial, whole) {
      return `${Math.round(partial / ((whole) / 100))}%`;
    },
    getAttackRoundWinPercent(map) {
      return `${Math.round(map.AttackRoundsWon / ((map.AttackRoundsWon + map.AttackRoundsLost) / 100))}%`;
    },
    getDefenceRoundWinPercent(map) {
      return `${Math.round(map.DefenceRoundsWon / ((map.DefenceRoundsWon + map.DefenceRoundsLost) / 100))}%`;
    },
    getPistolRoundWinPercent(map, side = "") {
      var totalPistolRounds = map.AttackPistolRoundsWon + map.AttackPistolRoundsLost + map.DefencePistolRoundsWon + map.DefencePistolRoundsLost;
      var totalWonRounds = map.AttackPistolRoundsWon + map.DefencePistolRoundsWon;

      if (side == "ATK") {
        totalPistolRounds = map.AttackPistolRoundsWon + map.AttackPistolRoundsLost;
        totalWonRounds = map.AttackPistolRoundsWon;
      }

      if (side == "DEF") {
        totalPistolRounds = map.DefencePistolRoundsWon + map.DefencePistolRoundsLost;
        totalWonRounds = map.DefencePistolRoundsWon;
      }
      return `${Math.round(totalWonRounds / ((totalPistolRounds) / 100))}%`;
    },
    openMap(map) {
      alert(map);
      this.$router.push({ name: 'maps', params: { map: map } });
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
            <th>Wins</th>
            <th>Round WR</th>
            <th>Attacking</th>
            <th>Defending</th>
            <th>Pistol Atk WR</th>
            <th>Pistol Def WR</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="map in mapStats" :key="map.Map" v-on:click="openMap(map.Map)" class="clickable">
            <td>{{ map.Map }}</td>
            <td>{{ map.Wins }}/{{ map.Losses }} ({{ getWinPercent(map) }})</td>
            <td>{{ getRoundWinPercent(map) }}</td>
            <td>{{ getAttackRoundWinPercent(map) }}</td>
            <td>{{ getDefenceRoundWinPercent(map) }}</td>
            <td>{{ getPistolRoundWinPercent(map, "ATK") }}</td>
            <td>{{ getPistolRoundWinPercent(map, "DEF") }}</td>
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
            <td>{{ player.TradedKills }} ({{ getTradedPercent(player.TradedKills, player.Kills) }})</td>
            <td>{{ player.TradedDeaths }} ({{ getTradedPercent(player.TradedDeaths, player.Deaths) }})</td>
            <td>{{ getKASTPercent(player) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>