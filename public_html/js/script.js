$(document).ready(function() {
	/** jQuery Validation Form **/

	$("#contact").validate({
		debug: true,
		errorClass: "alert alert-danger",
		errorLabelContainer: "#output-area",
		errorElement: "div",

		// Defines good and bad input - Each rule starts with the element's NAME attribute
		rules: {

			name: {
				required: true
			},

			email: {
				email: true,
				required: true
			},

			message: {
				required: true,
				maxlength: 2000
			}

		},

		// Error messages to display when rules don't pass
		messages: {
			name: {
				required: "Please enter your name."
			},
			email: {
				required: "Please enter your email.",
				email: "Invalid Email."
			},
			message: {
				required: "Please enter a message.",
				maxlength: "Max character length is 2000, please shorten your message."
			}
		},

		submitHandler: function(form) {
			$("#contact").ajaxSubmit({
				type: "POST",
				url: $("#contact").attr("action"),
				success: function(ajaxOutput) {
					$("#output-area").css("display", "")
					$("#output-area").html(ajaxOutput)

					if($(".alert-success").length >= 1) {
						$("#contact")[0].reset();
					}
				}
			})
		}

	})
})