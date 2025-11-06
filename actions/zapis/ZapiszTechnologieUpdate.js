const { connection, pool } = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");
const { zapiszTechnologieUpdate_dane } = require("./ZapiszTechnologieUpdate_dane");
const { zapiszTechnologieUpdate_produkty } = require("./ZapiszTechnologieUpdate_produkty");
const { zapiszTechnologieUpdate_elementy } = require("./ZapiszTechnologieUpdate_elementy");
const { zapiszTechnologieUpdate_procesy_elementow } = require("./ZapiszTechnologieUpdate_procesy_elementow");
const { zapiszTechnologieUpdate_oprawa } = require("./ZapiszTechnologieUpdate_oprawa");
const { zapiszTechnologieUpdate_legi } = require("./ZapiszTechnologieUpdate_legi");
const { zapiszTechnologieUpdate_legi_fragmenty } = require("./ZapiszTechnologieUpdate_legi_fragmenty");
const { zapiszTechnologieUpdate_arkusze } = require("./ZapiszTechnologieUpdate_arkusze");
const { zapiszTechnologieUpdate_fragmenty } = require("./ZapiszTechnologieUpdate_fragmenty");
const { zapiszTechnologieUpdate_alert } = require("./ZapiszTechnologieUpdate_alert");




const zapiszTechnologieUpdate = (req,res) =>{

  let daneTechEdit = req.body[0]
  let produktyTechEdit = req.body[1]
  let elementyTechEdit = req.body[2]
  let fragmentyTechEdit = req.body[3]
  let oprawaTechEdit = req.body[4]
  let legiEdit = req.body[5]
  let legiFragmentyEdit = req.body[6]
  let arkuszeEdit = req.body[7]
  let grupaWykonanEdit = req.body[8]
  let wykonaniaEdit = req.body[9]
  let procesyElementowTechEdit = req.body[10]


zapiszTechnologieUpdate_dane(daneTechEdit,res)
zapiszTechnologieUpdate_produkty(produktyTechEdit,res)
zapiszTechnologieUpdate_elementy(elementyTechEdit,res)
zapiszTechnologieUpdate_fragmenty(fragmentyTechEdit,res)
zapiszTechnologieUpdate_procesy_elementow(procesyElementowTechEdit,res)
zapiszTechnologieUpdate_oprawa(oprawaTechEdit,res)
zapiszTechnologieUpdate_legi(legiEdit,res)
zapiszTechnologieUpdate_legi_fragmenty(legiFragmentyEdit,res)
zapiszTechnologieUpdate_arkusze(arkuszeEdit,res)
zapiszTechnologieUpdate_alert(daneTechEdit,res)



res.status(201).json("");



}

module.exports = {
  zapiszTechnologieUpdate
    
}
 