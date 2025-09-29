<script>
import RecentScrims from './components/scrims/RecentScrims.vue';
import RecentPerformance from './components/scrims/RecentPerformance.vue';
import axios from 'axios';

export default {
  data() {
    return {
      matches: [],
      recentMatches: [],
      mapStats: []
    }
  },
  components:
  {
    RecentScrims,
    RecentPerformance
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      axios.get('https://podx12.github.io/valorant-scrim-tracker-web/parser_output.json?v=1')
        .then(response => {
          this.matches = response.data;
          this.recentMatches = this.matches.slice(0, 10);

          this.matches.forEach(match => {
            //MATCH STATS
            var existingMatchStat = this.mapStats.find(m => m.Map == match.Map);
            if (existingMatchStat) {
              var roundsWon = match.MainTeam == 0 ? match.Team0Rounds : match.Team1Rounds;
              var roundsLost = match.MainTeam == 0 ? match.Team1Rounds : match.Team0Rounds;
              existingMatchStat.Wins += roundsWon > roundsLost ? 1 : 0;
              existingMatchStat.Losses += roundsWon < roundsLost ? 1 : 0;
            }
            else {
              var newMatchStat = {};
              newMatchStat.Map = match.Map;
              var roundsWon = match.MainTeam == 0 ? match.Team0Rounds : match.Team1Rounds;
              var roundsLost = match.MainTeam == 0 ? match.Team1Rounds : match.Team0Rounds;
              newMatchStat.Wins = roundsWon > roundsLost ? 1 : 0;
              newMatchStat.Losses = roundsWon < roundsLost ? 1 : 0;
              this.mapStats.push(newMatchStat);
            }
          });
        })
        .catch(error => {
          console.error('There was an error fetching the data:', error);
        });
    },
    getFirstKills(match) {
      var fks = 0;

      match.Players.forEach(p => {
        if (p.Team == match.MainTeam)
          fks += p.FirstKills;
      })

      return fks;
    },
    getWinPercent(match) {
      return `${Math.round(match.Wins / ((match.Wins + match.Losses) / 100))}%`;
    }
  }
}
</script>

<template>
  <!-- Make the body a component -->
  <div class="main-content">
    <div class="container pad-top-20">
      <RecentPerformance :recentMatches="recentMatches" />

      <div class="flex-1 panel">
        <div class="panel-title">
          First Kill Rate
        </div>
        <div class="panel-body">
          <ul>
            <li v-for="match in recentMatches">{{ getFirstKills(match) }} {{ match.Map }}</li>
          </ul>
        </div>
      </div>
      <div class="flex-1 panel">
        <div class="panel-title">
          Map Win Rate
        </div>
        <div class="panel-body">
          <ul>
            <li v-for="map in mapStats">{{ map.Map }}: {{ map.Wins }}/{{ map.Losses }} ({{ getWinPercent(map) }})</li>
          </ul>
        </div>
      </div>
      <div class="flex-1 panel">
        <div class="panel-title">
          Round Win%
        </div>
        <div class="panel-body">
          <div class="plhd"></div>
        </div>
      </div>
    </div>

    <RecentScrims :matches="matches" />

  </div>
</template>