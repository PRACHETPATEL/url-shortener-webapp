const api=location.protocol+"//"+ location.hostname+":"+location.port;
let checkloginstatus=async()=>{
    const check=await axios.get(api+"/api/user/getloginstatus");
    if(check.data.status!=200){
        window.location.href=api+"/client/home";
    }
}
window.addEventListener('load',async ()=>{
    await checkloginstatus();
    const ctx = document.getElementById('myChart');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    const sidebar=document.getElementById("sidebar");
    const profile=document.getElementById('profile');
    const profile3=document.getElementById('profile3');
    const username=document.getElementById('username');
    const email=document.getElementById('email');
    let user=await axios.get(api+"/api/user/profile");
    profile.src="../../images/profiles/"+user.data.profile.profile;
    profile3.src="../../images/profiles/"+user.data.profile.profile;
    username.innerText=user.data.profile.username;
    email.innerText=user.data.profile.email;
    let pathname = location.pathname;
    let parts = pathname.split('/');
    let statsIndex = parts.indexOf('stats');
    let url_id;
    if (statsIndex !== -1 && statsIndex < parts.length - 1) {
        url_id = parts[statsIndex + 1];
    }else{
        window.location.href="/client/dashboard"
    }
    
    let response=await axios.get(api+"/api/url/stats/"+url_id);
    console.log(response.data);
     window.hideSidebar=()=>{
        sidebar.style.display="none";
    }
    window.showSidebar=()=>{
        
        sidebar.style.display="flex";
    }
})