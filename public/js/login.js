
window.addEventListener('load',async ()=>{
    const api=location.protocol+"//"+ location.hostname+":"+location.port;
let checkloginstatus=async()=>{
    const check=await axios.get(api+"/api/user/getloginstatus");
    if(check.data.status==200){
        window.location.href=api+"/client/dashboard";
    }
}
    const body=document.querySelector('.container');
    const loader=document.getElementById('mainloader');
    body.style.display="none";
    loader.style.display="flex";
    await checkloginstatus();
    body.style.display="block";
    loader.style.display="none";
    const sidebar=document.getElementById("sidebar");
    const form=document.getElementById('loginform');
    let showSnackBar=(alert,message,status,backgroundColor,ms)=>{
        let x = document.getElementById("snackbar");
        x.className="show "+alert;
        x.style.backgroundColor=backgroundColor;
        x.innerHTML=message;
        setTimeout(function(){ x.className = x.className.replace("show", "");if(status){window.location.href=api+"/client/dashboard"} }, ms);
    }
    form.addEventListener('submit',async(e)=>{
        e.preventDefault();
        let usernameoremail=document.getElementById('usernameoremail').value;
        let password=document.getElementById('password').value;
        body.style.display="none";
        loader.style.display="flex";
        const response=await axios.post(api+"/api/user/login",{usernameoremail:usernameoremail,password:password});
        if(response.data.status===200){
            document.getElementById('password').value="";
            document.getElementById('usernameoremail').value="";
            showSnackBar("alert-success",`<i class="fa-solid fa-check-double "></i> ${response.data.message}`,true,"#198754a4",1000);
        }else{
            showSnackBar("alert-danger",`<i class="fa-solid fa-bomb "></i> ${response.data.message}`,false,"#dc354696",4000);
        }
        body.style.display="block";
        loader.style.display="none";
    })
   
    window.hideSidebar=()=>{
        sidebar.style.display="none";
    }
    window.showSidebar=()=>{
        sidebar.style.display="flex";
    }
})