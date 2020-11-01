/**
 * @author Hutinet Maxime <maxime@hutinet.ch>
 * @author Foltz Justin <justin.foltz@gmail.com>
 * @description Manage the map login view and process
 * Date 12.2019
 */

$('.alert').hide();

// Submit button listener
$("#login").click( () => {
  if( !checkForm(["username","pass"]) ) {
    return;
  }
  $.post("/login", {
      username: String( $("#username").val() ),
      pass: String( $("#pass").val() )
  }, (data) => {
        localStorage.setItem('token', data.token);
        window.location = "/map";
  }).fail( () => {
    window.location = "/login";
  });
});


// Check and manage style of all fields of login form
function checkForm(inputs) {
  return inputs.every( i => checkInput(i) );
}

// Check and manage style of one field of form 
function checkInput(input) {
  if($("#"+input).val() === "") {
    $("#"+input).removeClass('is-valid');
    $("#"+input).addClass('is-invalid');
    return false;
  }
  $("#"+input).removeClass('is-invalid');
  return true;
}



