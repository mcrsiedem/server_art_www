 const dodaj_minuty=(data, minuty) =>{


    // let data = '2025-12-08 16:00'
    // let minuty = 1440
    let d = new Date(data)
    d.setMinutes(d.getMinutes() + minuty);
      let  month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
        let  h =  d.getHours();
       let m = d.getMinutes();

      

        if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    if (h < 10) 
        h = '0' + h;
    if (m < 10) 
        m = '0' + m;

        return [year, month, day].join('-').concat(" ").concat([h,m].join(':')); 
}


module.exports = {
    dodaj_minuty
    
}
 