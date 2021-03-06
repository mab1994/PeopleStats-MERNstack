<template>
	<div class="row justify-content-center">
		<div class="col-md-8">
			<div class="">
				<div class="card-body greeting-p">
					Welcome to PeopleStats.<br />
					A simple app for managing forms and surveys.<br />
					You should have an account to use this service
				</div>
				<div class="jc-btn">
					<router-link to="/sign-in"  class="btn btn-warning mg-side-1" id="solid-btn">Sign into your account</router-link>
					<router-link to="/sign-up"  class="btn btn-outline-warning mg-side-1" id="outlined-btn"
						>Create a free account</router-link
					>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto&family=Sarala:wght@700&family=Varela&display=swap');
@media only screen and (max-width: 600px) {
	.jc-btn {
		justify-content: center;
		display: flex;
		flex-direction: column;
	}
	.mg-side-1 {
		margin: 2% 10% !important;
	}
}
.card-not-outlined {
	outline: none;
}
.greeting-p {
	font-weight: bold;
	text-align: center;
	font-size: 18px;
	font-family:'Roboto', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif
}
.jc-btn {
	justify-content: center;
	display: flex;
}
.mg-side-1 {
	margin: 1% 1%;
}
.btn {
	font-family: 'Roboto';
	border: none;
	/* background-color: orangered; */
}
#solid-btn {
	color: white;
	background-color: orangered;
}
#outlined-btn {
	color: orangered;
}
#outlined-btn:hover {
	color: white;
	background-color: orangered;
}
</style>
