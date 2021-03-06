<template>
	<div>
		<Navigation />
		<br />
		<transition name="fade">
			<router-view></router-view>
		</transition>
	</div>
</template>

<script>
import Navigation from './components/Navigation'

export default {
	name: 'App',
  components: {
    Navigation
  }
}
</script>

<style>

#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-active {
	opacity: 0;
}
</style>
