<template>
	<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Navbar</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
      <ul class="navbar-nav ml-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <router-link to="/" class="nav-link btn">Surveys</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/sign-in" class="nav-link btn" href="#">Sign In</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/sign-up" class="nav-link btn" href="#">Register</router-link>
        </li>
      </ul>
    </div>
  </div>
</nav>
</template>
<script>
export default {}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto&family=Sarala:wght@700&family=Varela&display=swap');
.btn {
	letter-spacing: 1px;
	font-weight: 500;
	border: none;
	font-family: 'Roboto';
	font-size: 16px;
	color: white !important;
}
.btn:hover {
	background-color: white;
	color: #0275d8 !important;
	font-weight: bold;
}
.btn:focus {
	box-shadow: none !important;
}
.btn:active {
	box-shadow: none;
	background-color: white !important;
	color: #0275d8 !important;
	font-weight: bold !important;
}
ul {
	justify-content: space-between;
	width: 23%
}
</style>
