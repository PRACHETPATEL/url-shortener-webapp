const api=location.protocol+"//"+ location.hostname+":"+location.port;
let checkloginstatus=async()=>{
    const check=await axios.get(api+"/api/user/getloginstatus");
    if(check.data.status!=200){
        window.location.href=api+"/client/home";
    }
}
window.addEventListener('load',async ()=>{
    const body=document.querySelector('.container');
    const loader=document.getElementById('mainloader');
    body.style.display="none";
    loader.style.display="flex";
    await checkloginstatus();
    const profile=document.getElementById('profile');
    const profile1=document.getElementById('profile1');
    const profile2=document.getElementById('profile2');
    const profile3=document.getElementById('profile3');
    
    // const profilecard=document.getElementById('profilecard');
    // const name=document.getElementById('name');
    const username=document.getElementById('username');
    const namex=document.getElementById('namex');
    const usernamex=document.getElementById('usernamex');
    const email=document.getElementById('email');
    const emailx=document.getElementById('emailx');
    const passwordreset=document.getElementById('changepass');
    const form=document.getElementById('profileform');
    const sidebar=document.getElementById("sidebar");
    const profilepics=document.getElementById('profilepics');
    const currentpassword=document.getElementById('currentpassword');
    const password=document.getElementById('password');
    const retypepassword=document.getElementById('retypepassword');
    let user=await axios.get(api+"/api/user/profile");
    profile.src="../images/profiles/"+user.data.profile.profile;
    profile1.src="../images/profiles/"+user.data.profile.profile;
    profile2.src="../images/profiles/"+user.data.profile.profile;
    profile3.src="../images/profiles/"+user.data.profile.profile;
    
    // profilecard.style.backgroundImage="url('../images/profiles/"+user.data.profile.profile+"')";
    // name.innerText="Hi, "+user.data.profile.fullname;
    username.innerText=user.data.profile.username;
    email.innerText=user.data.profile.email;
    namex.value=user.data.profile.fullname;
    usernamex.value=user.data.profile.username;
    emailx.value=user.data.profile.email;
    let loadProfiles=()=>{
        let profilepicshtml="";
        for(let i=0;i<24;i++){
            if(user.data.profile.profile.match(i+".png")){
                profilepicshtml+=`
                <div class="item item-avatar active" id="profile-${i}" onclick=selectProfile('profile-${i}') >
                <div class="checked"><i class="fas fa-check"></i></div>
                <div class="profile-avatar">
                    <img src="../images/profiles/${i}.png">
                </div>
                </div>
                `
                document.getElementById('profilepic').value=`${i}.png`;
            }else{
                profilepicshtml+=`
                <div class="item item-avatar" id="profile-${i}" onclick=selectProfile('profile-${i}') >
                <div class="checked"><i class="fas fa-check"></i></div>
                <div class="profile-avatar">
                    <img src="../images/profiles/${i}.png">
                </div>
                </div>
                `
            }
        }
        profilepics.innerHTML=profilepicshtml;
    }
    loadProfiles();
    body.style.display="block";
    loader.style.display="none";
    window.selectProfile=(id)=>{
        // console.log(id);
        const unactive=document.querySelector(".active");
        unactive.classList.remove("active");
        document.getElementById(id).classList.add("active");
        let x="";
        for(let i=8;i<id.length;i++){
            x+=id.charAt(i);
        }
        document.getElementById('profilepic').value=`${x}.png`;
        profile1.src=`../images/profiles/${x}.png`;
        profile2.src=`../images/profiles/${x}.png`;
    }
    let showSnackBar=(alert,message,backgroundColor,status)=>{
        let x = document.getElementById("snackbar");
        x.className="show "+alert;
        x.style.backgroundColor=backgroundColor;
        x.innerHTML=message;
        setTimeout(function(){ x.className = x.className.replace("show", "");if(status){window.location.reload();}}, 3000);
    }
    window.hideSidebar=()=>{
        sidebar.style.display="none";
    }
    window.showSidebar=()=>{
        sidebar.style.display="flex";
    }
    form.addEventListener('submit',async(e)=>{
        e.preventDefault();
        let profilepicname=document.getElementById('profilepic').value;
        let fullname=namex.value;
        const response=await axios.put(api+"/api/user/profile",{name:fullname,profile:profilepicname});
        if(response.data.status===202){
            showSnackBar("alert-success",`<i class="fa-solid fa-check-double "></i> ${response.data.message}`,"#198754a4",true);     
        }else{
            showSnackBar("alert-danger",`<i class='fa-solid fa-bomb  '></i>  ${response.data.message}`,"#dc354696",false);
        }
    });
    passwordreset.addEventListener('submit',async(e)=>{
        e.preventDefault();
        const response=await axios.post(api+"/api/user/resetpassword",{currentpassword:currentpassword.value,password:password.value,retypepassword:retypepassword.value});
        if(response.data.status===202){
            showSnackBar("alert-success",`<i class="fa-solid fa-check-double "></i> ${response.data.message}`,"#198754a4",true);
            currentpassword.value="";
            password.value="";
            retypepassword.value="";
        }else{
            showSnackBar("alert-danger",`<i class='fa-solid fa-bomb  '></i>  ${response.data.message}`,"#dc354696",false);
        }
    })
})