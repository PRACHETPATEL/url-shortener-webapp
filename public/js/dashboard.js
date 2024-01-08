const api=location.protocol+"//"+ location.hostname+":"+location.port;
let checkloginstatus=async()=>{
    const check=await axios.get(api+"/api/user/getloginstatus");
    if(check.data.status!=200){
        window.location.href=api+"/client/home";
    }
}
window.addEventListener('load',async ()=>{
    await checkloginstatus();
    let urls;
    const profile=document.getElementById('profile');
    const profile3=document.getElementById('profile3');
    const username=document.getElementById('username');
    const email=document.getElementById('email');
    let user=await axios.get(api+"/api/user/profile");
    profile.src="../images/profiles/"+user.data.profile.profile;
    profile3.src="../images/profiles/"+user.data.profile.profile;
    username.innerText=user.data.profile.username;
    email.innerText=user.data.profile.email;
    const sidebar=document.getElementById("sidebar");
    const form=document.getElementById("urlform");
    let url_list=document.getElementById("urls");
    let apiurlshorten=api+"/api/url/shorten";
    let showSnackBar=(alert,message,backgroundColor)=>{
        let x = document.getElementById("snackbar");
        x.className="show "+alert;
        x.style.backgroundColor=backgroundColor;
        x.innerHTML=message;
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }
    window.hideSidebar=()=>{
        sidebar.style.display="none";
    }
    window.showSidebar=()=>{
        
        sidebar.style.display="flex";
    }
    const displayUrlList=async ()=>{    
        url_list.innerHTML="";
        let responseurls=await axios.get(api+"/api/url",{ withCredentials:true });
        // console.log(responseurls);
        // console.log(responseurls.data.urls);
        urls=responseurls.data.urls; 
        let count=0;
        if(urls){
        urls.forEach(element => {
            const url_item=document.createElement('div');
            url_item.id=count;
            url_item.classList.add('d-flex');
            url_item.classList.add("justify-content-between");
            url_item.classList.add("align-items-center");
            url_item.classList.add("gap-3");
            url_item.innerHTML=` <div class="w-100  d-flex flex-lg-row flex-sm-column py-1 flex-column gap-2">
            <div class="col-lg-10 col-sm-12 col-12 bg-white  d-flex flex-lg-row flex-column p-1 gap-2 align-items-center" style="min-height: 8vh;border-radius: 0.375rem;">
                <div class="col-lg-8 col-12  d-flex flex-lg-row  gap-2 justify-content-between align-items-center">
                    <div class="col-lg-6 " style="white-space:nowrap;overflow: hidden;font-size: 1.2rem;width:50%;text-overflow: ellipsis;" title="${element.url}">${element.url}</div>
                    <a class="col-lg-6 " href="${element.shortened_url}" id="url-${count}" target="_blank" style="text-overflow: ellipsis;width:50%;white-space:nowrap;overflow: hidden;font-size: 1.2rem;">${element.shortened_url}</a>
                </div>
                <div class="col-lg-3 col-12 d-flex flex-lg-row  gap-4 justify-content-between align-items-center">
                    <i class="fa-solid fa-qrcode" title="generate QRcode" onclick=generateQR(${count},"${element.shortened_url}")  style="font-size: 1.5rem;"></i>
                    <i class="fa-solid fa-chart-line" onclick=viewStats(${count},"${element._id}") title="View Stats" style="font-size: 1.5rem;"></i>
                    <i class="fa-solid fa-copy" title="Copy Short URL" onclick=copyUrl(${count},"${element.shortened_url}") style="font-size: 1.5rem;"></i>
                    <i class=" d-lg-none d-flex fa-solid fa-pen-to-square" title="Edit" onclick="showUpdateUrl('update-${count}')" style="font-size: 1.5rem;"></i>
                    <i class=" d-lg-none d-flex fa-solid fa-trash" title="Hide" onclick=deleteUrl("${element._id}") style="font-size: 1.5rem;"></i>
                </div>
            </div>
            <div class="nav-item col-lg-1 d-lg-flex justify-content-center d-sm-none d-none "><i class="fa-solid fa-pen-to-square" title="Edit"  onclick="showUpdateUrl('update-${count}')" style="font-size: 2rem;line-height: inherit   !important;"></i></div>                         
            <div class="nav-item col-lg-1 d-lg-flex justify-content-center d-sm-none d-none "><i class="fa-solid fa-trash"  title="Delete"  onclick=deleteUrl("${element._id}") style="font-size: 2rem;line-height: inherit !important;"></i></div>
        
        </div>
        `;
        const  update_item=document.createElement('div');
        update_item.id=`update-${count}`;
        update_item.classList.add("my-2");
        update_item.classList.add("w-100");
        update_item.style.display='none';
        // <div id="update-${count}" class="w-100 my-2" method="post" style="display: none;">
        update_item.innerHTML=`
        <div class="w-100  d-flex flex-lg-row flex-sm-column flex-column gap-2">
            <input id="input-${count}" class="px-2 col-lg-8 " placeholder="Enter New URL Here" style="height: 7vh;border-radius: 0.375rem;border: none;line-height: 100%;" type="url" required>
            <button  onclick=updateUrl("${element._id}","input-${count}") class="btn bg-secondary  d-lg-block  col-lg-3 d-sm-none d-none " type="button" style="height: 7vh;">UPDATE URL</button>
            <div onclick=hideUpdateUrl('update-${count}') class="btn bg-secondary nav-item col-lg-1 d-lg-flex justify-content-center align-items-center  d-sm-none d-none text-primary" style="font-weight: 600;">X</div>
            <div class="d-flex justify-content-between">
                <button class="btn bg-secondary  d-lg-none d-block col-8 " onclick=updateUrl('${element._id}',"input-${count}") type="button" style="height: 7vh;">UPDATE URL</button>
                <button class="btn bg-secondary  d-lg-none d-block col-3 "  onclick=hideUpdateUrl('update-${count}')>CLOSE</button>
            </div>
        </div>`
        count++;
        url_list.appendChild(url_item);
        url_list.appendChild(update_item);
        });
    }
    }
    displayUrlList();
   window.hideUpdateUrl=(id)=>{
    document.getElementById(id).style.display="none"
   }
   window.showUpdateUrl=(id)=>{
    for(let i=0;i<urls.length;i++){
        document.getElementById('update-'+i).style.display="none";
    }
    document.getElementById(id).style.display="block"
   }
    window.deleteUrl=(id)=>{
            axios.delete(api+"/api/url/"+id).then((response)=>{
            if(response.data.status===201){
                showSnackBar("alert-success",`<i class="fa-solid fa-check-double "></i> ${response.data.message}`,"#198754a4");
                displayUrlList();
            }else if(response.data.status===404){
                showSnackBar("alert-danger","<i class='fa-solid fa-bomb  '></i> "+response.data.message,"#dc354696");
            }else{
                showSnackBar("alert-danger","<i class='fa-solid fa-bomb  '></i>  Something went wrong...","#dc354696");
            }
        })
    }
    window.updateUrl=(id,input)=>{
        let checkx=document.getElementById(input).value;
        document.getElementById(input).value="";
        if(checkx&&checkx.length>=6){
            axios.put(api+"/api/url/"+id,{url:checkx}).then((response)=>{
                if(response.data.status===202){
                    showSnackBar("alert-success",`<i class="fa-solid fa-check-double "></i> URL updated <br> Successfully!!`,"#198754a4");
                    displayUrlList();
                    hideUpdateUrl("update-"+input.slice(0,-1))
                }else if(response.data.status===400){
                    showSnackBar("alert-danger","<i class='fa-solid fa-bomb  '></i> "+response.data.message,"#dc354696");
                }else{
                    showSnackBar("alert-danger","<i class='fa-solid fa-bomb  '></i>  Something went wrong...","#dc354696");
                }
            })
        }else{
            showSnackBar("alert-danger","<i class='fa-solid fa-bomb  '></i>  URL IS TOO SHORT!!","#dc354696");
        }
    }
    window.generateQR=(id,url)=>{
        const myModal = new bootstrap.Modal(document.getElementById('qrModal'), focus);
        myModal.show();
        document.getElementById('loader').style.display = 'flex ';
        document.getElementById('displayqr').style.display = 'none';
        let qr=window.qr = new QRious({
            element: document.getElementById('qrcode'),
            value: url,
            size: 150,
        });
        qr.foreground="white";
        qr.background="black";
        let dataURL=qr.toDataURL('image/png');
        let a = document.getElementById('downloadLink');
        a.href = dataURL;
        a.download = id + '.png';
        setTimeout(()=>{
            document.getElementById('loader').style.display = 'none';   
            downloadLink.style.display = 'block'; 
            document.getElementById('displayqr').style.display = 'flex';
        },500);
    }
    window.copyUrl=(id,url)=>{
      let tempInput = document.createElement('input');
      tempInput.value = url;
      document.body.appendChild(tempInput);
      tempInput.select();
      tempInput.setSelectionRange(0, 99999);
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      showSnackBar("alert-success",`<i class="fa-solid fa-check "></i> Url Copied`,"#198754a4");
    }
    window.viewStats=async (id,objid)=>{
        // console.log(objid);
        window.location.href="/client/stats/"+objid
    }
    form.addEventListener('submit',async(e)=>{
        e.preventDefault();
        const url=document.getElementById("url").value;
        document.getElementById("url").value="";
        await axios.post(apiurlshorten,{url:url},{ withCredentials: true }).then((response)=>{
            showSnackBar("alert-success",`<i class="fa-solid fa-check-double "></i> ${response.data.message}`,"#198754a4");
        }).catch((err)=>{
            if(err.response.data.status===400){
                showSnackBar("alert-danger",`<i class='fa-solid fa-bomb  '></i>  ${err.response.data.message}`,"#dc354696");
                return;
            }
            showSnackBar("alert-danger","<i class='fa-solid fa-bomb  '></i>  Something went wrong...","#dc354696");
            console.log(err);
        })
        displayUrlList();
    })
})