<script>
import { format } from 'date-fns';
export default {
  props: {
    match: Object
  },
  methods: {
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
    openMatch(matchId) {
      this.$router.push({ name: 'matches', params: { id: matchId } });
    },
    matchScore() {
      return this.match.MainTeam == 0
        ? `${this.match.Team0Rounds} - ${this.match.Team1Rounds}`
        : `${this.match.Team1Rounds} - ${this.match.Team0Rounds}`;
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
    }
  }
}
</script>

<template>
  <div class="panel-item clickable" v-on:click="openMatch(match.MatchId)">
    <div class="container v-center">
      <div class="match-details flex-12">
        <span class="name">{{ match.Map }}</span>
        <span class="score" :class="[matchScoreColor()]">{{ matchScore() }}</span>
        <span class="date">{{ formattedDate(match.DateTime) }}</span>
        <span class="time">{{ formattedTime(match.DateTime) }}</span>
      </div>
      <div class="team-comp">
        <label>Our Comp</label>
        <div class="agent-list" v-if="match.MainTeam == 0">
          <span v-for="agent in match.Team0Agents" :key="agent" :class="[agent.toLowerCase(), 'agent']"></span>
        </div>
        <div class="agent-list" v-if="match.MainTeam == 1">
          <span v-for="agent in match.Team1Agents" :key="agent" :class="[agent.toLowerCase(), 'agent']"></span>
        </div>
      </div>
      <div class="actions">
        <button>View Details</button>
      </div>
    </div>
  </div>
</template>