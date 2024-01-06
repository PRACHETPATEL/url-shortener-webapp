window.addEventListener('load',()=>{
    const username=document.getElementById("username");
    const fullname=document.getElementById("fullname");
    const email=document.getElementById("email");
    const password=document.getElementById("password");
    const repassword=document.getElementById("repassword");
    const registerbtn=document.getElementById("registerbtn");
    const resetbtn=document.getElementById("resetbtn");
    const currentpassword=document.getElementById('currentpassword');
    const passwordx=document.getElementById('password');
    const retypepassword=document.getElementById('retypepassword');
    let validemail=false,validusername=false,validpassword=false,validpasswordx=false,validcurrpassword=false;
    let un="",pass="",eml="",repass="",passx="",repassx="",currpass="";
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
    window.validatePasswordx=()=>{
        passx=passwordx.value;
        validpasswordx=(passwordRegex.test(passx)&&passx.length>=8);
        if(!(passwordRegex.test(passx)&&passx.length>=8)){
            document.getElementById("l2").style.display="flex";
        }else{
            document.getElementById("l2").style.display="none";
        }
    }
    window.validateRePasswordx=()=>{
        repassx=retypepassword.value;
        validpasswordx=(passwordRegex.test(repassx)&&repassx.length>=8);
        if(!(passwordRegex.test(repassx)&&repassx.length>=8)){
            document.getElementById("l2").style.display="flex";
        }else{
            document.getElementById("l2").style.display="none";
        }
    }
    window.validateCurrPassword=()=>{
        currpass=currentpassword.value;
        validcurrpassword=(passwordRegex.test(currpass)&&currpass.length>=8);
        if(!(passwordRegex.test(currpass)&&currpass.length>=8)){
            document.getElementById("l2").style.display="flex";
        }else{
            document.getElementById("l2").style.display="none";
        }
    }
    window.validateForm=()=>{
        registerbtn.disabled=!(validemail&&validusername&&validpassword&&pass.match(repass));
    }
    window.validateFormx=()=>{
        // if(repassx===""){
        //     repassx="a";
        // }
        // if(passx===""){
        //     passx="a";
        // }
        resetbtn.disabled=!(validpasswordx&&passx.match(repassx)&&validcurrpassword);
        // repassx=""
        // passx=""
    }
});