const api=location.protocol+"//"+ location.hostname+":"+location.port;
let checkloginstatus=async()=>{
    const check=await axios.get(api+"/api/user/getloginstatus");
    if(check.data.status!=200){
        window.location.href=api+"/client/home";
    }
}
window.addEventListener('load',async ()=>{
    await checkloginstatus();
    const body=document.querySelector('.container');
    const loader=document.getElementById('mainloader');
    body.style.display="none";
    loader.style.display="flex";
    const ctx = document.getElementById('myChart');
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
    let showSnackBar=(alert,message,backgroundColor)=>{
        let x = document.getElementById("snackbar");
        x.className="show "+alert;
        x.style.backgroundColor=backgroundColor;
        x.innerHTML=message;
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }
    let displayBarGraph=(index,x_axis,y_axis)=>{
        new Chart(ctx, {
            type: 'bar',
            data: {
              labels: x_axis,
              datasets: [{
                label: 'no of visits',
                data: y_axis,
                backgroundColor:"rgba(255,214,149,1)",
                color:"white",
                borderWidth: 1
              }]
            },
            options: {
              scales: {
                x: {
                    ticks: {
                      color: '#FFFFFF', 
                    }
                  },
                y: {
                    beginAtZero: true,
                    ticks: {
                      color: '#FFFFFF',
                    }
                  }
              },
              
            },
            plugins: {
                legend: {
                  display: false
                }
              }
        });
    }
    let response=await axios.get(api+"/api/url/stats/"+url_id);
    let last_visit_time,total_visits,visits_per_hour,visits_per_month,week_visits,longurl,shorturl;
    if(response.data.status===200){
        last_visit_time=response.data.last_visit_time;
        total_visits=response.data.total_visits;
        visits_per_hour=response.data.visits_per_hour;
        visits_per_month=response.data.visits_per_month;
        week_visits=response.data.week_visits;
        visits_percent_days=response.visits_percent_days;
        longurl=response.data.longurl;
        shorturl=response.data.shorturl;
        document.getElementById("shorturl").innerText=shorturl;
        if(longurl.length>=36){
            document.getElementById("longurl").innerText=longurl.substring(0,36)+"...";
        }else{
            document.getElementById("longurl").innerText=longurl;
        }
        document.getElementById("longurl").href=longurl;
        document.getElementById("shorturl2").href=shorturl;
        document.getElementById("totalvisits").innerText="Total Visits: "+total_visits;
        if(last_visit_time.match("a few seconds")){
            document.getElementById("lastvisit").innerText="Last Visit: Just Now";
        }else{
            document.getElementById("lastvisit").innerText="Last Visit: "+last_visit_time +" ago";
        }
        displayBarGraph(0,['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], week_visits);
        body.style.display="block";
        loader.style.display="none";
    }else if(response.data.status===400||response.data.status===404){
        window.location.href="../../client/dashboard"
    }
    window.generateQR=()=>{
        const myModal = new bootstrap.Modal(document.getElementById('qrModal'), focus);
        myModal.show();
        document.getElementById('loader').style.display = 'flex ';
        document.getElementById('displayqr').style.display = 'none';
        let qr=window.qr = new QRious({
            element: document.getElementById('qrcode'),
            value: shorturl,
            size: 150,
        });
        qr.foreground="white";
        qr.background="black";
        let dataURL=qr.toDataURL('image/png');
        let a = document.getElementById('downloadLink');
        a.href = dataURL;
        a.download = shorturl + '.png';
        setTimeout(()=>{
            document.getElementById('loader').style.display = 'none';   
            downloadLink.style.display = 'block'; 
            document.getElementById('displayqr').style.display = 'flex';
        },500);
    }
    window.copyUrl=()=>{
        
      let tempInput = document.createElement('input');
      tempInput.value = shorturl;
      document.body.appendChild(tempInput);
      tempInput.select();
      tempInput.setSelectionRange(0, 99999);
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      showSnackBar("alert-success",`<i class="fa-solid fa-check "></i> Url Copied`,"#198754a4");
    }
     window.hideSidebar=()=>{
        sidebar.style.display="none";
    }
    window.showSidebar=()=>{
        
        sidebar.style.display="flex";
    }
    
})