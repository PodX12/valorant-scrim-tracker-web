<script>
export default {
  props: {
    recentMatches: Object
  },
  methods: {
    matchScoreColor(match) {
      var isWin = match.MainTeam == 0
        ? match.Team0Rounds > match.Team1Rounds
        : match.Team1Rounds > match.Team0Rounds;

      return isWin ? "green" : "red";
    },
    getRecentGameWinPercent() {
      var wonRounds = 0;
      var lostRounds = 0;

      this.recentMatches.forEach(m => {
        var isWin = m.MainTeam == 0
          ? m.Team0Rounds > m.Team1Rounds
          : m.Team1Rounds > m.Team0Rounds;

        if (isWin) {
          wonRounds++;
        }
        else {
          lostRounds++;
        }
      });

      return `${(wonRounds / (wonRounds + lostRounds) * 100).toFixed(0)}%`;
    }
  }
}
</script>

<template>
  <div class="flex-1 panel">
    <div class="panel-title">
      Recent Performance
    </div>
    <div class="panel-body">
      <div class="large-title green pad-top-20">
        {{ getRecentGameWinPercent() }}
      </div>
      <div class="sub-title">
        Last 10 games
      </div>
      <div>
        <span v-for="match in recentMatches" class="dot" :class="[matchScoreColor(match)]"></span>
      </div>
    </div>
  </div>
</template>