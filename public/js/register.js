const api=location.protocol+"//"+ location.hostname+":"+location.port;
let checkloginstatus=async()=>{
    const check=await axios.get(api+"/api/user/getloginstatus");
    if(check.data.status==200){
        window.location.href=api+"/client/dashboard";
    }
}
window.addEventListener('load',async ()=>{
    checkloginstatus();
    const sidebar=document.getElementById("sidebar");
    let showSnackBar=(alert,message,backgroundColor)=>{
        let x = document.getElementById("snackbar");
        x.className="show "+alert;
        x.style.backgroundColor=backgroundColor;
        x.innerHTML=message;
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }
    function delay(ms,alert,message,backgroundColor) {
        let x = document.getElementById("snackbar");
        x.className="show "+alert;
        x.style.backgroundColor=backgroundColor;
        x.innerHTML=message;
        return new Promise(resolve => setTimeout(resolve=()=>{ x.className = x.className.replace("show", "");
        window.location.href = api+"/client/login"; }, ms));
    }
    window.hideSidebar=()=>{
        sidebar.style.display="none";
    }
    window.showSidebar=()=>{
        sidebar.style.display="flex";
    }
    const form=document.getElementById("registreform");
    const username=document.getElementById("username");
    const fullname=document.getElementById("fullname");
    const email=document.getElementById("email");
    const password=document.getElementById("password");
    const repassword=document.getElementById("repassword");
    form.addEventListener('submit',async (e)=>{
        e.preventDefault();
        let response=await axios.post(api+"/api/user/register",{username:username.value,fullname:fullname.value,email:email.value,password:password.value});
        if(response.data.status===200){
            username.value="";
            fullname.value="";
            email.value="";
            password.value="";
            repassword.value="";
            await delay(3000,"alert-success",`<i class="fa-solid fa-check-double "></i> ${response.data.message}`,"#198754a4");
        }else{
            showSnackBar("alert-danger",`<i class="fa-solid fa-bomb "></i> ${response.data.message}`,"#dc354696");
        }
    })
})