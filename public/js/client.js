window.addEventListener('load',async ()=>{
    const form=document.getElementById("urlform");
    const api=location.protocol+"//"+ location.hostname+":"+location.port;
    let url_list=document.getElementById("urls")
    let apiurlshorten=api+"/api/url/shorten";
    const displayUrlList=async ()=>{    
        url_list.innerHTML="";
        let responseurls=await axios.get(api+"/api/url",{ withCredentials:true });
        let urls=responseurls.data.urls; 
        let count=0;
        if(urls){
        urls.forEach(element => {
            const url_item=document.createElement('div');
            url_item.id=count;
            url_item.classList.add('d-flex');
            url_item.classList.add("justify-content-between");
            url_item.classList.add("align-items-center");
            url_item.classList.add("gap-3");
            url_item.innerHTML=` <div class="col-lg-11 col-sm-12 col-12 bg-white  d-flex flex-lg-row flex-column gap-lg-4  gap-3 p-1  align-items   -center" style="min-height: 8vh;border-radius: 0.375rem;">
            <div class="col-lg-8 col-12  d-flex flex-lg-row  gap-2 justify-content-between align-items-center">
                <div class="col-lg-6 " style="white-space:nowrap;overflow: hidden;font-size: 1.2rem;width:50%;text-overflow: ellipsis;" title="${element.url.url}">${element.url.url}</div>
                <a class="col-lg-6 " href="${element.url.shortened_url}" id="url-${count}" target="_blank" style="text-overflow: ellipsis;width:50%;white-space:nowrap;overflow: hidden;font-size: 1.2rem;">${element.url.shortened_url}</a>
            </div>
            <div class="col-lg-3 col-12 d-flex flex-lg-row  gap-4 justify-content-center align-items-center">
                <i class="fa-solid fa-qrcode" title="generate QRcode" onclick=generateQR(${count},"${element.url.shortened_url}")  style="font-size: 1.5rem;"></i>
                <i class="fa-solid fa-chart-line" onclick=viewStats(${count},"${element.url._id}") title="View Stats" style="font-size: 1.5rem;"></i>
                <i class="fa-solid fa-copy" title="Copy Short URL" onclick=copyUrl(${count},"${element.url.shortened_url}") style="font-size: 1.5rem;"></i>
                <i class=" d-lg-none d-flex fa-solid fa-xmark" title="Hide" onclick=deleteUrl(${count}) style="font-size: 1.5rem;"></i>
            </div>
        </div>
        <i class="nav-item col-lg-1 d-lg-flex d-sm-none d-none fa-solid fa-xmark" title="Hide"  onclick=deleteUrl(${count}) style="font-size: 2rem;"></i>`;
        count++;
        url_list.appendChild(url_item);
        });
    }
    }
    displayUrlList();
    
    let showSnackBar=(alert,message,backgroundColor)=>{
        let x = document.getElementById("snackbar");
        x.className="show "+alert;
        x.style.backgroundColor=backgroundColor;
        x.innerHTML=message;
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }
    window.deleteUrl=(id)=>{
            axios.delete(api+"/api/url/guest/"+id).then((response)=>{
            console.log(response.data);
            if(response.data.status===201){
                showSnackBar("alert-success",`<i class="fa-solid fa-check-double "></i> ${response.data.message}`,"#198754a4");
                displayUrlList();
            }else if(response.data.status===400){
                showSnackBar("alert-danger","<i class='fa-solid fa-bomb  '></i> "+response.data.message,"#dc354696");
            }else{
                showSnackBar("alert-danger","<i class='fa-solid fa-bomb  '></i>  Something went wrong...","#dc354696");
            }
        })
    }
    window.generateQR=(id,url)=>{
        console.log(id,url);
        const myModal = new bootstrap.Modal(document.getElementById('qrModal'), focus);
        myModal.show();
        document.getElementById('loader').style.display = 'flex ';
        document.getElementById('displayqr').style.display = 'none';
        let qr=window.qr = new QRious({
            element: document.getElementById('qrcode'),
            value: url,
            size: 150,
        });
        qr.foreground="white"
        
        qr.background="black"
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
        let profile=await axios.get(api+"/api/user/profile");
        // console.log(profile);
        if(profile.data.status===401){
            showSnackBar("alert-danger","<i class='fa-solid fa-bomb  '></i> Please Login To View Stats","#dc354696");
        }
    }
    form.addEventListener('submit',async(e)=>{
        e.preventDefault();
        const url=document.getElementById("url").value;
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
});