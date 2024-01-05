window.addEventListener('load',()=>{
    const username=document.getElementById("username");
    const fullname=document.getElementById("fullname");
    const email=document.getElementById("email");
    const password=document.getElementById("password");
    const repassword=document.getElementById("repassword");
    const registerbtn=document.getElementById("registerbtn");
    let validemail=false,validusername=false,validpassword=false;
    let un="",pass="",eml="",repass="";
    let usernameRegex = /^[a-z]+([._][a-z]+)*$/;
    let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[_@#$])(?=.*\d).{8,}$/;
    window.validateUsername=()=>{
        un=username.value;
        validusername=(usernameRegex.test(un)&&un.length>=6);
        if(!(usernameRegex.test(un)&&un.length>=6)){
            document.getElementById("l1").style.display="flex";
        }else{
            document.getElementById("l1").style.display="none";
        }
    }
    window.validateEmail=()=>{
        eml=email.value;
        validemail=(emailRegex.test(eml)&&eml.length>=6);
    }
    window.validatePassword=()=>{
        pass=password.value;
        validpassword=(passwordRegex.test(pass)&&pass.length>=8);
        if(!(passwordRegex.test(pass)&&pass.length>=8)){
            document.getElementById("l2").style.display="flex";
        }else{
            document.getElementById("l2").style.display="none";
        }
    }
    window.validateRePassword=()=>{
        repass=repassword.value;
        validpassword=(passwordRegex.test(repass)&&pass.length>=8);
        if(!(passwordRegex.test(repass)&&repass.length>=8)){
            document.getElementById("l2").style.display="flex";
        }else{
            document.getElementById("l2").style.display="none";
        }
    }
    window.validateForm=()=>{
        registerbtn.disabled=!(validemail&&validusername&&validpassword&&pass.match(repass));
    }
});