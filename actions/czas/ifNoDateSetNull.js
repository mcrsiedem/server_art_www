
// dodaje null do daty

const ifNoDateSetNull = (data) =>{


    if(data == '' ^ data == null) {
      return null
    } else {
      return "'"+data+"'"
    }
    
    }


module.exports = {
    ifNoDateSetNull
    
}
 