<script>
import axios from 'axios';
import { format } from 'date-fns';
export default {
  data() {
    return {
      match: null,
      players: null,
      ultRounds: [],
      showingEnemyTeam: false,
      roundConversions: []
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      axios.get('https://podx12.github.io/valorant-scrim-tracker-web/parser_output.json')
        .then(response => {
          this.match = response.data.find(m => m.MatchId == this.$route.params.id);
          this.players = this.match.Players.filter(p => p.Team == this.match.MainTeam);
          this.players.sort((a, b) => a.Kills < b.Kills);

          //ult rounds
          //round number, side, ultimates available, enemy ultimates available
          this.ultRounds = [];
          this.match.FkConversions = 0;
          this.match.FkTotal = 0;

          this.match.Rounds.forEach((round, index) => {
            var teamSide = index < 12
              ? this.match.MainTeam == 1 ? "DEF" : "ATK"
              : this.match.MainTeam == 1 ? "ATK" : "DEF";

            var firstBloodPlayer = this.match.Players.find(p => p.Name == round.RoundKillLogs[0].Attacker);

            //BUILD ULT ROUNDS
            var newUltRound = {
              roundNumber: index + 1,
              side: teamSide,
              ourUlts: [],
              ourWin: round.WinningTeam == this.match.MainTeam,
              ourFirstBlood: firstBloodPlayer.Team == this.match.MainTeam ? true : false,
              ourWinTitle: round.WinningTeam == this.match.MainTeam ? "Win" : "Loss",
              enemyUlts: [],
              enemyWin: round.WinningTeam != this.match.MainTeam,
              enemyFirstBlood: firstBloodPlayer.Team != this.match.MainTeam ? true : false,
              enemyWinTitle: round.WinningTeam != this.match.MainTeam ? "Win" : "Loss",
              firstBloodPlayer: firstBloodPlayer.Name
            };

            if (newUltRound.ourFirstBlood) {
              this.match.FkTotal++;
              if (newUltRound.ourWin)
                this.match.FkConversions++;
            }

            round.Players.forEach(p => {
              if (p.UltMax == p.UltPoints) {
                if (p.Team == this.match.MainTeam) {
                  newUltRound.ourUlts.push(p.Agent)
                } else {
                  newUltRound.enemyUlts.push(p.Agent)
                }
              }
            });
            this.ultRounds.push(newUltRound);
          });


          //TODO: ROUND CONVERSION RATE
          for (let allyTeam = 5; allyTeam >= 1; allyTeam--) {
            for (let enemyTeam = 5; enemyTeam >= 1; enemyTeam--) {
              this.roundConversions.push(
                {
                  round: `${allyTeam}v${enemyTeam}`
                }
              );
            }
          }
        })
        .catch(error => {
          console.error('There was an error fetching the data:', error);
        });
    },
    goBack() {
      this.$router.back();
    },
    formattedDate(dateTime) {
      const dateObject = new Date(dateTime);
      const formattedString = format(dateObject, 'MMM dd, yyyy');
      return formattedString;
    },
    formattedTime(dateTime) {
      const dateObject = new Date(dateTime);
      const formattedString = format(dateObject, 'HH:mm');
      return formattedString;

    },
    getKASTPercent(kast) {
      return `${Math.round(kast / (24 / 100))}%`;
    },
    toggleEnemyTeam() {
      if (!this.showingEnemyTeam) {
        this.players = this.match.Players;
        this.players.sort((a, b) => a.Kills < b.Kills);
      }
      else {
        this.players = this.match.Players.filter(p => p.Team == this.match.MainTeam);
        this.players.sort((a, b) => a.Kills < b.Kills);
      }
      this.showingEnemyTeam = !this.showingEnemyTeam;
    },
    matchScoreColor() {
      var winPercent = this.match.MainTeam == 0
        ? this.match.Team0Rounds / this.match.Team1Rounds
        : this.match.Team1Rounds / this.match.Team0Rounds;

      if (winPercent > 1.5)
        return "green";
      if (winPercent < 0.5)
        return "red";
      if (winPercent < 1)
        return "light-red";
      if (winPercent > 1)
        return "light-green";
      return "white";
    },
    matchScore() {
      return this.match.MainTeam == 0
        ? `${this.match.Team0Rounds} - ${this.match.Team1Rounds}`
        : `${this.match.Team1Rounds} - ${this.match.Team0Rounds}`;
    }
  }
}
</script>

<template>
  <div class="main-content match" v-if="match != null">
    <div class="pad-top-20"></div>
    <button @click="goBack">&lt; Back</button>
    <div class="match-header pad-top-20">
      <span class="name">{{ match.Map }}</span>
      <span class="score" :class="matchScoreColor()">{{ matchScore() }}</span>
      <span class="date">{{ formattedDate(match.DateTime) }} at {{ formattedTime(match.DateTime) }}</span>
    </div>
    <div class="pad-top-20"></div>
    <div class="panel">
      <div class="container">
        <div class="flex-1">Match Scoreboard</div>
        <div>
          <button v-on:click="toggleEnemyTeam()">Show Enemy Team</button>
        </div>
      </div>
      <div class="pad-top-20"></div>
      <table class="scoreboard">
        <thead>
          <tr>
            <th width="60px">Agent</th>
            <th width="150px">Player</th>
            <th>Kills</th>
            <th>Deaths</th>
            <th>Assists</th>
            <th>K/D</th>
            <th>FK</th>
            <th>FD</th>
            <th>True FK</th>
            <th>True FD</th>
            <th>Traded Kills</th>
            <th>Traded Deaths</th>
            <th>KAST%</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="player in players" :key="player.Key" :class="[player.Team == match.MainTeam ? 'main-team' : 'enemy-team']">
            <td><span :class="[player.Agent.toLowerCase(), 'agent']"></span></td>
            <td>{{ player.Name }}</td>
            <td>{{ player.Kills }}</td>
            <td>{{ player.Deaths }}</td>
            <td>{{ player.Assists }}</td>
            <td>{{ (player.Kills / player.Deaths).toFixed(2) }}</td>
            <td>{{ player.FirstKills }}</td>
            <td>{{ player.FirstDeaths }}</td>
            <td>{{ player.TrueFirstKills }}</td>
            <td>{{ player.TrueFirstDeaths }}</td>
            <td>{{ player.TradedKills }}</td>
            <td>{{ player.TradedDeaths }}</td>
            <td>{{ getKASTPercent(player.KASTRounds) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="container pad-top-20">
      <div class="flex-1 panel">
        <div class="panel-title">
          Summaries
        </div>
        <div class="panel-body">
          First Kill Conversion Rate: {{ match.FkConversions }}/{{ match.FkTotal }}
        </div>
      </div>
    </div>

    <div class="container pad-top-20">
      <div class="flex-1 panel">
        <div class="panel-title">
          Round by Round
        </div>
        <div class="panel-body">
          <table class="scoreboard">
            <thead>
              <tr>
                <th width="100px">Round</th>
                <th width="100px">Our Side</th>
                <th width="100px">First Blood</th>
                <th>Our Ults</th>
                <th>Enemy Ults</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="round in ultRounds" :key="round.roundNumber">
                <td>{{ round.roundNumber }}</td>
                <td :class="[round.ourWin ? 'win' : 'loss']">{{ round.side }}</td>
                <td>{{ round.ourFirstBlood ? round.firstBloodPlayer : "" }}</td>
                <td>
                  <span class="agent" v-if="round.ourUlts.length <= 0"></span>
                  <span v-for="agent in round.ourUlts" :key="agent" :class="[agent.toLowerCase(), 'agent']"></span>
                </td>
                <td>
                  <span v-for="agent in round.enemyUlts" :key="agent" :class="[agent.toLowerCase(), 'agent']"></span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="container pad-top-20">
      <div class="flex-1 panel">
        <div class="panel-title">
          XvY Conversions
        </div>
        <div class="panel-body">
          <table class="scoreboard">
            <thead>
              <tr>
                <th width="100px">Round</th>
                <th width="100px">Side</th>
                <th>Our Team</th>
                <th>Enemy Team</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="round in roundConversions" :key="round.roundNumber">
                <td>{{ round.round }}</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>