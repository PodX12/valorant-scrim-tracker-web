<script>
import axios from 'axios';
import { format } from 'date-fns';

export default {
  data() {
    return {
      matches: null,
      selectedMatch: null,
      selectedPlayers: null
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
        })
        .catch(error => {
          console.error('There was an error fetching the data:', error);
        });
    },
    selectMatch(match) {
      this.selectedMatch = match;
      this.selectedMatch.Players.sort((a, b) => {
        return b.Kills - a.Kills;
      });
      this.selectedPlayers = this.selectedMatch.Players;
    },
    formattedDate(dateTime) {
      const dateObject = new Date(dateTime);
      const formattedString = format(dateObject, 'yyyy-MM-dd HH:mm');
      return formattedString;
    },
    setSelectedTeam(team) {
      if (team > -1) {
        this.selectedPlayers = this.selectedMatch.Players.filter(a => a.Team == team);
      } else {
        this.selectedPlayers = this.selectedMatch.Players;
      }
      var count = 0;
      this.selectedPlayers.forEach(p => {
        count = count + p.FirstKills;
      });
      console.log(`FIRST KILLS: ${count}`)
    },
    getKASTPercent(kast) {
      return `${Math.round(kast / (24 / 100))}%`;
    }
  }
}
</script>

<template>
  <div>
    <div class="match-list" v-if="selectedMatch === null">
      <div v-for="match in matches" :key="match.MatchId" v-on:click="selectMatch(match)" class="match" :style="{ backgroundImage: 'url(' + '/images/maps/' + match.Map + '.png' + ')' }">
        <div class="map-name"><span class="bold">{{ match.Map }}</span> <span class="match-date">{{ formattedDate(match.DateTime) }}</span></div>
        <div class="match-score">
          <span v-for="agent in match.Team0Agents" :key="agent" class="match-agent" :style="{ backgroundImage: 'url(' + '/images/agents/' + agent.toLowerCase() + '.webp' + ')' }"></span>
          <span class="round-score">{{ match.Team0Rounds + '-' + match.Team1Rounds }}</span>
          <span v-for="agent in match.Team1Agents" :key="agent" class="match-agent" :style="{ backgroundImage: 'url(' + '/images/agents/' + agent.toLowerCase() + '.webp' + ')' }"></span>
        </div>
      </div>
    </div>

    <div class="selected-match" v-if="selectedMatch !== null">
      <a href="#" v-on:click="selectedMatch = null">&lt; Back</a>
      <br />
      <a href="#" v-on:click="setSelectedTeam(-1)">Show All</a> | <a href="#" v-on:click="setSelectedTeam(0)">Team 0</a> | <a href="#" v-on:click="setSelectedTeam(1)">Team 1</a>
      <h3>{{ selectedMatch.Map }}: {{ selectedMatch.Team0Rounds + '-' + selectedMatch.Team1Rounds }}</h3>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>PLAYER</th>
            <th>K</th>
            <th>D</th>
            <th>K/D</th>
            <th>A</th>
            <th>FK</th>
            <th>FD</th>
            <th>TFK</th>
            <th>TFD</th>
            <th>TrK</th>
            <th>TrD</th>
            <th>KAST%</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="player in selectedPlayers" :key="player.Key">
            <td><img :src="'/images/agents/' + player.Agent.toLowerCase() + '.webp'" :alt="player.Agent" /></td>
            <td>{{ player.Name }}</td>
            <td>{{ player.Kills }}</td>
            <td>{{ player.Deaths }}</td>
            <td class="green-text">{{ (player.Kills / player.Deaths).toFixed(2) }}</td>
            <td>{{ player.Assists }}</td>
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
  </div>
</template>