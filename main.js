document.addEventListener('DOMContentLoaded', function() {

  // add forms HTML to page
  document.getElementById('root').innerHTML = signInHTML + signUpHTML;

  //listeners
  //on sign up form select button
  document.getElementById("GOTOsignUp").addEventListener('click', function(){
    document.getElementById('signUpForm').className = 'visiable';
    document.getElementById('signInForm').className = 'hidden';
  })
  //on return to sign in form select button
  document.getElementById("backToSignIn").addEventListener('click', function(){
    document.getElementById('signUpForm').className = 'hidden';
    document.getElementById('signInForm').className = 'visiable';
  })
  //on signIn form submit
  document.getElementById("signInForm").addEventListener('submit', function(e){
    e.preventDefault();
    AJAX.signInRequest();
  })
  //on signUp form submit
  document.getElementById("signUpForm").addEventListener('submit', function(e){
    e.preventDefault();
    AJAX.signUpRequest();
  })
})