<template>
  <header class="mt-3 nav-bar">
    <router-link v-bind:class="$route.name === 'Home' || $route.name === 'Reservation' ? 'bold-text' : ''" to="/">Book Travel</router-link> |
    <router-link v-bind:class="$route.name === 'PathFinder' ? 'bold-text' : ''" to="/path-finder">Path Finder</router-link> |
    <router-link v-bind:class="$route.name === 'TravelRecords' ? 'bold-text' : ''" to="/travel-records">Travel Records</router-link>
  </header>
  <div class="container" id="nav">
    <main role="main" class="pb-3">
      <router-view/>
    </main>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.nav-bar a {
  color: black !important;
  text-decoration: none;
}

.bold-text {
  font-weight: bold;
}

.display-none {
  display: none;
}

.text-bold {
  font-weight: bold;
}

.rounded-15 {
  border-radius: 15px !important;
}

</style>
