<script>
import axios from 'axios';
import { format } from 'date-fns';
import ScrimItem from './ScrimItem.vue';

export default {
  props: {
    matches: Object
  },
  components: { ScrimItem },
  data() {
    return {
      selectedMatch: null,
      selectedPlayers: null
    };
  },
  methods: {
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
  <div class="container pad-top-20">
    <div class="flex-1 panel">
      <div class="panel-title">
        Recent Scrims
      </div>
      <ScrimItem v-for="match in matches" :key="match.MatchId" :match="match" />
    </div>
  </div>
</template>