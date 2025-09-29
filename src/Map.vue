<script>
import axios from 'axios';
export default {
  data() {
    return {
      maps: null
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      axios.get('https://podx12.github.io/valorant-scrim-tracker-web/parser_output.json')
        .then(response => {
          this.maps = response.data.find(m => m.Map == this.$route.params.map);
        })
        .catch(error => {
          console.error('There was an error fetching the data:', error);
        });
    },
    goBack() {
      this.$router.back();
    }
  }
}
</script>
<template>
  <div class="main-content" v-if="maps != null">
    <div class="pad-top-20"></div>
    <h1>{{ this.$route.params.map }} TODO</h1>
  </div>
</template>