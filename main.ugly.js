let useremail;function CheckUserCredits(){firebase.auth(appMain).onAuthStateChanged(user=>{if(user){user.getIdTokenResult().then(async idTokenResult=>{if(!localStorage.getItem(idTokenResult.token)){location.href=domain}else{console.log("signed in");useremail=user.email}}).catch(error=>{console.log(error)})}else{location.href=domain}})}const signOut=async _=>{await firebase.auth(appMain).signOut();localStorage.clear();CheckUserCredits()};CheckUserCredits();