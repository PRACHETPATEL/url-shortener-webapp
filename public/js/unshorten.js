const api=location.protocol+"//"+ location.hostname+":"+location.port;
let checkloginstatus=async()=>{
    const check=await axios.get(api+"/api/user/getloginstatus");
    if(check.data.status==200){
        window.location.href=api+"/client/dashboard";
    }
}
window.addEventListener('load',async ()=>{
    await checkloginstatus();
    const form=document.getElementById("urlform");
    let url_list=document.getElementById("urls");
    const sidebar=document.getElementById("sidebar");
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
    window.copyUrl=(url)=>{
        let tempInput = document.createElement('input');
        tempInput.value = url;
        document.body.appendChild(tempInput);
        tempInput.select();
        tempInput.setSelectionRange(0, 99999);
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showSnackBar("alert-success",`<i class="fa-solid fa-check "></i> Url Copied`,"#198754a4");
    }
    form.addEventListener('submit',async (e)=>{
        e.preventDefault();
        const url=document.getElementById("url").value;
        document.getElementById("urls").classList.add('mt-3');
        document.getElementById("url").value="";
        const longurl=await axios.post(api+"/api/url/unshorten",{shorturl:url});
        if(longurl.data.status===200){
            url_list.innerHTML=` <div class="w-100  d-flex flex-row gap-2">
            <input class="px-2 w-75 text-secondary" id="url" value="${longurl.data.url}" style="height: 7vh;border-radius: 0.375rem;border: none;line-height: 100%;" name="url" type="url" disabled>
            <button type="button" class="btn bg-secondary w-25" onclick=copyUrl("${longurl.data.url}")  type="submit" style="height: 7vh;">Copy</button>
        </div>
        <div class="w-100 d-flex flex-row">
            <label class="text-white col-lg-2 col-md-3 col-4" style="font-size: 1.2rem;" for=url-1>Short url </label>
            <a class="col-lg-10 col-md-9 col-8 nav-item" href="${url}" id="url-1" target="_blank" style="text-overflow: ellipsis;white-space:nowrap;overflow: hidden;font-size: 1.2rem;">${url}</a>
        </div>
        <div class="w-100 d-flex flex-row">
            <label class="text-white col-lg-2 col-md-3 col-4" style="font-size: 1.2rem;" for=url-1>Visits </label>
            <div class="col-lg-10 col-md-9 col-8 nav-item"  id="url-1" style="font-size: 1.2rem;">${longurl.data.visits}</div>
        </div>
        `
        showSnackBar("alert-success",`<i class="fa-solid fa-check-double "></i> ${longurl.data.message}`,"#198754a4");
        }else{
            showSnackBar("alert-danger",`<i class="fa-solid fa-bomb "></i> ${longurl.data.message}`,"#dc354696");
        }
    })
});