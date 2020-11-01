/**
 * @author Hutinet Maxime <maxime@hutinet.ch>
 * @author Foltz Justin <justin.foltz@gmail.com>
 * @description Manage the register view and process
 * Date 12.2019
 */

$("#conflict").hide();
$("#badPass").hide();

// Submit button listener
$("#register").click( () => {
  if( checkForm(["username", "name", "pass", "rePass"]) && checkPassMatches()) {
    $.post("/register", { 
        username: String( $("#username").val() ),
        name:     String( $("#name").val() ),
        pass:     String( $("#pass").val() )
      }, () => { window.location = "/login"; }
    ).fail( (data) => {
      if( data.statusText === "Conflict") {
        unvalidate("username");
        $("#conflict").show();
      }
    });
  }
});

// Check and manage style of all fields of login form
function checkForm(inputs) {
  return inputs.every( i => checkInput(i) );
}

// Check if password field is valid
function checkPass() {
  return $("#rePass").val() === $("#pass").val();
}

// Check and manage style of one field of form 
function checkInput(input) {
  if($("#"+input).val() === "") {
    unvalidate(input)
    return false;
  }
  validate(input)
  return true;
}

// Apply the invalid style to an input
function unvalidate(input) {
  $("#"+input).removeClass('form-control  is-valid');
  $("#"+input).addClass('form-control  is-invalid');
}

//Apply the valid style to an input
function validate(input) {
  $("#"+input).removeClass('form-control  is-invalid');
  $("#"+input).addClass('form-control is-valid');
}

// Check password confirmation
$('#rePass').on('input', function() {
  checkPassMatches();
});

// Check passwords fields
function checkPassMatches() {
  if( $("#pass").val() !== "" && !checkPass() ) {
    $("#rePass").removeClass('form-control is-valid');
    $("#rePass").addClass('form-control is-invalid');
    $("#badPass").show();
    return false;
  } else {
    $("#rePass").removeClass('form-control is-invalid');
    $("#rePass").addClass('form-control is-valid');
    $("#badPass").hide();
    return true;
  }
}

