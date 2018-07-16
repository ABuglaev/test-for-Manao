//Object with AJAX functions as methods
//whatever i tried, but it seems impossible to send FormData object via fetch
let AJAX = (function() {
  let signInRequest = function() {
let formdata = new FormData(document.getElementById("signInForm"));
    fetch(CONFIG.URLin, {  
      method: 'post',
      body: new URLSearchParams([...formdata]),
    }).then(function (response) {
      return response.json();
    }).then(function(resJSON) {
      alert(resJSON.message);
      if(resJSON.userStatus) {document.getElementById('signInForm').className = 'hidden';}
    });
  }

  let signUpRequest = function() {
    if(document.getElementById("signUpPassword").value !== document.getElementById("signUpConfirm").value) {
      alert('passwords don\'t match');
      document.getElementById("signUpPassword").value = '';
      document.getElementById("signUpConfirm").value = '';
      return;
    } 
    let formdata = new FormData(document.getElementById("signUpForm"));
    fetch(CONFIG.URLup, {
      method: "post",
      body: new URLSearchParams([...formdata]),
    }).then(function (response) {
      return response.json();
    }).then(function(resJSON) {
      alert(resJSON.message);
    });
  }

  return({
    signInRequest : signInRequest, 
    signUpRequest : signUpRequest,
  });
})();