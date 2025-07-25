
// dodaje null do daty

const ifNoDateSetNull_exec = (data) =>{


    if(data == '' ^ data == null) {
      return null
    } else {
      return ""+data+""
    }
    
    }


module.exports = {
    ifNoDateSetNull_exec
    
}
 