<template>
	<div class="row justify-content-center">
		<div class="col-md-8">
			<div class="">
        <h3>Create a free account</h3><br/>
				<div class="card-body">
					<form>
						<label for="exampleFormControlInput1" class="form-label"
							>Full Name:</label
						>
						<input
							type="text"
							class="form-control"
							id="exampleFormControlInput1"
							placeholder="Your Full Name"
						/><br />
            <label for="exampleFormControlInput1" class="form-label"
							>Email Address:</label
						>
						<input
							type="text"
							class="form-control"
							id="exampleFormControlInput1"
							placeholder="must be with format: name@example.com"
						/><br />
            <label for="exampleFormControlInput1" class="form-label"
							>Password:</label
						>
						<input
							type="password"
							class="form-control"
							id="exampleFormControlInput1"
							placeholder="must contain at least 10 characters"
						/><br /><br />
            <div class="jc-btn">
            <button class="btn btn-warning" id="solid-btn">Register Now!</button>
            <button class="btn btn-outline-warning" id="outlined-btn">Or Log into your existing account!</button>
            </div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {}
</script>
<style scoped>
@media only screen and (max-width: 600px) {
  h3 {
  color: #0275d8;
  text-align: center;
}
	.jc-btn {
		justify-content: center;
		display: flex;
		flex-direction: column;
	}
  .form-control {
    outline: none
  }
}
h3 {
  color: #0275d8;
  margin-left: 3%;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
}
.form-control {
	width: 90%;
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
	background-color: #00000000;
}
#outlined-btn:hover {
	text-decoration: underline;
}
</style>
