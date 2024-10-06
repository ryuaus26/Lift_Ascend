function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    $("name").text(profile.getName());
    
  }


  onSignIn();